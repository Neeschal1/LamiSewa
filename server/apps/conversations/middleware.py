from urllib.parse import parse_qsl

from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser, User


@database_sync_to_async
def _user_from_token(token: str):
    try:
        from rest_framework_simplejwt.tokens import AccessToken

        access = AccessToken(str(token))
        return User.objects.get(id=access["user_id"])
    except Exception:
        return AnonymousUser()


class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        try:
            query = dict(parse_qsl(scope.get("query_string", b"").decode()))
        except Exception:
            query = {}
        token = query.get("token")
        if token:
            scope["user"] = await _user_from_token(token)
        else:
            scope["user"] = AnonymousUser()
        return await self.inner(scope, receive, send)
