from django.conf import settings
from django.http import HttpResponseForbidden

# Em DEMO_MODE, bloqueia troca de senha, criação/edição de usuários e
# configurações administrativas via Django Admin. O usuário "demo" nunca
# alcança essas rotas (não é staff/superuser); isto é uma camada extra
# de proteção caso outra conta com acesso ao /admin/ seja usada no ambiente.
_BLOCKED_PATH_PREFIXES = (
    '/admin/auth/user/',
    '/admin/auth/group/',
    '/admin/password_change/',
)
_BLOCKED_METHODS = ('POST', 'PUT', 'PATCH', 'DELETE')


class DemoModeMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if (
            settings.DEMO_MODE
            and request.method in _BLOCKED_METHODS
            and request.path.startswith(_BLOCKED_PATH_PREFIXES)
        ):
            return HttpResponseForbidden(
                'Ação desabilitada no ambiente de demonstração.'
            )
        return self.get_response(request)
