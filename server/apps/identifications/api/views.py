from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import *
from apps.identifications.services.document import Documents
from drf_yasg.utils import swagger_auto_schema
import random


class UserIDRecordsSerializersView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @swagger_auto_schema(request_body=UserIDRecordsSerializers)
    def create(self, request):
        userid_record_serializer = UserIDRecordsSerializers(data=request.data)
        if userid_record_serializer.is_valid(raise_exception=True):
            recordid = userid_record_serializer.validated_data["record_id"]
            return Documents()._useridrecords(recordid)


class IDVerificationSerializersView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @swagger_auto_schema(request_body=IDVerificationSerializers)
    def create(self, request):
        document_verification_serializer = IDVerificationSerializers(data=request.data)
        if document_verification_serializer.is_valid(raise_exception=True):
            fullname = document_verification_serializer.validated_data['fullname']
            dateofbirth = document_verification_serializer.validated_data['date_of_birth']
            permanentaddress = document_verification_serializer.validated_data['permanent_address']
            documenttype = document_verification_serializer.validated_data['document_type']
            frontside = document_verification_serializer.validated_data['front_side']
            backside = document_verification_serializer.validated_data['back_side']
            livepicture = document_verification_serializer.validated_data['live_photo']
            status = document_verification_serializer.validated_data['status']
            return Documents()._createnewdocument(fullname, dateofbirth, permanentaddress, documenttype, frontside, backside, livepicture, status)