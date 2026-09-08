"""QA — o usuário demo tem permissões cortadas (seed_demo.py) e não deve
alcançar nada de gestão de usuários/admin, nem escalar privilégio."""

from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status

from tests.helpers import create_demo_user, create_product

User = get_user_model()


class DemoUserScopeTests(APITestCase):
    def setUp(self):
        self.user = create_demo_user()
        self.client.force_authenticate(user=self.user)

    def test_demo_is_not_staff_or_superuser(self):
        self.assertFalse(self.user.is_staff)
        self.assertFalse(self.user.is_superuser)

    def test_demo_cannot_reach_django_admin(self):
        response = self.client.get('/admin/', follow=False)
        # is_staff=False: Django manda pra tela de login do admin (302),
        # nunca deixa entrar (200 só aconteceria autenticado E staff).
        self.assertIn(response.status_code, (302, 403))

    def test_no_user_management_endpoint_is_exposed(self):
        """Não existe (e nunca existiu) endpoint de usuários na API: confirma
        que tentativas de descobrir/usar um retornam 404, não vazam nada."""
        guessed_paths = [
            '/api/v1/users/',
            '/api/v1/user/',
            '/api/v1/auth/users/',
            '/api/v1/accounts/',
            '/api/v1/permissions/',
            '/api/v1/groups/',
        ]
        for path in guessed_paths:
            with self.subTest(path=path):
                response = self.client.get(path)
                self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_demo_cannot_create_another_user_via_any_known_route(self):
        before = User.objects.count()
        for path in ('/api/v1/users/', '/api/v1/auth/users/'):
            self.client.post(path, {'username': 'invasor', 'password': 'x'}, format='json')
        self.assertEqual(User.objects.count(), before, 'nenhum usuário novo deveria ter sido criado')

    def test_demo_cannot_grant_itself_staff_via_products_api(self):
        """Não há campo de usuário exposto em nenhum serializer de domínio,
        então não há como injetar is_staff/is_superuser por payload."""
        create_product()
        response = self.client.patch(
            f'/api/v1/products/{create_product(title="Outro").id}/',
            {'is_staff': True, 'is_superuser': True},
            format='json',
        )
        self.user.refresh_from_db()
        self.assertFalse(self.user.is_staff)
        self.assertFalse(self.user.is_superuser)
        self.assertIn(response.status_code, (200, 400))


class NoPermissionUserTests(APITestCase):
    """Um usuário autenticado sem NENHUMA permissão explícita — prova que
    DjangoModelPermissions está de fato em vigor, não só configurado."""

    def setUp(self):
        self.user = User.objects.create_user(username='sem_permissao', password='x12345678')
        self.client.force_authenticate(user=self.user)
        self.product = create_product()

    def test_cannot_create_product(self):
        response = self.client.post('/api/v1/products/', {
            'title': 'Hack', 'category': self.product.category_id, 'brand': self.product.brand_id,
            'cost_price': '1.00', 'selling_price': '2.00', 'quantity': 1,
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_cannot_delete_product(self):
        response = self.client.delete(f'/api/v1/products/{self.product.id}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_can_still_read_list(self):
        # GET não exige permissão de model (DjangoModelPermissions só olha
        # write); confirma que isso é intencional e não um furo.
        response = self.client.get('/api/v1/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
