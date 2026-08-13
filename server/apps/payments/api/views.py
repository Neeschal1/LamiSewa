from django.shortcuts import get_object_or_404
from apps.userprofile.models.entities import *
from .serializers import *
from rest_framework import viewsets, status, validators
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from apps.userprofile.models.entities import *
from apps.payments.services.stripe import StripePayment
from apps.userprofile.services.hobbies import Hobbies
from drf_yasg.utils import swagger_auto_schema


class SubscriptionPackageSerializersrView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @swagger_auto_schema(request_body=SubscriptionPackageSerializers)
    def create(self, request):
        return StripePayment().createpayment(request)
        
    # @swagger_auto_schema(request_body=SubscriptionPackageSerializers)
    # def update(self, request, pk=None):
    #     return UserProfileService()._updateprofileid(request, pk)
    
    # @swagger_auto_schema()
    # def retrieve(self, request, pk=None):
    #     return UserProfileService()._retrieveprofileid(request, pk)
    
    # @swagger_auto_schema()
    # def destroy(self, request, pk=None):
    #     return UserProfileService()._destroyprofileid(request, pk)
    
    # @swagger_auto_schema()
    # def list(self, request):
    #     return UserProfileService()._listprofileid(request)