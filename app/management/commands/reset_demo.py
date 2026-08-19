from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.db import transaction

from brands.models import Brand
from categories.models import Category
from inflows.models import Inflow
from outflows.models import Outflow
from products.models import Product
from suppliers.models import Supplier


class Command(BaseCommand):
    help = 'Apaga os dados de demonstração (produtos, marcas, categorias, fornecedores, entradas/saídas) e roda o seed_demo novamente.'

    @transaction.atomic
    def handle(self, *args, **options):
        # Ordem respeita as FKs com on_delete=PROTECT.
        Outflow.objects.all().delete()
        Inflow.objects.all().delete()
        Product.objects.all().delete()
        Category.objects.all().delete()
        Brand.objects.all().delete()
        Supplier.objects.all().delete()

        self.stdout.write(self.style.WARNING('Dados de demonstração apagados.'))

        call_command('seed_demo')

        self.stdout.write(self.style.SUCCESS('Ambiente de demonstração reiniciado.'))
