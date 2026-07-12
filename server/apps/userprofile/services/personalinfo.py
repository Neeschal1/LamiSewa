from apps.userprofile.models.entities import UsersPersonalInfo
from rest_framework.response import Response
from apps.userprofile.api.serializers import *
from rest_framework import status, validators
from django.shortcuts import get_object_or_404


class PersonalInfo:
    def _createpersonalinfo(self, request) -> Response:
        user = UsersPersonalInfoSerializer(data=request.data)
        if user.is_valid(raise_exception=True):
            userinfo = UsersPersonalInfo.objects.create(
                userprofileid=user.validated_data["userprofileid"],
                maritalstatus=user.validated_data["maritalstatus"],
                gotra=user.validated_data["gotra"],
                current_living_country=user.validated_data["current_living_country"],
                current_city=user.validated_data["current_city"],
                residency_status=user.validated_data["residency_status"],
            )
            return Response(
                {
                    "message": f"Successfully created personal info.",
                    "Profile Info": {
                        "Name": userinfo.userprofileid.userid.first_name,
                        "ProfileID": userinfo.userprofileid.profileid,
                        "UsersEmail": userinfo.userprofileid.useremail,
                    },
                    "data": UsersPersonalInfoSerializer(userinfo).data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {"message": "Couldn't create user's personal detail."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    
    def _updatepersonalinfo(self, request, pk) -> Response:
        userinfo = get_object_or_404(UsersPersonalInfo, id=pk)
        serializer = UsersPersonalInfoSerializer(userinfo, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(
                {
                    "message": "User's personal info updated successfully",
                    "data": serializer.data,
                }
            )
        return validators.ValidationError(
            {"message": "Couldn't update user's basic info detail."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    
    def _retrievepersonalinfo(self, request, pk) -> Response:
        personaldata = get_object_or_404(UsersPersonalInfo, id=pk)
        serializer = UsersPersonalInfoSerializer(personaldata, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            return Response(
                {
                    "message": "User's personal info detail retrieved!",
                    "data": serializer.data
                },
                status=status.HTTP_200_OK,
            )
        return validators.ValidationError(
            {"message": "Couldn't fetch user's detail."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    
    def _deletepersonalinfo(self, request, pk) -> Response:
        personaldata = get_object_or_404(UsersPersonalInfo, id=pk)
        if personaldata:
            personaldata.delete()
            return Response(
                {"message": "User's personal info details deleted successfully :)"},
                status=status.HTTP_204_NO_CONTENT,
            )
        return validators.ValidationError(
            {"message": "Couldn't delete user's detail!"},
            status=status.HTTP_400_BAD_REQUEST,
        )
