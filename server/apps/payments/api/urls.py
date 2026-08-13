from django.urls import include
from .views import *
from django.urls import path
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register('records', UserPaymentRecordsSerializersView, basename="records")
router.register('subscription', SubscriptionPackageSerializersrView, basename="subscriptionpackage")

urlpatterns = [
    path('', include(router.urls))
]