from pathlib import Path
from .base import *
from env_config import Config


# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent


# Debug: False when it comes to production
DEBUG = True
SECRET_KEY = Config.SECRET_KEY


# Allowed hosts to access this backend system
ALLOWED_HOSTS = [Config.DOMAIN_NAME_1, Config.DOMAIN_NAME_2, Config.DOMAIN_NAME_3]


# Root URL to hit, i. e. url of project of an entire application
ROOT_URLCONF = "config.urls"


# Asynchronous server gateway interface initialization
ASGI_APPLICATION = "config.asgi.application"


# Database for development phase only
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    },
}