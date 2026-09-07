from rest_framework import serializers
from outflows.models import Outflow


class OutflowSerializer(serializers.ModelSerializer):

    class Meta:
        model = Outflow
        fields = '__all__'

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError('A quantidade deve ser maior que zero.')
        return value

    def validate(self, attrs):
        # Sem isso, o signal em outflows/signals.py desconta o estoque sem
        # piso nenhum: uma saída maior que o disponível deixava o produto
        # com quantidade negativa (achado no QA da Fase 3).
        product = attrs.get('product')
        quantity = attrs.get('quantity')
        if product is not None and quantity is not None and quantity > product.quantity:
            raise serializers.ValidationError({
                'quantity': f'Estoque insuficiente: há apenas {product.quantity} unidade(s) de "{product.title}" disponível(is).',
            })
        return attrs
