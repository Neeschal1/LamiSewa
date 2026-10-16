from pathlib import Path
from .base import *
from env_config import Config
import os


BASE_DIR = Path(__file__).resolve().parent.parent.parent


DEBUG = True
SECRET_KEY = Config.SECRET_KEY


_hosts = [
    os.getenv('DOMAIN_NAME_1'),
    Config.DOMAIN_NAME_2,
    Config.DOMAIN_NAME_3,
    "127.0.0.1",
    "localhost",
    "192.168.1.78",
    "192.168.1.76",
    "192.168.100.18",
    ".ngrok.io",
    ".ngrok-free.app",
    ".trycloudflare.com",
]
ALLOWED_HOSTS = [h for h in _hosts if h]

CORS_ALLOW_ALL_ORIGINS = True


ROOT_URLCONF = "config.urls"


ASGI_APPLICATION = "config.asgi.application"


CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "lamisewa-dev",
    }
}
try:
    import django_redis
    CACHES = {
        "default": {
            "BACKEND": "django_redis.cache.RedisCache",
            "LOCATION": "redis://127.0.0.1:6379/1",
            "OPTIONS": {"CLIENT_CLASS": "django_redis.client.DefaultClient"},
        }
    }
except ImportError:
    pass


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    },
}
