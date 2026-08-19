from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.core.management.base import BaseCommand
from django.db import transaction

from brands.models import Brand
from categories.models import Category
from inflows.models import Inflow
from outflows.models import Outflow
from products.models import Product
from suppliers.models import Supplier

DEMO_USERNAME = 'demo'
DEMO_PASSWORD = 'demo1234'

# Permissões de uso das telas principais (sem acesso a auth.User/Group/admin).
DEMO_PERMISSIONS = {
    'products': ('view_product', 'add_product', 'change_product', 'delete_product'),
    'categories': ('view_category', 'add_category', 'change_category', 'delete_category'),
    'brands': ('view_brand', 'add_brand', 'change_brand', 'delete_brand'),
    'suppliers': ('view_supplier', 'add_supplier', 'change_supplier', 'delete_supplier'),
    'inflows': ('view_inflow', 'add_inflow'),
    'outflows': ('view_outflow', 'add_outflow'),
}

CATEGORIES = ['Informática', 'Papelaria', 'Móveis de Escritório', 'Limpeza']

BRANDS = ['TechNova', 'ByteMax', 'EscritaBem', 'Confortável Móveis', 'LimpaTudo']

SUPPLIERS = [
    'Distribuidora Horizonte Ltda',
    'Comercial Nordeste Suprimentos',
    'Fornecedora Atlântica',
    'Central de Insumos SP',
]

# (título, categoria, marca, nº de série, preço custo, preço venda, qtd entrada, qtd saída, fornecedor)
PRODUCTS = [
    ('Notebook UltraSlim 14"', 'Informática', 'TechNova', 'SN-NB14-001', '2200.00', '3200.00', 20, 5, 'Distribuidora Horizonte Ltda'),
    ('Mouse sem Fio ByteMax X200', 'Informática', 'ByteMax', 'SN-MS200-014', '35.00', '69.00', 100, 20, 'Central de Insumos SP'),
    ('Teclado Mecânico ByteMax K80', 'Informática', 'ByteMax', 'SN-KB80-027', '150.00', '249.00', 50, 10, 'Central de Insumos SP'),
    ('Monitor LED 24" Full HD', 'Informática', 'TechNova', 'SN-MN24-009', '650.00', '999.00', 30, 5, 'Distribuidora Horizonte Ltda'),
    ('Cadeira Ergonômica ConfortPro', 'Móveis de Escritório', 'Confortável Móveis', 'SN-CD-CP-3', '480.00', '750.00', 25, 5, 'Fornecedora Atlântica'),
    ('Mesa de Escritório Compacta', 'Móveis de Escritório', 'Confortável Móveis', 'SN-MS-CP-5', '350.00', '599.00', 12, 2, 'Fornecedora Atlântica'),
    ('Caneta Esferográfica Azul (Cx 50un)', 'Papelaria', 'EscritaBem', 'SN-CN-AZ-50', '18.00', '35.00', 60, 15, 'Comercial Nordeste Suprimentos'),
    ('Papel Sulfite A4 500fls (Resma)', 'Papelaria', 'EscritaBem', 'SN-PP-A4-500', '18.00', '32.00', 120, 20, 'Comercial Nordeste Suprimentos'),
    ('Detergente Multiuso 5L', 'Limpeza', 'LimpaTudo', 'SN-DT-5L-01', '12.00', '25.00', 80, 20, 'Comercial Nordeste Suprimentos'),
    ('Álcool em Gel 500ml', 'Limpeza', 'LimpaTudo', 'SN-AG-500-02', '6.00', '14.00', 180, 30, 'Comercial Nordeste Suprimentos'),
]


class Command(BaseCommand):
    help = 'Popula o banco com o usuário e os dados fictícios do ambiente de demonstração (idempotente).'

    @transaction.atomic
    def handle(self, *args, **options):
        self._create_demo_user()
        categories = self._get_or_create_simple(Category, CATEGORIES)
        brands = self._get_or_create_simple(Brand, BRANDS)
        suppliers = self._get_or_create_simple(Supplier, SUPPLIERS)
        products = self._create_products(categories, brands)
        self._create_movements(products, suppliers)

        self.stdout.write(self.style.SUCCESS('Dados de demonstração prontos.'))

    def _create_demo_user(self):
        User = get_user_model()
        user, _ = User.objects.get_or_create(
            username=DEMO_USERNAME,
            defaults={'is_staff': False, 'is_superuser': False, 'is_active': True},
        )
        user.is_staff = False
        user.is_superuser = False
        user.is_active = True
        user.set_password(DEMO_PASSWORD)
        user.save()

        permissions = []
        for app_label, codenames in DEMO_PERMISSIONS.items():
            permissions.extend(
                Permission.objects.filter(content_type__app_label=app_label, codename__in=codenames)
            )
        user.user_permissions.set(permissions)

        self.stdout.write(self.style.SUCCESS(f'Usuário demo pronto: {DEMO_USERNAME}/{DEMO_PASSWORD}'))

    def _get_or_create_simple(self, model, names):
        objects = {}
        for name in names:
            obj, _ = model.objects.get_or_create(name=name)
            objects[name] = obj
        return objects

    def _create_products(self, categories, brands):
        products = {}
        for title, category_name, brand_name, serie_number, cost_price, selling_price, _, _, _ in PRODUCTS:
            product, _ = Product.objects.get_or_create(
                title=title,
                defaults={
                    'category': categories[category_name],
                    'brand': brands[brand_name],
                    'serie_number': serie_number,
                    'cost_price': cost_price,
                    'selling_price': selling_price,
                    'description': f'{title} — produto fictício do ambiente de demonstração.',
                },
            )
            products[title] = product
        return products

    def _create_movements(self, products, suppliers):
        if Inflow.objects.exists() or Outflow.objects.exists():
            return

        for title, _, _, _, _, _, inflow_qty, outflow_qty, supplier_name in PRODUCTS:
            product = products[title]
            Inflow.objects.create(
                product=product,
                supplier=suppliers[supplier_name],
                quantity=inflow_qty,
                description='Reposição de estoque inicial (dado fictício).',
            )
            Outflow.objects.create(
                product=product,
                quantity=outflow_qty,
                description='Venda de demonstração (dado fictício).',
            )
