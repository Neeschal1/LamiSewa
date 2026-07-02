from django.shortcuts import render
from .serializers import *
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from apps.userprofile.models.entities import *
from apps.userprofile.services.userprofile import UserProfileService
from apps.userprofile.services.basicinfo import BasicInfo
from apps.userprofile.services.personalinfo import PersonalInfo
from apps.userprofile.services.additionalinfo import AdditionalInfo
from apps.userprofile.services.featuredpictures import FeaturedPictures
from drf_yasg.utils import swagger_auto_schema


class UserProfileSerializerView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @swagger_auto_schema(request_body=UserProfileSerializer)
    def create(self, request):
        return UserProfileService()._createprofileid(request)
        
    @swagger_auto_schema(request_body=UserProfileSerializer)
    def update(self, request, pk=None):
        return UserProfileService()._updateprofileid(request, pk)
    
    @swagger_auto_schema()
    def retrieve(self, request, pk=None):
        return UserProfileService()._retrieveprofileid(request, pk)
    
    @swagger_auto_schema()
    def destroy(self, request, pk=None):
        return UserProfileService()._destroyprofileid(request, pk)
        
            
class UsersBasicInfoSerializerView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @swagger_auto_schema(request_body=UsersBasicInfoSerializer)
    def create(self, request):
        return BasicInfo()._createbasicinfo(request)
    
    @swagger_auto_schema(request_body=UsersBasicInfoSerializer)
    def update(self, request, pk=None):
        return BasicInfo()._updatebasicinfo(request, pk)
    
    @swagger_auto_schema()
    def retrieve(self, request, pk=None):
        return BasicInfo()._retrievebasicinfo(request, pk)
    
    @swagger_auto_schema()
    def destroy(self, request, pk=None):
        return BasicInfo()._destroybasicinfo(request, pk)
    
    
class UsersPersonalInfoSerializerView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @swagger_auto_schema(request_body=UsersPersonalInfoSerializer)
    def create(self, request):
        return PersonalInfo()._createpersonalinfo(request)
    
    @swagger_auto_schema(request_body=UsersPersonalInfoSerializer)
    def update(self, request, pk=None):
        return PersonalInfo()._updatepersonalinfo(request, pk)
    
    @swagger_auto_schema()
    def retrieve(self, request, pk=None):
        return PersonalInfo()._retrievepersonalinfo(request, pk)
    
    @swagger_auto_schema()
    def destroy(self, request, pk=None):
        return PersonalInfo()._deletepersonalinfo(request, pk)
    

class UsersAdditionalInfoSerializerView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @swagger_auto_schema(request_body=UsersAdditionalInfoSerializer)
    def create(self, request):
        return AdditionalInfo()._createadditionalinfo(request)
    
    @swagger_auto_schema(request_body=UsersAdditionalInfoSerializer)
    def update(self, request, pk=None):
        return AdditionalInfo()._updateadditionalinfo(request, pk)
    
    @swagger_auto_schema()
    def retrieve(self, request, pk=None):
        return AdditionalInfo()._retrieveadditionalinfo(request, pk)
    
    @swagger_auto_schema()
    def destroy(self, request, pk=None):
        return AdditionalInfo()._deleteadditionalinfo(request, pk)
    
    
class UsersFeaturedImagesSerializerView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @swagger_auto_schema(request_body=UsersFeaturedImagesSerializer)
    def create(self, request):
        return FeaturedPictures()._createfeaturedimages(request)
    
    @swagger_auto_schema(request_body=UsersFeaturedImagesSerializer)
    def update(self, request, pk=None):
        return FeaturedPictures()._updatefeaturedimages(request, pk)
    
    @swagger_auto_schema()
    def retrieve(self, request, pk=None):
        return FeaturedPictures()._retrievefeaturedimages(request, pk)
    
    @swagger_auto_schema()
    def destroy(self, request, pk=None):
        return FeaturedPictures()._destroyfeaturedimages(request, pk)
    
    
class UsersHobbiesSerializerView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @swagger_auto_schema(request_body=UsersFeaturedImagesSerializer)
    def create(self, request):
        return FeaturedPictures()._createfeaturedimages(request)
    
    @swagger_auto_schema(request_body=UsersFeaturedImagesSerializer)
    def update(self, request, pk=None):
        return FeaturedPictures()._updatefeaturedimages(request, pk)
    
    @swagger_auto_schema()
    def retrieve(self, request, pk=None):
        return FeaturedPictures()._retrievefeaturedimages(request, pk)
    
    @swagger_auto_schema()
    def destroy(self, request, pk=None):
        return FeaturedPictures()._destroyfeaturedimages(request, pk)