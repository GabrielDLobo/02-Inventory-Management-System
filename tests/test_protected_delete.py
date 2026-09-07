"""QA — excluir um registro referenciado por FK PROTECT deve dar erro
tratado (409), nunca 500. Cobre app/api_mixins.py."""

from rest_framework.test import APITestCase
from rest_framework import status

from inflows.models import Inflow
from tests.helpers import create_demo_user, create_product, create_supplier


class ProtectedDeleteTests(APITestCase):
    def setUp(self):
        self.user = create_demo_user()
        self.client.force_authenticate(user=self.user)

    def test_delete_product_with_movements_is_handled(self):
        product = create_product(quantity=10)
        supplier = create_supplier()
        Inflow.objects.create(product=product, supplier=supplier, quantity=10, description='teste')

        response = self.client.delete(f'/api/v1/products/{product.id}/')

        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertIn('detail', response.data)
        self.assertTrue(type(product).objects.filter(pk=product.id).exists())

    def test_delete_category_with_product_is_handled(self):
        product = create_product()
        response = self.client.delete(f'/api/v1/categories/{product.category_id}/')
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_delete_brand_with_product_is_handled(self):
        product = create_product()
        response = self.client.delete(f'/api/v1/brands/{product.brand_id}/')
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_delete_supplier_with_inflow_is_handled(self):
        product = create_product()
        supplier = create_supplier()
        Inflow.objects.create(product=product, supplier=supplier, quantity=5, description='teste')
        response = self.client.delete(f'/api/v1/suppliers/{supplier.id}/')
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_delete_product_without_movements_succeeds(self):
        product = create_product()
        response = self.client.delete(f'/api/v1/products/{product.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
