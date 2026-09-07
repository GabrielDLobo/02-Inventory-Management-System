"""QA — XSS armazenado e SQLi. O backend não tem SQL cru em lugar nenhum
(grep confirmou: só ORM) nem o frontend usa dangerouslySetInnerHTML (grep
confirmou), então a defesa real de XSS é o escape automático do React ao
renderizar texto — este arquivo confirma que o payload sobrevive intacto
como string (não é executado nem sanitizado no servidor, como esperado de
uma API JSON) e que os filtros baseados em ORM não quebram com SQLi."""

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.test import Client, TestCase
from rest_framework.test import APITestCase
from rest_framework import status

from tests.helpers import create_demo_user, create_product

User = get_user_model()

XSS_PAYLOAD = '<script>alert(document.cookie)</script>'
SQLI_PAYLOAD = "x'; DROP TABLE products_product; --"


class StoredPayloadTests(APITestCase):
    def setUp(self):
        self.client.force_authenticate(user=create_demo_user())

    def test_xss_payload_in_product_title_is_stored_as_plain_text(self):
        product = create_product(title=XSS_PAYLOAD)
        response = self.client.get(f'/api/v1/products/{product.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # JSON, não HTML: o valor volta como string literal, e quem renderiza
        # (React) escapa por padrão — não há dangerouslySetInnerHTML no
        # frontend (confirmado por grep no código-fonte).
        self.assertEqual(response.data['title'], XSS_PAYLOAD)

    def test_sqli_payload_in_description_does_not_break_anything(self):
        product = create_product(description=SQLI_PAYLOAD)
        response = self.client.get('/api/v1/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        from products.models import Product
        self.assertTrue(Product.objects.filter(pk=product.pk).exists(), 'a tabela não pode ter sido afetada')


class LegacyTemplateFilterInjectionTests(TestCase):
    """products/views.py (template antigo) usa `.filter(title__icontains=...)`
    — parametrizado pelo ORM. Confirma que um payload de SQLi no querystring
    não derruba a view nem afeta o banco."""

    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='demo_legacy', password='demo1234')
        self.user.user_permissions.add(
            Permission.objects.get(content_type__app_label='products', codename='view_product')
        )
        self.client.force_login(self.user)
        create_product()

    def test_sqli_in_query_param_does_not_error(self):
        from products.models import Product
        before = Product.objects.count()
        response = self.client.get('/products/list/', {'title': SQLI_PAYLOAD})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Product.objects.count(), before)
