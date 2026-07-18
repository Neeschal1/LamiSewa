from django.urls import include
from .views import *
from django.urls import path
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register('record-id', UserIDRecordsSerializersView, basename="idrecords")
router.register('record-id/id-verification', IDVerificationSerializersView, basename="id-verification")

urlpatterns = [
    path('', include(router.urls))
]