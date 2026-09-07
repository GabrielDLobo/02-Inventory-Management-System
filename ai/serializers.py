from rest_framework import serializers
from ai.models import AIResult


class AIResultSerializer(serializers.ModelSerializer):

    class Meta:
        model = AIResult
        fields = '__all__'
