import logging

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from ai.agent import SGEAgent
from ai.models import AIResult
from ai.serializers import AIResultSerializer

logger = logging.getLogger(__name__)


class AILatestResultAPIView(APIView):
    """Última análise gerada (ver ai/agent.py). Sem endpoint até a Fase 3:
    o app só era acionado pelo management command sge_agent_invoke."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        instance = AIResult.objects.first()
        if instance is None:
            return Response(None)
        return Response(AIResultSerializer(instance).data)


class AIInvokeAPIView(APIView):
    """Dispara uma nova análise (chama a OpenAI). Não usa DjangoModelPermissions
    porque não é um create-a-partir-do-payload do usuário; qualquer usuário
    autenticado pode acionar, mesmo o demo, já que é a própria funcionalidade
    da tela."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            SGEAgent().invoke()
        except Exception:
            logger.exception('Falha ao invocar o SGEAgent (integração OpenAI).')
            return Response(
                {'detail': 'Não foi possível gerar a análise agora. Tente novamente em instantes.'},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        instance = AIResult.objects.first()
        return Response(AIResultSerializer(instance).data, status=status.HTTP_201_CREATED)
