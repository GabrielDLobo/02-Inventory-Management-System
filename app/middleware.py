from django.conf import settings
from django.http import HttpResponseForbidden

# Em DEMO_MODE, bloqueia TODO o acesso ao Django Admin (não só as rotas de
# usuário/grupo/senha). O usuário "demo" nunca alcança /admin/ (não é
# staff/superuser); isto é uma camada extra de proteção caso outra conta
# com acesso ao /admin/ seja usada no ambiente público de demonstração.
_BLOCKED_PATH_PREFIX = '/admin/'


class DemoModeMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if settings.DEMO_MODE and request.path.startswith(_BLOCKED_PATH_PREFIX):
            return HttpResponseForbidden(
                'Acesso ao admin desabilitado no ambiente de demonstração.'
            )
        return self.get_response(request)
