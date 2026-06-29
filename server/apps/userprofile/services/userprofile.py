from apps.userprofile.models.entities import UserProfile
from rest_framework.response import Response
from apps.userprofile.api.serializers import *
from rest_framework import status
import random
from django.shortcuts import get_object_or_404


class UserProfileService:
    def _generate_profile_id(self):
        return f"BB00{random.randint(0, 999999)}"

    def _createprofileid(self, request) -> Response:
        profiledata = UserProfileSerializer(data=request.data)
        if profiledata.is_valid(raise_exception=True):
            id = profiledata.validated_data["userid"]
            phonenumber = profiledata.validated_data["phonenumber"]

        while True:
            profile_id = self._generate_profile_id()
            if not UserProfile.objects.filter(profileid=profile_id).exists():
                break

        profile = UserProfile.objects.create(
            userid=id,
            phonenumber=phonenumber,
            profileid=profile_id,
        )

        return Response(
            {
                "message": f"Successfully created {profile.userid.first_name}'s Profile.",
                "data": {
                    "Userid": profile.userid.pk,
                    "Phonenumber": profile.phonenumber,
                    "Profileid": profile.profileid,
                },
            },
            status=status.HTTP_201_CREATED,
        )

    def _updateprofileid(self, request, pk) -> Response:
        profiledata = get_object_or_404(UserProfile, id=pk)
        serializer = UserProfileSerializer(profiledata, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(
                {
                    "message": f"Successfully updated {profiledata.userid.first_name}'s Profile."
                },
                status=status.HTTP_200_OK,
            )
        return Response(
            {"message": "Couldn't update user's detail."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def _retrieveprofileid(self, request, pk) -> Response:
        profiledata = get_object_or_404(UserProfile, id=pk)
        serializer = UserProfileSerializer(profiledata, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            return Response(
                {
                    "message": "User's data retrieved!",
                    "data": {
                        "User ProfileID": profiledata.profileid,
                        "Phone Number": serializer.data['phonenumber'],
                    },
                },
                status=status.HTTP_200_OK,
            )
        return Response(
            {"message": "Couldn't fetch user's detail."},
            status=status.HTTP_400_BAD_REQUEST,
        )
