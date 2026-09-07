from rest_framework import serializers
from inflows.models import Inflow


class InflowSerializer(serializers.ModelSerializer):

    class Meta:
        model = Inflow
        fields = '__all__'

    def validate_quantity(self, value):
        # inflows/signals.py só soma ao estoque quando quantity > 0; sem essa
        # validação, uma entrada com quantidade zero ou negativa era aceita
        # como registro "fantasma" (criada, mas sem efeito no estoque).
        if value <= 0:
            raise serializers.ValidationError('A quantidade deve ser maior que zero.')
        return value
