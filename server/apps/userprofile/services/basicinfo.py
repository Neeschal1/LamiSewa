from apps.userprofile.models.entities import UsersBasicInfo
from rest_framework.response import Response
from apps.userprofile.api.serializers import *
from rest_framework import status, validators
import random
from django.shortcuts import get_object_or_404


class BasicInfo:
    def _createbasicinfo(self, request) -> Response:
        user = UsersBasicInfoSerializer(data=request.data)

        if user.is_valid(raise_exception=True):
            userinfo = UsersBasicInfo.objects.create(
                userprofileid=user.validated_data["userprofileid"],
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
                        "PhoneNumber": userinfo.userprofileid.phonenumber,
                    },
                    "data": UsersBasicInfoSerializer(userinfo).data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {"message": "Couldn't create user's basic detail."},
            status=status.HTTP_400_BAD_REQUEST,
        )


# { "userprofileid": 9, "fullname": "Nischal Pokhrel", "nickname": "Nischal", "bio": "I am a software engineer :)", "profile_picture": "https://picsum.photos/300/300", "cover_picture": "https://picsum.photos/1200/400", "profile_handler": "Father", "gender": "MALE", "date_of_birth": "2005-01-15" }
