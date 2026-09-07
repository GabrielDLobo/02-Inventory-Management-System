from datetime import timedelta
import random

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

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

CATEGORIES = ['Informática', 'Papelaria', 'Móveis de Escritório', 'Limpeza',
              'Eletrônicos', 'Alimentos', 'Bebidas', 'Higiene']

BRANDS = ['TechNova', 'ByteMax', 'EscritaBem', 'Confortável Móveis', 'LimpaTudo',
          'PowerVolt', 'NutriMais', 'AquaPura', 'HigienePlus', 'OfficePro']

SUPPLIERS = [
    'Distribuidora Horizonte Ltda', 'Comercial Nordeste Suprimentos',
    'Fornecedora Atlântica', 'Central de Insumos SP',
    'Atacadão Sul Distribuição', 'Prime Importadora',
]

# (título, categoria, marca, nº série, custo, venda, estoque_atual)
PRODUCTS = [
    ('Notebook UltraSlim 14"', 'Informática', 'TechNova', 'SN-NB14-001', '2200.00', '3200.00', 18),
    ('Mouse sem Fio ByteMax X200', 'Informática', 'ByteMax', 'SN-MS200-014', '35.00', '69.00', 82),
    ('Teclado Mecânico ByteMax K80', 'Informática', 'ByteMax', 'SN-KB80-027', '150.00', '249.00', 40),
    ('Monitor LED 24" Full HD', 'Informática', 'TechNova', 'SN-MN24-009', '650.00', '999.00', 25),
    ('Webcam HD 1080p', 'Informática', 'TechNova', 'SN-WC1080-31', '120.00', '199.00', 7),
    ('Hub USB-C 6 em 1', 'Informática', 'ByteMax', 'SN-HUB6-42', '90.00', '169.00', 33),
    ('Cadeira Ergonômica ConfortPro', 'Móveis de Escritório', 'Confortável Móveis', 'SN-CD-CP-3', '480.00', '750.00', 20),
    ('Mesa de Escritório Compacta', 'Móveis de Escritório', 'Confortável Móveis', 'SN-MS-CP-5', '350.00', '599.00', 10),
    ('Suporte para Monitor Articulado', 'Móveis de Escritório', 'OfficePro', 'SN-SP-MON-8', '160.00', '279.00', 14),
    ('Caneta Esferográfica Azul (Cx 50un)', 'Papelaria', 'EscritaBem', 'SN-CN-AZ-50', '18.00', '35.00', 55),
    ('Papel Sulfite A4 500fls (Resma)', 'Papelaria', 'EscritaBem', 'SN-PP-A4-500', '18.00', '32.00', 120),
    ('Caderno Universitário 200fls', 'Papelaria', 'EscritaBem', 'SN-CD-200-11', '14.00', '27.00', 9),
    ('Grampeador de Mesa Metal', 'Papelaria', 'OfficePro', 'SN-GR-MT-17', '22.00', '45.00', 38),
    ('Detergente Multiuso 5L', 'Limpeza', 'LimpaTudo', 'SN-DT-5L-01', '12.00', '25.00', 64),
    ('Álcool em Gel 500ml', 'Limpeza', 'LimpaTudo', 'SN-AG-500-02', '6.00', '14.00', 150),
    ('Álcool 70% 1L', 'Limpeza', 'LimpaTudo', 'SN-AL70-1L-9', '7.00', '16.00', 8),
    ('Pano Multiuso (Pct 5un)', 'Limpeza', 'LimpaTudo', 'SN-PN-5-23', '9.00', '19.00', 47),
    ('Carregador USB-C 65W', 'Eletrônicos', 'PowerVolt', 'SN-CG-65W-04', '80.00', '149.00', 29),
    ('Cabo HDMI 2.0 2m', 'Eletrônicos', 'PowerVolt', 'SN-HDMI-2M-6', '25.00', '49.00', 71),
    ('Filtro de Linha 6 Tomadas', 'Eletrônicos', 'PowerVolt', 'SN-FL-6T-19', '40.00', '79.00', 6),
    ('Pilha Alcalina AA (Cartela 4un)', 'Eletrônicos', 'PowerVolt', 'SN-PL-AA-4-2', '12.00', '24.00', 96),
    ('Café Torrado e Moído 1kg', 'Alimentos', 'NutriMais', 'SN-CF-1KG-07', '22.00', '39.00', 15),
    ('Biscoito Integral (Cx 20un)', 'Alimentos', 'NutriMais', 'SN-BI-20-13', '30.00', '55.00', 42),
    ('Açúcar Refinado 5kg', 'Alimentos', 'NutriMais', 'SN-AC-5KG-28', '18.00', '33.00', 5),
    ('Água Mineral 500ml (Fardo 12un)', 'Bebidas', 'AquaPura', 'SN-AG-12-01', '14.00', '28.00', 60),
    ('Refrigerante Cola 2L', 'Bebidas', 'AquaPura', 'SN-RF-2L-15', '6.00', '12.00', 88),
    ('Suco Natural Laranja 1L', 'Bebidas', 'AquaPura', 'SN-SC-1L-33', '7.00', '15.00', 7),
    ('Papel Higiênico (Pct 12un)', 'Higiene', 'HigienePlus', 'SN-PH-12-05', '20.00', '38.00', 34),
    ('Sabonete Líquido 250ml', 'Higiene', 'HigienePlus', 'SN-SB-250-22', '8.00', '17.00', 51),
    ('Toalha de Papel (Rolo 2un)', 'Higiene', 'HigienePlus', 'SN-TP-2-40', '11.00', '22.00', 9),
    ('Smartphone Entrada 64GB', 'Eletrônicos', 'PowerVolt', 'SN-SM-64-51', '780.00', '1150.00', 12),
    ('Fone Bluetooth In-Ear', 'Eletrônicos', 'ByteMax', 'SN-FN-BT-58', '95.00', '179.00', 26),
]

