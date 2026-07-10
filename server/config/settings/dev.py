from pathlib import Path
from .base import *
from env_config import Config
import os


# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent


# Debug: False when it comes to production
DEBUG = True
SECRET_KEY = Config.SECRET_KEY


# Allowed hosts to access this backend system
ALLOWED_HOSTS = [os.getenv('DOMAIN_NAME_1'), Config.DOMAIN_NAME_2, Config.DOMAIN_NAME_3, "192.168.1.78", "192.168.1.76" ]


# Root URL to hit, i. e. url of project of an entire application
ROOT_URLCONF = "config.urls"


# Asynchronous server gateway interface initialization
ASGI_APPLICATION = "config.asgi.application"


# Redis Server Setup
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",
        "OPTIONS": {"CLIENT_CLASS": "django_redis.client.DefaultClient"},
    }
}


# Database for development phase only
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    },
}