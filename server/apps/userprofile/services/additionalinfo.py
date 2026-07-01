from apps.userprofile.models.entities import UsersAdditionalInfo
from rest_framework.response import Response
from apps.userprofile.api.serializers import *
from rest_framework import status, validators
from django.shortcuts import get_object_or_404


class AdditionalInfo:
    def _createadditionalinfo(self, request) -> Response:
        user = UsersAdditionalInfoSerializer(data=request.data)
        if user.is_valid(raise_exception=True):
            userinfo = UsersAdditionalInfo.objects.create(
                userprofileid=user.validated_data["userprofileid"],
                height=user.validated_data["height"],
                weight=user.validated_data["weight"],
                religion=user.validated_data["religion"],
                diet=user.validated_data["diet"],
            )
            return Response(
                {
                    "message": f"Successfully created additinoal info.",
                    "Profile Info": {
                        "Name": userinfo.userprofileid.userid.first_name,
                        "ProfileID": userinfo.userprofileid.profileid,
                        "PhoneNumber": userinfo.userprofileid.phonenumber,
                    },
                    "data": UsersAdditionalInfoSerializer(userinfo).data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {"message": "Couldn't create user's additional detail."},
            status=status.HTTP_400_BAD_REQUEST,
        )


    def _updateadditionalinfo(self, request, pk) -> Response:
        userinfo = get_object_or_404(UsersAdditionalInfo, id=pk)
        serializer = UsersAdditionalInfoSerializer(userinfo, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(
                {
                    "message": "User's additional info updated successfully",
                    "data": serializer.data,
                }
            )
        return validators.ValidationError(
            {"message": "Couldn't update user's basic info detail."},
            status=status.HTTP_400_BAD_REQUEST,
        )


    def _retrieveadditionalinfo(self, request, pk) -> Response:
        additionaldata = get_object_or_404(UsersAdditionalInfo, id=pk)
        serializer = UsersAdditionalInfoSerializer(additionaldata, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            return Response(
                {
                    "message": "User's additional info detail retrieved!",
                    "data": serializer.data
                },
                status=status.HTTP_200_OK,
            )
        return validators.ValidationError(
            {"message": "Couldn't fetch user's detail."},
            status=status.HTTP_400_BAD_REQUEST,
        )


    def _deleteadditionalinfo(self, request, pk) -> Response:
        additionaldata = get_object_or_404(UsersAdditionalInfo, id=pk)
        if additionaldata:
            additionaldata.delete()
            return Response(
                {"message": "User's personal info details deleted successfully :)"},
                status=status.HTTP_204_NO_CONTENT,
            )
        return validators.ValidationError(
            {"message": "Couldn't delete user's detail!"},
            status=status.HTTP_400_BAD_REQUEST,
        )