LOW_STOCK_THRESHOLD = 10  # itens abaixo disso entram nos alertas do dashboard


class Command(BaseCommand):
    help = 'Popula o banco com o usuário e os dados fictícios do ambiente de demonstração (idempotente).'

    def add_arguments(self, parser):
        parser.add_argument('--seed', type=int, default=None, help='Semente aleatória (movimentações reproduzíveis).')

    @transaction.atomic
    def handle(self, *args, **options):
        if options.get('seed') is not None:
            random.seed(options['seed'])
        self._create_demo_user()
        categories = self._get_or_create_simple(Category, CATEGORIES)
        brands = self._get_or_create_simple(Brand, BRANDS)
        suppliers = self._get_or_create_simple(Supplier, SUPPLIERS)
        products = self._create_products(categories, brands)
        self._create_movements(products, suppliers)
        total = sum(p.quantity for p in products.values())
        baixo = sum(1 for p in products.values() if p.quantity < LOW_STOCK_THRESHOLD)
        self.stdout.write(self.style.SUCCESS(
            f'Dados de demonstração prontos: {len(products)} produtos, {total} unidades em estoque, '
            f'{baixo} com estoque baixo.'))

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
        return {name: model.objects.get_or_create(name=name)[0] for name in names}

    def _create_products(self, categories, brands):
        products = {}
        for title, cat, brand, serie, cost, sell, qty in PRODUCTS:
            product, created = Product.objects.get_or_create(
                title=title,
                defaults={
                    'category': categories[cat], 'brand': brands[brand],
                    'serie_number': serie, 'cost_price': cost, 'selling_price': sell,
                    'quantity': qty,
                    'description': f'{title} — produto fictício do ambiente de demonstração.',
                },
            )
            if not created:
                product.quantity = qty
                product.save(update_fields=['quantity'])
            products[title] = product
        return products

    def _create_movements(self, products, suppliers):
        """Gera entradas e saídas datadas ao longo dos últimos ~45 dias, coerentes com o estoque atual."""
        if Inflow.objects.exists() or Outflow.objects.exists():
            return
        supplier_list = list(suppliers.values())
        now = timezone.now()

        for product in products.values():
            estoque = product.quantity
            # Entradas: o estoque atual + o que já saiu. Distribui em 2-3 entradas.
            saidas_total = random.randint(0, max(5, estoque // 3))
            entradas_total = estoque + saidas_total
            n_ent = random.randint(2, 3)
            restante = entradas_total
            for i in range(n_ent):
                q = restante if i == n_ent - 1 else max(1, restante // (n_ent - i) + random.randint(-3, 3))
                q = max(1, min(q, restante))
                restante -= q
                inf = Inflow.objects.create(
                    product=product, supplier=random.choice(supplier_list), quantity=q,
                    description='Reposição de estoque (dado fictício).')
                self._backdate(Inflow, inf.pk, now - timedelta(days=random.randint(2, 45), hours=random.randint(0, 23)))
                if restante <= 0:
                    break
            # Saídas: distribui o total de saídas em movimentos recentes.
            restante = saidas_total
            while restante > 0:
                q = min(restante, random.randint(1, 8))
                restante -= q
                out = Outflow.objects.create(
                    product=product, quantity=q, description='Venda de demonstração (dado fictício).')
                self._backdate(Outflow, out.pk, now - timedelta(days=random.randint(0, 30), hours=random.randint(0, 23)))

    @staticmethod
    def _backdate(model, pk, dt):
        # .update() não dispara auto_now_add/auto_now, então ajusta a data do movimento.
        model.objects.filter(pk=pk).update(created_at=dt, updated_at=dt)
