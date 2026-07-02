from django.shortcuts import get_object_or_404
from apps.userprofile.models.entities import *
from .serializers import *
from rest_framework import viewsets, status, validators
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from apps.userprofile.models.entities import *
from apps.userprofile.services.userprofile import UserProfileService
from apps.userprofile.services.basicinfo import BasicInfo
from apps.userprofile.services.personalinfo import PersonalInfo
from apps.userprofile.services.additionalinfo import AdditionalInfo
from apps.userprofile.services.featuredpictures import FeaturedPictures
from apps.userprofile.services.career import Career
from apps.userprofile.services.hobbies import Hobbies
from drf_yasg.utils import swagger_auto_schema

class UsersFamilyDetailSerializerView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @swagger_auto_schema(request_body=UsersFamilyDetailSerializer)
    def create(self, request):
        user = UsersFamilyDetailSerializer(data=request.data)
        if user.is_valid(raise_exception=True):
            userinfo = UsersFamilyDetail.objects.create(
                userprofileid=user.validated_data["userprofileid"],
                family_type=user.validated_data["family_type"],
                total_family_members=user.validated_data["total_family_members"],
                siblings=user.validated_data["siblings"],
            )
            return Response(
                {
                    "message": f"Successfully created users family detail.",
                    "Profile Info": {
                        "Name": userinfo.userprofileid.userid.first_name,
                        "ProfileID": userinfo.userprofileid.profileid,
                        "PhoneNumber": userinfo.userprofileid.phonenumber,
                    },
                    "data": UsersFamilyDetailSerializer(userinfo).data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {"message": "Couldn't create user's family detail."},
            status=status.HTTP_400_BAD_REQUEST,
        )
        
    @swagger_auto_schema(request_body=UsersFamilyDetailSerializer)
    def update(self, request, pk=None):
        usersfamilydetail = get_object_or_404(UsersFamilyDetail, id=pk)
        serializer = UsersFamilyDetailSerializer(usersfamilydetail, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(
                {
                    "message": "User's family detail updated successfully",
                    "data": serializer.data,
                }
            )
        return validators.ValidationError(
            {"message": "Couldn't update user's family detail."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    @swagger_auto_schema()
    def retrieve(self, request, pk=None):
        usersfamilydata = get_object_or_404(UsersFamilyDetail, id=pk)
        serializer = UsersFamilyDetailSerializer(usersfamilydata, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            return Response(
                {
                    "message": "User's family detail retrieved!",
                    "data": serializer.data
                },
                status=status.HTTP_200_OK,
            )
        return validators.ValidationError(
            {"message": "Couldn't fetch user's family detail."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    @swagger_auto_schema()
    def destroy(self, request, pk=None):
        usersfamilydata = get_object_or_404(UsersFamilyDetail, id=pk)
        if usersfamilydata:
            usersfamilydata.delete()
            return Response(
                {"message": "User's family details deleted successfully :)"},
                status=status.HTTP_204_NO_CONTENT,
            )
        return validators.ValidationError(
            {"message": "Couldn't delete user's family detail!"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    
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
        return Hobbies()._createhobbies(request)
    
    @swagger_auto_schema(request_body=UsersFeaturedImagesSerializer)
    def update(self, request, pk=None):
        return Hobbies()._updatehobbies(request, pk)
    
    @swagger_auto_schema()
    def retrieve(self, request, pk=None):
        return Hobbies()._retrievehobbies(request, pk)
    
    @swagger_auto_schema()
    def destroy(self, request, pk=None):
        return Hobbies()._destroyhobbies(request, pk)
    
    
class UsersCareerSerializerView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @swagger_auto_schema(request_body=UsersCareerSerializer)
    def create(self, request):
        return Career()._createcareerdetail(request)
    
    @swagger_auto_schema(request_body=UsersCareerSerializer)
    def update(self, request, pk=None):
        return Career()._updatecareerdetail(request, pk)
    
    @swagger_auto_schema()
    def retrieve(self, request, pk=None):
        return Career()._retrievecareerdetail(request, pk)
    
    @swagger_auto_schema()
    def destroy(self, request, pk=None):
        return Career()._destroycareerdetail(request, pk)