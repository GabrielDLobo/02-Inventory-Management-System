"""QA — autenticação e controle de acesso: sem token, token adulterado,
recurso inexistente, e o endpoint de reset da demo."""

from django.test import override_settings
from rest_framework.test import APITestCase
from rest_framework import status

from tests.helpers import create_demo_user, create_product


class UnauthenticatedAccessTests(APITestCase):
    def test_list_products_without_token_is_401(self):
        response = self.client.get('/api/v1/products/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_tampered_token_is_401(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer isso.nao.e.um.jwt.valido')
        response = self.client.get('/api/v1/products/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_with_bad_signature_is_401(self):
        create_demo_user()
        token_response = self.client.post(
            '/api/v1/authentication/token/', {'username': 'demo', 'password': 'demo1234'}, format='json'
        )
        access = token_response.data['access']
        # Muda o último caractere da assinatura: continua "parecendo" um JWT,
        # mas a assinatura não bate mais.
        tampered = access[:-1] + ('a' if access[-1] != 'a' else 'b')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {tampered}')
        response = self.client.get('/api/v1/products/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class NotFoundHandlingTests(APITestCase):
    def setUp(self):
        self.client.force_authenticate(user=create_demo_user())

    def test_unknown_product_id_is_404(self):
        response = self.client.get('/api/v1/products/999999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unknown_route_is_404(self):
        response = self.client.get('/api/v1/isso-nao-existe/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_and_delete_not_exposed_for_inflow(self):
        """inflows/urls.py só expõe list/create/retrieve — nunca update/delete.
        O demo também não tem change_inflow/delete_inflow (seed_demo.py), e
        o DjangoModelPermissions barra isso com 403 antes mesmo de o DRF
        checar se o método existe na view — resultado prático é o mesmo
        (bloqueado), só o código HTTP que é 403 em vez de 404/405."""
        response_patch = self.client.patch('/api/v1/inflows/1/', {'quantity': 1}, format='json')
        response_delete = self.client.delete('/api/v1/inflows/1/')
        self.assertEqual(response_patch.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response_delete.status_code, status.HTTP_403_FORBIDDEN)


@override_settings(RESET_TOKEN='segredo-de-teste')
class ResetDemoEndpointTests(APITestCase):
    def test_reset_without_token_is_forbidden(self):
        response = self.client.post('/api/reset-demo/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_reset_with_wrong_token_is_forbidden(self):
        response = self.client.post('/api/reset-demo/', HTTP_X_RESET_TOKEN='token-errado')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_reset_with_correct_token_succeeds(self):
        create_product()
        response = self.client.post('/api/reset-demo/', HTTP_X_RESET_TOKEN='segredo-de-teste')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_reset_get_is_not_allowed(self):
        """view usa @require_POST: GET não deve disparar o reset."""
        response = self.client.get('/api/reset-demo/?token=segredo-de-teste')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
