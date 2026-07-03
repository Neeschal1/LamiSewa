from apps.userprofile.models.entities import UserProfile
from rest_framework.response import Response
from apps.userprofile.api.serializers import *
from rest_framework import status, validators
from env_config import Config
import random
import requests
from django.shortcuts import get_object_or_404


class UserProfileService:
    def _generate_profile_id(self):
        randomnumber = str(random.randint(100000, 999999))
        return f"BB00{randomnumber}"
    
    
    def _send_sms(self, phone_number, name):
        otpcode = random.randint(100000, 999999)
        
        payload = {
            "token": Config.SPARROW_SMS_TOKEN,
            "from": f"{Config.SPARROW_SMS_FROM}",
            "to": phone_number,
            "text": f"""Hey {name}, your LamiSewa verification code is {otpcode}. This code is valid for 2 minutes. Please do not share it with anyone. 
            
              Thank You :)
            Team Lamisewa"""
        }
        try:
            response = requests.post(Config.SPARROW_SMS_URL, data=payload)
            response.raise_for_status()
            return {
                "success": True,
                "response": response.json()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }


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
        
        self._send_sms(phonenumber, profile.userid.first_name)

        return Response(
            {
                "message": f"Successfully created {profile.userid.first_name}'s Profile.",
                "data": {
                    "user_account_id": profile.userid.pk,
                    "user_profile_id": profile.pk,
                    "phonenumber": profile.phonenumber,
                    "profileid": profile.profileid,
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
        return validators.ValidationError(
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
                        "Phone Number": serializer.data["phonenumber"],
                    },
                },
                status=status.HTTP_200_OK,
            )
        return validators.ValidationError(
            {"message": "Couldn't fetch user's detail."},
            status=status.HTTP_400_BAD_REQUEST,
        )


    def _destroyprofileid(self, request, pk) -> Response:
        profiledata = get_object_or_404(UserProfile, id=pk)
        if profiledata:
            profiledata.delete()
            return Response(
                {"message": "User's profile deleted successfully :)"},
                status=status.HTTP_204_NO_CONTENT,
            )
        return validators.ValidationError(
            {"message": "Couldn't delete user's detail!"},
            status=status.HTTP_400_BAD_REQUEST,
        )
