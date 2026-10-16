from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from apps.privacy.models.entities import *
from apps.privacy.services.follow import FollowService
from .serializers import *

class UserPrivacySerializersView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @swagger_auto_schema(request_body=UserPrivacySerializers)
    def create(self, request):
        try:
            UserPrivacy.objects.get_or_create(privacyid=request.user)
            return Response({"message": "users privacy record created."}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"Message":"Exception Occured!", "Issue":str(e)})


class FollowView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def create(self, request):
        result = FollowService().follow(request)
        code = result.pop("status", 200)
        if "error" in result:
            return Response({"message": result["error"]}, status=code)
        return Response({"message": "Followed.", "data": result}, status=code)

    def destroy(self, request, pk=None):
        result = FollowService().unfollow(request, pk or "")
        code = result.pop("status", 200)
        if "error" in result:
            return Response({"message": result["error"]}, status=code)
        return Response({"message": "Unfollowed.", "data": result}, status=code)


class FollowersView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        result = FollowService().followers(request)
        code = result.pop("status", 200)
        if "error" in result:
            return Response({"message": result["error"]}, status=code)
        return Response({"message": "Followers.", "data": result["results"]}, status=code)


class FollowingView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        result = FollowService().following(request)
        code = result.pop("status", 200)
        if "error" in result:
            return Response({"message": result["error"]}, status=code)
        return Response({"message": "Following.", "data": result["results"]}, status=code)


class MutualView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        result = FollowService().mutual(request)
        code = result.pop("status", 200)
        if "error" in result:
            return Response({"message": result["error"]}, status=code)
        return Response({"message": "Mutual follows.", "data": result["results"]}, status=code)