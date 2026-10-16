from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from django.urls import path
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')

django_asgi = get_asgi_application()

from apps.conversations.consumers import ChatConsumer

application = ProtocolTypeRouter(
    {
        "http": django_asgi,
        "websocket": AuthMiddlewareStack(
            URLRouter([path("ws/chat/<int:thread_id>/", ChatConsumer.as_asgi())])
        ),
    }
)
