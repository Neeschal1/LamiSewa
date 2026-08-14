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


class UserPaymentRecordsSerializersView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @swagger_auto_schema(request_body=UserPaymentRecordsSerializers)
    def create(self, request):
        try:
            userid = request.user
            UserPaymentRecords.objects.get_or_create(payment_id=request.user)
            return Response({"message": "users payment record created."}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"Message":"Exception Occured!", "Issue":str(e)})


class SubscriptionPackageSerializersrView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @swagger_auto_schema(request_body=SubscriptionPackageSerializers)
    def create(self, request):
        return StripePayment().createpayment(request)
        
    @swagger_auto_schema(request_body=SubscriptionPackageSerializers)
    def update(self, request, pk=None):
        return StripePayment().updatepayment(request)
    
    @swagger_auto_schema()
    def retrieve(self, request, pk=None):
        return StripePayment().retrievepayment(request)
    
    @swagger_auto_schema()
    def destroy(self, request, pk=None):
        return StripePayment().destroypayment(request)