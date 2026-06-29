from django.urls import include
from .views import *
from django.urls import path
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register('userprofile', UserProfileSerializerView, basename="userprofile")
router.register('user-profile/basic-info', UsersBasicInfoSerializerView, basename="basicinfo")

urlpatterns = [
    path('', include(router.urls))
]