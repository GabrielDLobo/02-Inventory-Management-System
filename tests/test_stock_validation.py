"""QA — estoque nunca pode ficar negativo (achado crítico da Fase 3: uma
saída de 999 unidades de um produto com 5 em estoque era aceita pela API).
Cobre outflows/serializers.py, inflows/serializers.py e products/serializers.py."""

from rest_framework.test import APITestCase
from rest_framework import status

from outflows.models import Outflow
from inflows.models import Inflow
from products.models import Product
from tests.helpers import create_demo_user, create_product, create_supplier


class OutflowStockValidationTests(APITestCase):
    def setUp(self):
        self.user = create_demo_user()
        self.client.force_authenticate(user=self.user)
        self.product = create_product(quantity=5)
        self.url = '/api/v1/outflows/'

    def test_outflow_exceeding_stock_is_rejected(self):
        response = self.client.post(self.url, {'product': self.product.id, 'quantity': 999}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('quantity', response.data)
        self.product.refresh_from_db()
        self.assertEqual(self.product.quantity, 5, 'estoque não pode ter sido alterado')
        self.assertEqual(Outflow.objects.count(), 0)

    def test_outflow_never_leaves_stock_negative(self):
        """Mesmo em sequência (duas saídas que juntas excederiam o estoque),
        a segunda deve ser rejeitada antes de zerar/negativar o produto."""
        first = self.client.post(self.url, {'product': self.product.id, 'quantity': 5}, format='json')
        self.assertEqual(first.status_code, status.HTTP_201_CREATED)
        self.product.refresh_from_db()
        self.assertEqual(self.product.quantity, 0)

        second = self.client.post(self.url, {'product': self.product.id, 'quantity': 1}, format='json')
        self.assertEqual(second.status_code, status.HTTP_400_BAD_REQUEST)
        self.product.refresh_from_db()
        self.assertGreaterEqual(self.product.quantity, 0)

    def test_outflow_zero_quantity_is_rejected(self):
        response = self.client.post(self.url, {'product': self.product.id, 'quantity': 0}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Outflow.objects.count(), 0)

    def test_outflow_negative_quantity_is_rejected(self):
        response = self.client.post(self.url, {'product': self.product.id, 'quantity': -10}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Outflow.objects.count(), 0)

    def test_outflow_nonexistent_product_is_rejected(self):
        response = self.client.post(self.url, {'product': 999999, 'quantity': 1}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Outflow.objects.count(), 0)

    def test_valid_outflow_reduces_stock(self):
        response = self.client.post(self.url, {'product': self.product.id, 'quantity': 3}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.product.refresh_from_db()
        self.assertEqual(self.product.quantity, 2)


class InflowValidationTests(APITestCase):
    def setUp(self):
        self.user = create_demo_user()
        self.client.force_authenticate(user=self.user)
        self.product = create_product(quantity=10)
        self.supplier = create_supplier()
        self.url = '/api/v1/inflows/'

    def test_valid_inflow_increases_stock(self):
        response = self.client.post(
            self.url,
            {'supplier': self.supplier.id, 'product': self.product.id, 'quantity': 20},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.product.refresh_from_db()
        self.assertEqual(self.product.quantity, 30)

    def test_zero_quantity_inflow_is_rejected(self):
        response = self.client.post(
            self.url,
            {'supplier': self.supplier.id, 'product': self.product.id, 'quantity': 0},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Inflow.objects.count(), 0)

    def test_negative_quantity_inflow_is_rejected(self):
        response = self.client.post(
            self.url,
            {'supplier': self.supplier.id, 'product': self.product.id, 'quantity': -5},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Inflow.objects.count(), 0)


class ProductValidationTests(APITestCase):
    def setUp(self):
        self.user = create_demo_user()
        self.client.force_authenticate(user=self.user)
        self.category = create_product().category  # garante categoria/marca existentes
        self.url = '/api/v1/products/'

    def _payload(self, **overrides):
        payload = {
            'title': 'Produto de teste',
            'category': self.category.id,
            'brand': Product.objects.first().brand.id,
            'cost_price': '10.00',
            'selling_price': '20.00',
            'quantity': 5,
        }
        payload.update(overrides)
        return payload

    def test_negative_quantity_is_rejected(self):
        response = self.client.post(self.url, self._payload(quantity=-1), format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_zero_or_negative_cost_price_is_rejected(self):
        response = self.client.post(self.url, self._payload(cost_price='0.00'), format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_zero_or_negative_selling_price_is_rejected(self):
        response = self.client.post(self.url, self._payload(selling_price='-5.00'), format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_valid_product_is_created(self):
        response = self.client.post(self.url, self._payload(), format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
