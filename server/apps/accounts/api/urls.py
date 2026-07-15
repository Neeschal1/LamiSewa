from django.urls import include
from .views import *
from django.urls import path
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register('account-signup', UserAccountSignupSerializersView, basename="user-accounts")
router.register('account-login', UserAccountLoginSerializerView, basename="account-login")
router.register('account-credentials-verification', UserAccountCredentialsSetupSerializerView, basename="account-credentials")
router.register('account-credentials-otp-verification', VerifyOTPSerializerView, basename="otp-verification")
router.register('account-forgot-password-find-account', FindAccountSerializerView, basename="find-account")
router.register('account-forgot-password-verify-account', CodeVerificationForForgotPasswordSerializersView, basename="verifyaccount")
router.register('account-reset-account-password', ResetPasswordSerializersView, basename="reset-password")
router.register('account-fingerprint-login', EmailFingerprintVerificationSerializersView, basename="fingerprint-verification")

urlpatterns = [
    path('', include(router.urls))
]