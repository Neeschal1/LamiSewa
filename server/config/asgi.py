from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from django.urls import path
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')

django_asgi = get_asgi_application()

from apps.conversations.consumers import ChatConsumer, InboxConsumer
from apps.conversations.middleware import JWTAuthMiddleware

application = ProtocolTypeRouter(
    {
        "http": django_asgi,
        "websocket": JWTAuthMiddleware(
            URLRouter(
                [
                    path("ws/chat/<int:thread_id>/", ChatConsumer.as_asgi()),
                    path("ws/inbox/", InboxConsumer.as_asgi()),
                ]
            )
        ),
    }
)
