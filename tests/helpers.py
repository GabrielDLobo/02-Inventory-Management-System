"""Fixtures compartilhadas pela suíte de QA (tests/). Não usa pytest: a
suíte roda com o test runner padrão do Django (`manage.py test`), sem
dependência nova."""

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission

from app.management.commands.seed_demo import DEMO_PASSWORD, DEMO_PERMISSIONS, DEMO_USERNAME
from brands.models import Brand
from categories.models import Category
from products.models import Product
from suppliers.models import Supplier

User = get_user_model()


def create_demo_user():
    """Replica exatamente as permissões que seed_demo.py concede ao usuário
    demo — sem chamar o management command, pra não depender de I/O e ficar
    rápido, mas usando a mesma fonte de verdade (DEMO_PERMISSIONS)."""
    user = User.objects.create_user(username=DEMO_USERNAME, password=DEMO_PASSWORD)
    permissions = []
    for app_label, codenames in DEMO_PERMISSIONS.items():
        permissions.extend(
            Permission.objects.filter(content_type__app_label=app_label, codename__in=codenames)
        )
    user.user_permissions.set(permissions)
    return user


def create_staff_user(username='staff', password='staffpass123'):
    return User.objects.create_user(username=username, password=password, is_staff=True)


def create_category(name='Informática', **kwargs):
    return Category.objects.create(name=name, **kwargs)


def create_brand(name='TechNova', **kwargs):
    return Brand.objects.create(name=name, **kwargs)


def create_supplier(name='Distribuidora Horizonte', **kwargs):
    return Supplier.objects.create(name=name, **kwargs)


def create_product(category=None, brand=None, quantity=50, **kwargs):
    category = category or create_category()
    brand = brand or create_brand()
    defaults = {
        'title': 'Notebook UltraSlim 14"',
        'category': category,
        'brand': brand,
        'cost_price': '2200.00',
        'selling_price': '3200.00',
        'quantity': quantity,
    }
    defaults.update(kwargs)
    return Product.objects.create(**defaults)
