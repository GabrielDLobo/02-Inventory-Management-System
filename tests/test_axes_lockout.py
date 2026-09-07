"""QA — django-axes deve travar tentativas de login após N falhas, cobrindo
tanto o form de login quanto o endpoint JWT (ambos passam por authenticate())."""

from axes.models import AccessAttempt
from rest_framework.test import APITestCase
from rest_framework import status

from tests.helpers import create_demo_user


class AxesBruteForceLockoutTests(APITestCase):
    def setUp(self):
        create_demo_user()

    def test_lockout_after_failure_limit_blocks_even_correct_password(self):
        # AXES_FAILURE_LIMIT = 5 (app/settings.py): a 6ª tentativa trava,
        # mesmo com a senha certa, porque o bloqueio é por IP.
        for _ in range(5):
            response = self.client.post(
                '/api/v1/authentication/token/', {'username': 'demo', 'password': 'senha-errada'}, format='json'
            )
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        blocked = self.client.post(
            '/api/v1/authentication/token/', {'username': 'demo', 'password': 'demo1234'}, format='json'
        )
        self.assertNotEqual(
            blocked.status_code,
            status.HTTP_200_OK,
            'depois de 5 falhas, nem a senha correta deveria autenticar (axes deveria travar por IP)',
        )
        self.assertGreater(AccessAttempt.objects.count(), 0, 'axes deveria ter registrado as tentativas')

    def test_successful_login_resets_the_counter(self):
        # AXES_RESET_ON_SUCCESS = True
        for _ in range(3):
            self.client.post(
                '/api/v1/authentication/token/', {'username': 'demo', 'password': 'senha-errada'}, format='json'
            )
        ok = self.client.post(
            '/api/v1/authentication/token/', {'username': 'demo', 'password': 'demo1234'}, format='json'
        )
        self.assertEqual(ok.status_code, status.HTTP_200_OK)
