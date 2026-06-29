from django.shortcuts import render
from .serializers import *
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from apps.userprofile.models.entities import *
from apps.userprofile.services.userprofile import UserProfileService
from apps.userprofile.services.basicinfo import BasicInfo


class UserProfileSerializerView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def create(self, request):
        return UserProfileService()._createprofileid(request)
        
    def update(self, request, pk=None):
        return UserProfileService()._updateprofileid(request, pk)
    
    def retrieve(self, request, pk=None):
        return UserProfileService()._retrieveprofileid(request, pk)
    
    def delete(self, request, pk=None):
        return UserProfileService()._destroyprofileid(request, pk)
        
            
class UsersBasicInfoSerializerView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    def create(self, request):
        return BasicInfo()._createbasicinfo(request)