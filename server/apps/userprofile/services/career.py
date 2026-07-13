from apps.userprofile.models.entities import UsersCareer
from rest_framework.response import Response
from apps.userprofile.api.serializers import *
from rest_framework import status, validators
from django.shortcuts import get_object_or_404

class Career:
    def _createcareerdetail(self, request) -> Response:
        user = UsersCareerSerializer(data=request.data)
        if user.is_valid(raise_exception=True):
            userinfo = UsersCareer.objects.create(
                userprofileid=request.user.profile,
                highest_qualification=user.validated_data["highest_qualification"],
                college_name=user.validated_data["college_name"],
                working_as=user.validated_data["working_as"],
                occupation=user.validated_data["occupation"],
                company_or_organization_name=user.validated_data["company_or_organization_name"],
            )
            return Response(
                {
                    "message": f"Successfully created career info.",
                    "Profile Info": {
                        "Name": userinfo.userprofileid.userid.first_name,
                        "ProfileID": userinfo.userprofileid.profileid,
                        "UsersEmail": userinfo.userprofileid.useremail,
                    },
                    "data": UsersCareerSerializer(userinfo).data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {"message": "Couldn't create user's career detail."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    def _updatecareerdetail(self, request, pk) -> Response:
        usercareerinfo = get_object_or_404(UsersCareer, id=pk)
        serializer = UsersCareerSerializer(usercareerinfo, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(
                {
                    "message": "User's career info updated successfully",
                    "data": serializer.data,
                }
            )
        return validators.ValidationError(
            {"message": "Couldn't update user's career info detail."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    def _retrievecareerdetail(self, request, pk) -> Response:
        userscareerdata = get_object_or_404(UsersCareer, id=pk)
        serializer = UsersCareerSerializer(userscareerdata, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            return Response(
                {
                    "message": "User's career info detail retrieved!",
                    "data": serializer.data
                },
                status=status.HTTP_200_OK,
            )
        return validators.ValidationError(
            {"message": "Couldn't fetch user's career detail."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    def _destroycareerdetail(self, request, pk) -> Response:
        userscareerdata = get_object_or_404(UsersCareer, id=pk)
        if userscareerdata:
            userscareerdata.delete()
            return Response(
                {"message": "User's career info deleted successfully :)"},
                status=status.HTTP_204_NO_CONTENT,
            )
        return validators.ValidationError(
            {"message": "Couldn't delete user's career detail!"},
            status=status.HTTP_400_BAD_REQUEST,
        )