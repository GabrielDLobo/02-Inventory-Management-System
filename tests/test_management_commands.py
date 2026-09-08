"""QA — seed_demo/reset_demo (docs/QA_CHECKLIST.md, passo 1 de preparação)
rodam sem erro e deixam o ambiente coerente."""

from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import TestCase

from inflows.models import Inflow
from outflows.models import Outflow
from products.models import Product

User = get_user_model()


class SeedDemoCommandTests(TestCase):
    def test_seed_demo_runs_and_creates_coherent_data(self):
        call_command('seed_demo')

        demo = User.objects.get(username='demo')
        self.assertFalse(demo.is_staff)
        self.assertFalse(demo.is_superuser)
        self.assertTrue(demo.check_password('demo1234'))

        self.assertGreater(Product.objects.count(), 0)
        for product in Product.objects.all():
            with self.subTest(product=product.title):
                self.assertGreaterEqual(product.quantity, 0, 'seed nunca deveria gerar estoque negativo')

    def test_seed_demo_is_idempotent(self):
        call_command('seed_demo')
        first_count = Product.objects.count()
        call_command('seed_demo')
        self.assertEqual(Product.objects.count(), first_count)

    def test_reset_demo_clears_and_reseeds(self):
        call_command('seed_demo')
        call_command('reset_demo')

        self.assertGreater(Product.objects.count(), 0)
        demo = User.objects.get(username='demo')
        self.assertTrue(demo.check_password('demo1234'))

    def test_reset_demo_resets_a_changed_password(self):
        call_command('seed_demo')
        demo = User.objects.get(username='demo')
        demo.set_password('senha-trocada-por-um-visitante')
        demo.save()

        call_command('reset_demo')

        demo.refresh_from_db()
        self.assertTrue(demo.check_password('demo1234'), 'reset_demo deveria restaurar a senha padrão')

    def test_reset_demo_removes_manually_created_movements(self):
        """Achado do QA da Fase 3: seed_demo sozinho NÃO limpa registros
        extras criados manualmente; só reset_demo apaga tudo antes de
        reseedar. Este teste documenta essa diferença de comportamento."""
        call_command('seed_demo')
        product = Product.objects.first()
        Outflow.objects.create(product=product, quantity=1, description='criado manualmente no teste')
        manual_outflow_id = Outflow.objects.filter(description='criado manualmente no teste').first().id

        call_command('seed_demo')  # não deveria remover o registro manual
        self.assertTrue(Outflow.objects.filter(id=manual_outflow_id).exists())

        call_command('reset_demo')  # deveria remover
        self.assertFalse(Outflow.objects.filter(id=manual_outflow_id).exists())
