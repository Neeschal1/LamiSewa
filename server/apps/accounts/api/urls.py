from django.urls import include
from .views import *
from django.urls import path
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register('account-signup', UserAccountSignupSerializersView, basename="useraccounts")
router.register('account-login', UserAccountLoginSerializerView, basename="accountlogin")

urlpatterns = [
    path('', include(router.urls))
]