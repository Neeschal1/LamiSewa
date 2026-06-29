from django.shortcuts import render
from .serializers import *
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from apps.userprofile.models.entities import *
from apps.userprofile.services.userprofile import UserProfileService
from django.shortcuts import get_object_or_404


class UserProfileSerializerView(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def create(self, request):
        return UserProfileService()._createprofileid(request)
        
    def update(self, request, pk=None):
        return UserProfileService()._updateprofileid(request, pk)
    
    def retrieve(self, request, pk=None):
        return UserProfileService()._retrieveprofileid(request, pk)
            
