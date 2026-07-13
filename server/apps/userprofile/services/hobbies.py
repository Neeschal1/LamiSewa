from apps.userprofile.models.entities import UsersHobbies
from rest_framework.response import Response
from apps.userprofile.api.serializers import *
from rest_framework import status, validators
from django.shortcuts import get_object_or_404

class Hobbies:
    def _createhobbies(self, request) -> Response:
        user = UsersHobbiesSerializer(data=request.data)
        if user.is_valid(raise_exception=True):
            userinfo = UsersHobbies.objects.create(
                userprofileid=request.user.profile,
                hobby1=user.validated_data["hobby1"],
                hobby2=user.validated_data["hobby2"],
                hobby3=user.validated_data["hobby3"],
                hobby4=user.validated_data["hobby4"],
                hobby5=user.validated_data["hobby5"],
            )
            return Response(
                {
                    "message": f"Successfully added user's hobbies list.",
                    "Profile Info": {
                        "Name": userinfo.userprofileid.userid.first_name,
                        "ProfileID": userinfo.userprofileid.profileid,
                        "UsersEmail": userinfo.userprofileid.useremail,
                    },
                    "data": UsersHobbiesSerializer(userinfo).data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {"message": "Couldn't create user's hobbies list."},
            status=status.HTTP_400_BAD_REQUEST,
        )
        
    
    def _updatehobbies(self, request, pk) -> Response:
        usershobbies = get_object_or_404(UsersHobbies, id=pk)
        serializer = UsersHobbiesSerializer(usershobbies, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(
                {
                    "message": "User's hobbies list updated successfully",
                    "data": serializer.data,
                }
            )
        return validators.ValidationError(
            {"message": "Couldn't update user's hobbies list."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    
    def _retrievehobbies(self, request, pk) -> Response:
        usershobbies = get_object_or_404(UsersHobbies, id=pk)
        serializer = UsersHobbiesSerializer(usershobbies, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            return Response(
                {
                    "message": "User's hobbies list detail retrieved!",
                    "data": serializer.data
                },
                status=status.HTTP_200_OK,
            )
        return validators.ValidationError(
            {"message": "Couldn't fetch user's hobbies list."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    
    def _destroyhobbies(self, request, pk) -> Response:
        usershobbies = get_object_or_404(UsersHobbies, id=pk)
        if usershobbies:
            usershobbies.delete()
            return Response(
                {"message": "User's hobbies list details deleted successfully :)"},
                status=status.HTTP_204_NO_CONTENT,
            )
        return validators.ValidationError(
            {"message": "Couldn't delete user's hobbies list!"},
            status=status.HTTP_400_BAD_REQUEST,
        )