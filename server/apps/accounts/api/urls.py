from django.urls import include
from .views import *
from django.urls import path
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register('account-signup', UserAccountSignupSerializersView, basename="useraccounts")
router.register('account-login', UserAccountLoginSerializerView, basename="accountlogin")
router.register('account-credentials-verification', UserAccountCredentialsSetupSerializerView, basename="accountcredentials")
router.register('account-credentials-otp-verification', VerifyOTPSerializerView, basename="otpverification")
router.register('account-forgot-password-find-account', FindAccountSerializerView, basename="findaccount")

urlpatterns = [
    path('', include(router.urls))
]