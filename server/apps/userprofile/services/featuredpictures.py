from apps.userprofile.models.entities import UsersFeaturedImages
from rest_framework.response import Response
from apps.userprofile.api.serializers import *
from rest_framework import status, validators
from django.shortcuts import get_object_or_404

class FeaturedPictures:
    def _createfeaturedimages(self, request) -> Response:
        user = UsersFeaturedImagesSerializer(data=request.data)

        if user.is_valid(raise_exception=True):
            userinfo = UsersFeaturedImages.objects.create(
                userprofileid=user.validated_data["userprofileid"],
                image1=user.validated_data["image1"],
                image2=user.validated_data["image2"],
                image3=user.validated_data["image3"],
                image4=user.validated_data["image4"],
                image5=user.validated_data["image5"],
            )
            return Response(
                {
                    "message": f"Successfully set up user's featured images.",
                    "Profile Info": {
                        "Name": userinfo.userprofileid.userid.first_name,
                        "ProfileID": userinfo.userprofileid.profileid,
                        "PhoneNumber": userinfo.userprofileid.phonenumber,
                    },
                    "data": UsersFeaturedImagesSerializer(userinfo).data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {"message": "Couldn't set up user's featured images."},
            status=status.HTTP_400_BAD_REQUEST,
        )


    def _updatefeaturedimages(self, request, pk) -> Response:
        userinfo = get_object_or_404(UsersFeaturedImages, id=pk)
        serializer = UsersFeaturedImagesSerializer(userinfo, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(
                {
                    "message": "User's featured images info updated successfully.",
                    "data": serializer.data,
                }
            )
        return validators.ValidationError(
            {"message": "Couldn't update user's featured images."},
            status=status.HTTP_400_BAD_REQUEST,
        )


    def _retrievefeaturedimages(self, request, pk) -> Response:
        featuredimgdata = get_object_or_404(UsersFeaturedImages, id=pk)
        serializer = UsersFeaturedImagesSerializer(featuredimgdata, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            return Response(
                {
                    "message": "User's featured images retrieved!",
                    "data": serializer.data
                },
                status=status.HTTP_200_OK,
            )
        return validators.ValidationError(
            {"message": "Couldn't fetch up user's featured images."},
            status=status.HTTP_400_BAD_REQUEST,
        )


    def _destroyfeaturedimages(self, request, pk) -> Response:
        featuredimgdata = get_object_or_404(UsersFeaturedImages, id=pk)
        if featuredimgdata:
            featuredimgdata.delete()
            return Response(
                {"message": "User's featured images deleted successfully :)"},
                status=status.HTTP_204_NO_CONTENT,
            )
        return validators.ValidationError(
            {"message": "Couldn't delete user's featured images!"},
            status=status.HTTP_400_BAD_REQUEST,
        )
