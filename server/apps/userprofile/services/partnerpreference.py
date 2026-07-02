from apps.userprofile.models.entities import UsersPartnerPreference
from rest_framework.response import Response
from apps.userprofile.api.serializers import *
from rest_framework import status, validators
from django.shortcuts import get_object_or_404


class PartnerPreference:
    def _createpartnerpreferencedetail(self, request) -> Response:
        partner_preference = UsersPartnerPreferenceSerializer(data=request.data)
        partner_preference_validation = partner_preference.is_valid(raise_exception=True)
        
        preferred_partner_age = partner_preference.validated_data["age_ranging"]
        preferred_partner_maritalstatus = partner_preference.validated_data["maritalstatus"]
        preferred_partner_address = partner_preference.validated_data["living_in"]
        preferred_partner_religion = partner_preference.validated_data["partner_religion"]
        preferred_partner_diet = partner_preference.validated_data["partner_diet"]
        preferred_partner_education = partner_preference.validated_data["partner_education"]
        preferred_partner_profession = partner_preference.validated_data["partner_profession"]
        preferred_partner_mangalik = partner_preference.validated_data["partner_mangalik"]
        preferred_partner_diet = partner_preference.validated_data["partner_diet"]
        
        partner_preference_summary = f"""
        Preferred Partner's Age: {preferred_partner_age}
        Preferred Partner's Marital Status: {preferred_partner_maritalstatus}
        Preferred Partner's Address: {preferred_partner_address}
        Preferred Partner's Religion: {preferred_partner_religion}
        Preferred Partner's Diet: {preferred_partner_diet}
        Preferred Partner's Education: {preferred_partner_education}
        Preferred Partner's Profession: {preferred_partner_profession}
        Preferred Partner's Mangalik: {preferred_partner_mangalik}
        """

        if partner_preference_validation:
            userinfo = UsersPartnerPreference.objects.create(
                userprofileid=partner_preference.validated_data["userprofileid"],
                age_ranging=preferred_partner_age,
                maritalstatus=preferred_partner_maritalstatus,
                living_in=preferred_partner_address,
                partner_religion=preferred_partner_religion,
                partner_diet=preferred_partner_diet,
                partner_education=preferred_partner_education,
                partner_profession=preferred_partner_profession,
                partner_mangalik=preferred_partner_mangalik,
                preference_summary=partner_preference_summary,
            )
            return Response(
                {
                    "message": f"Successfully created partner preference info.",
                    "Profile Info": {
                        "Name": userinfo.userprofileid.userid.first_name,
                        "ProfileID": userinfo.userprofileid.profileid,
                        "PhoneNumber": userinfo.userprofileid.phonenumber,
                    },
                    "data": UsersPartnerPreferenceSerializer(userinfo).data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {"message": "Couldn't create user's partner preference detail."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    
    def _updatepartnerpreferencedetail(self, request, pk) -> Response:
        userpreferredpartnerdetail = get_object_or_404(UsersPartnerPreference, id=pk)
        serializer = UsersPartnerPreferenceSerializer(userpreferredpartnerdetail, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(
                {
                    "message": "User's partner preference detail updated successfully",
                    "data": serializer.data,
                }
            )
        return validators.ValidationError(
            {"message": "Couldn't update user's partner preference detail."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    
    def _retrievepartnerpreferencedetail(self, request, pk) -> Response:
        userpreferredpartnerdetail = get_object_or_404(UsersPartnerPreference, id=pk)
        serializer = UsersPartnerPreferenceSerializer(userpreferredpartnerdetail, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            return Response(
                {
                    "message": "User's partner preference detail retrieved!",
                    "data": serializer.data
                },
                status=status.HTTP_200_OK,
            )
        return validators.ValidationError(
            {"message": "Couldn't fetch user's partner preference detail."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    
    def _destroypartnerpreferencedetail(self, request, pk) -> Response:
        userpreferredpartnerdetail = get_object_or_404(UsersPartnerPreference, id=pk)
        if userpreferredpartnerdetail:
            userpreferredpartnerdetail.delete()
            return Response(
                {"message": "User's partner preference details deleted successfully :)"},
                status=status.HTTP_204_NO_CONTENT,
            )
        return validators.ValidationError(
            {"message": "Couldn't delete user's partner preference!"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    