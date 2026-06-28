from django.shortcuts import render
from .serializers import *
from rest_framework import viewsets, response, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from apps.userprofile.models.entities import *
from apps.userprofile.services.userprofile import UserProfileService
import random


class UserProfileSerializerView(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def create(self, request):
        profiledata = UserProfileSerializer(data=request.data)
        if profiledata.is_valid(raise_exception=True):
            id = profiledata.validated_data['userid']
            number = profiledata.validated_data['phonenumber']
            return UserProfileService()._profileid(id, number)
            
