"""QA — /api/v1/ai/: exige autenticação, trata falha da OpenAI sem vazar
traceback, e tem throttle (cada chamada custa dinheiro de verdade)."""

from unittest.mock import patch

from django.core.cache import cache
from rest_framework.test import APITestCase
from rest_framework import status

from ai.models import AIResult
from tests.helpers import create_demo_user


class AIEndpointAuthTests(APITestCase):
    def test_latest_requires_authentication(self):
        response = self.client.get('/api/v1/ai/latest/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_invoke_requires_authentication(self):
        response = self.client.post('/api/v1/ai/invoke/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class AIEndpointBehaviorTests(APITestCase):
    def setUp(self):
        cache.clear()  # throttle guarda contadores no cache; isola dos outros testes
        self.client.force_authenticate(user=create_demo_user())

    def test_latest_with_no_result_yet_returns_null(self):
        response = self.client.get('/api/v1/ai/latest/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNone(response.data)

    @patch('ai.views.SGEAgent')
    def test_invoke_success_persists_and_returns_result(self, mock_agent_cls):
        def fake_invoke():
            AIResult.objects.create(result='Análise de teste.')

        mock_agent_cls.return_value.invoke.side_effect = fake_invoke

        response = self.client.post('/api/v1/ai/invoke/')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['result'], 'Análise de teste.')

    @patch('ai.views.SGEAgent')
    def test_invoke_failure_returns_clean_502_not_a_traceback(self, mock_agent_cls):
        mock_agent_cls.return_value.invoke.side_effect = RuntimeError('OpenAI indisponível')

        response = self.client.post('/api/v1/ai/invoke/')

        self.assertEqual(response.status_code, status.HTTP_502_BAD_GATEWAY)
        self.assertIn('detail', response.data)
        self.assertNotIn('Traceback', str(response.data))
        self.assertNotIn('RuntimeError', str(response.data))

    @patch('ai.views.SGEAgent')
    def test_invoke_is_rate_limited(self, mock_agent_cls):
        """DEFAULT_THROTTLE_RATES['ai_invoke'] = '10/hour' (app/settings.py):
        a 11ª chamada na mesma hora tem que ser barrada com 429, senão o
        endpoint fica aberto pra gerar custo de OpenAI sem limite."""
        mock_agent_cls.return_value.invoke.side_effect = lambda: AIResult.objects.create(result='ok')

        for i in range(10):
            response = self.client.post('/api/v1/ai/invoke/')
            self.assertEqual(response.status_code, status.HTTP_201_CREATED, f'chamada {i + 1}/10 deveria passar')

        blocked = self.client.post('/api/v1/ai/invoke/')
        self.assertEqual(blocked.status_code, status.HTTP_429_TOO_MANY_REQUESTS)
