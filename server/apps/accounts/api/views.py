from django.shortcuts import render
from .serializers import *
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from ..services.auth import UserAuth
from drf_yasg.utils import swagger_auto_schema


class UserAccountSignupSerializersView(viewsets.ViewSet):
    permission_classes = [AllowAny]
    
    @swagger_auto_schema(request_body=UserAccountSignupSerializers)
    def create(self, request):
        number_of_users = User.objects.all().count()
        signup_serializers = UserAccountSignupSerializers(data=request.data)
        if signup_serializers.is_valid(raise_exception=True):
            FirstName = signup_serializers.validated_data["first_name"]
            Email = signup_serializers.validated_data["email"]
            Username = signup_serializers.validated_data["username"]
            Password = signup_serializers.validated_data["password"]
            return UserAuth()._signup(FirstName, Email, Username, Password, number_of_users)

   
class UserAccountLoginSerializerView(viewsets.ViewSet):
    permission_classes = [AllowAny]
    
    @swagger_auto_schema(request_body=UserAccountLoginSerializers)
    def create(self, request):
        serializers = UserAccountLoginSerializers(data=request.data)
        if serializers.is_valid(raise_exception=True):
            email = serializers.validated_data['email']
            password = serializers.validated_data['password']
            return UserAuth()._login(email, password)
        

class UserAccountCredentialsSetupSerializerView(viewsets.ViewSet):
    permission_classes = [AllowAny]
    
    @swagger_auto_schema(request_body=UserAccountCredentialsSetupSerializer)
    def create(self, request):
        serializers = UserAccountCredentialsSetupSerializer(data=request.data)
        if serializers.is_valid(raise_exception=True):
            name = serializers.validated_data['fullname']
            phonenumber = serializers.validated_data['username']
            return UserAuth()._verifycredentials(name, phonenumber)