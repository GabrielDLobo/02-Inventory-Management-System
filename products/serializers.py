from rest_framework import serializers
from products.models import Product


class ProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = Product
        fields = '__all__'

    def validate_quantity(self, value):
        # Product.quantity é IntegerField (não PositiveIntegerField) e sem
        # validators: sem isso a API aceita estoque negativo direto no
        # cadastro do produto, sem precisar nem de uma saída.
        if value < 0:
            raise serializers.ValidationError('A quantidade não pode ser negativa.')
        return value

    def validate_cost_price(self, value):
        if value <= 0:
            raise serializers.ValidationError('O preço de custo deve ser maior que zero.')
        return value

    def validate_selling_price(self, value):
        if value <= 0:
            raise serializers.ValidationError('O preço de venda deve ser maior que zero.')
        return value
