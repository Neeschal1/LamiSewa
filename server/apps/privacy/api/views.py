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
        profileid = str(request.data.get("profileid") or "").strip()
        target_user_id = None
        if profileid:
            try:
                from apps.userprofile.models.entities import UserProfile

                target_user_id = UserProfile.objects.get(profileid=profileid).userid_id
            except Exception:
                target_user_id = None
        result = FollowService().follow(request)
        code = result.pop("status", 200)
        if "error" in result:
            return Response({"message": result["error"]}, status=code)
        if target_user_id and target_user_id != request.user.id:
            try:
                from apps.notifications.services.push import push_to_user
                from apps.userprofile.models.entities import UserProfile

                try:
                    actor = UserProfile.objects.get(userid=request.user)
                    actor_profileid = actor.profileid
                    actor_name = actor.username
                except Exception:
                    actor_profileid = ""
                    actor_name = request.user.first_name or request.user.username
                push_to_user(
                    target_user_id,
                    {
                        "ntype": "follow",
                        "title": "New follower",
                        "body": f"{actor_name} followed you.",
                        "actor_profileid": actor_profileid,
                    },
                )
            except Exception:
                pass
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