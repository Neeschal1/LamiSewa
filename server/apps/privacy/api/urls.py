from django.urls import include
from .views import *
from django.urls import path
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register('userprivacy', UserPrivacySerializersView, basename="privacy")

urlpatterns = [
    path('', include(router.urls))
]