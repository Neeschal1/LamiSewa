from apps.userprofile.models.entities import UsersBasicInfo
from rest_framework.response import Response
from apps.userprofile.api.serializers import *
from rest_framework import status, validators
from django.shortcuts import get_object_or_404


class BasicInfo:
    def _createbasicinfo(self, request) -> Response:
        try:
            user = UsersBasicInfoSerializer(data=request.data)

            if user.is_valid(raise_exception=True):
                userinfo = UsersBasicInfo.objects.create(
                    userprofileid=request.user.profile,
                    fullname=user.validated_data["fullname"],
                    nickname=user.validated_data["nickname"],
                    profile_picture=user.validated_data["profile_picture"],
                    cover_picture=user.validated_data["cover_picture"],
                    bio=user.validated_data["bio"],
                    profile_handler=user.validated_data["profile_handler"],
                    gender=user.validated_data["gender"],
                    date_of_birth=user.validated_data["date_of_birth"],
                )
                return Response(
                    {
                        "message": f"Successfully created basic info.",
                        "Profile Info": {
                            "Name": userinfo.userprofileid.userid.first_name,
                            "ProfileID": userinfo.userprofileid.profileid,
                            "UsersEmail": userinfo.userprofileid.useremail,
                        },
                        "data": UsersBasicInfoSerializer(userinfo).data,
                    },
                    status=status.HTTP_201_CREATED,
                )

            return Response(
                {"message": "Couldn't create user's detail."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response({"Message": "Something went wrong!", "Exception": str(e)}, status=status.HTTP_417_EXPECTATION_FAILED)



    def _updatebasicinfo(self, request, pk) -> Response:
        userinfo = get_object_or_404(UsersBasicInfo, id=pk)
        serializer = UsersBasicInfoSerializer(userinfo, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(
                {
                    "message": "User's basic info updated successfully",
                    "data": serializer.data,
                }
            )
        return validators.ValidationError(
            {"message": "Couldn't update user's basic info detail."},
            status=status.HTTP_400_BAD_REQUEST,
        )


    def _retrievebasicinfo(self, request, pk) -> Response:
        basicdata = get_object_or_404(UsersBasicInfo, id=pk)
        serializer = UsersBasicInfoSerializer(basicdata, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            return Response(
                {
                    "message": "User's basic info detail retrieved!",
                    "data": serializer.data
                },
                status=status.HTTP_200_OK,
            )
        return validators.ValidationError(
            {"message": "Couldn't fetch user's detail."},
            status=status.HTTP_400_BAD_REQUEST,
        )


    def _destroybasicinfo(self, request, pk) -> Response:
        basicdata = get_object_or_404(UsersBasicInfo, id=pk)
        if basicdata:
            basicdata.delete()
            return Response(
                {"message": "User's basic info details deleted successfully :)"},
                status=status.HTTP_204_NO_CONTENT,
            )
        return validators.ValidationError(
            {"message": "Couldn't delete user's detail!"},
            status=status.HTTP_400_BAD_REQUEST,
        )
