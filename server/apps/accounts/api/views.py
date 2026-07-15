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
            phonenumber = serializers.validated_data['contactnumber']
            email = serializers.validated_data['email']
            return UserAuth()._verifycredentials(name, phonenumber, email)
        
        
class VerifyOTPSerializerView(viewsets.ViewSet):
    permission_classes = [AllowAny]
    
    @swagger_auto_schema(request_body=VerifyOTPSerializer)
    def create(self, request):
        serializers = VerifyOTPSerializer(data=request.data)
        if serializers.is_valid(raise_exception=True):
            mail = serializers.validated_data['email']
            otpcode = serializers.validated_data['otp']
            return UserAuth()._verifyotpcode(mail, otpcode)
        

class FindAccountSerializerView(viewsets.ViewSet):
    permission_classes = [AllowAny]
    
    @swagger_auto_schema(request_body=FindAccountSerializer)
    def create(self, request):
        serializers = FindAccountSerializer(data=request.data)
        if serializers.is_valid(raise_exception=True):
            phonenumber = serializers.validated_data['contactNumber']
            return UserAuth()._findaccount(phonenumber)
        

class CodeVerificationForForgotPasswordSerializersView(viewsets.ViewSet):
    permission_classes = [AllowAny]
    
    @swagger_auto_schema(request_body=CodeVerificationForForgotPasswordSerializers)
    def create(self, request):
        serializers = CodeVerificationForForgotPasswordSerializers(data=request.data)
        if serializers.is_valid(raise_exception=True):
            usersphonenumber = serializers.validated_data['contactNumber']
            userscode = serializers.validated_data['code']
            return UserAuth()._codeverification(usersphonenumber, userscode)
        

class ResetPasswordSerializersView(viewsets.ViewSet):
    permission_classes = [AllowAny]
    
    @swagger_auto_schema(request_body=ResetPasswordSerializers)
    def create(self, request):
        serializers = ResetPasswordSerializers(data=request.data)
        if serializers.is_valid(raise_exception=True):
            usersphonenumber = serializers.validated_data['contactNumber']
            passcode = serializers.validated_data['password']
            return UserAuth()._resetpassword(usersphonenumber, passcode)
        

class EmailFingerprintVerificationSerializersView(viewsets.ViewSet):
    permission_classes = [AllowAny]
    
    @swagger_auto_schema(request_body=EmailFingerprintVerificationSerializers)
    def create(self, request):
        serializers = EmailFingerprintVerificationSerializers(data=request.data)
        if serializers.is_valid(raise_exception=True):
            usermail = serializers.validated_data["email"]
            return UserAuth()._validatefingerprint(usermail)
    