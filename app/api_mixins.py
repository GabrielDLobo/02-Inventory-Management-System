from django.db.models import ProtectedError
from rest_framework import status
from rest_framework.response import Response


class ProtectedDestroyMixin:
    """Converte ProtectedError (FK com on_delete=PROTECT) num 409 tratado.

    Sem isso, excluir um registro referenciado por PROTECT (ex.: categoria
    de um produto, produto com entrada/saída) derrubava a exceção crua até
    virar 500 — achado no QA da Fase 3 (docs/QA_CHECKLIST.md).
    """

    protected_delete_message = 'Não é possível excluir: há registros vinculados a este item.'

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            return Response({'detail': self.protected_delete_message}, status=status.HTTP_409_CONFLICT)
