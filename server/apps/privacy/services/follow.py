from apps.privacy.models.entities import FollowDetail, UserPrivacy
from apps.userprofile.models.entities import UserProfile
from rest_framework import status


class FollowService:
    def _privacy(self, user):
        privacy, _ = UserPrivacy.objects.get_or_create(privacyid=user)
        return privacy

    def _target(self, profileid):
        return UserProfile.objects.get(profileid=profileid)

    def follow(self, request):
        profileid = (request.data.get("profileid") or "").strip()
        if not profileid:
            return {"error": "profileid is required.", "status": 400}
        try:
            target = self._target(profileid)
        except UserProfile.DoesNotExist:
            return {"error": "Profile not found.", "status": 404}
        if target.userid_id == request.user.id:
            return {"error": "You cannot follow yourself.", "status": 400}
        privacy = self._privacy(request.user)
        _, created = FollowDetail.objects.get_or_create(
            user_privacy=privacy, following_user=target
        )
        try:
            from apps.notifications.models.entities import Notification
            me = UserProfile.objects.filter(userid=request.user).first()
            Notification.objects.create(
                recipient=target.userid,
                actor=request.user,
                kind="follow",
                title="New follower",
                body=f"{me.username if me else request.user.first_name} followed you.",
                data={"profileid": me.profileid if me else ""},
            )
        except Exception:
            pass
        return {"following": True, "created": created, "status": 201 if created else 200}

    def unfollow(self, request, profileid):
        try:
            target = self._target(profileid)
        except UserProfile.DoesNotExist:
            return {"error": "Profile not found.", "status": 404}
        privacy = self._privacy(request.user)
        deleted, _ = FollowDetail.objects.filter(
            user_privacy=privacy, following_user=target
        ).delete()
        return {"following": False, "deleted": deleted, "status": 200}

    def _serialize(self, profile):
        try:
            basic = profile.basic_info
            pic = basic.profile_picture
            name = basic.fullname or basic.nickname
        except Exception:
            pic = ""
            name = profile.username
        return {"profileid": profile.profileid, "username": profile.username, "name": name, "pic": pic}

    def followers(self, request):
        try:
            me = UserProfile.objects.get(userid=request.user)
        except UserProfile.DoesNotExist:
            return {"error": "Complete your profile first.", "status": 404}
        rows = FollowDetail.objects.filter(following_user=me).select_related("user_privacy__privacyid")
        out = []
        for row in rows:
            try:
                follower_profile = UserProfile.objects.get(userid=row.user_privacy.privacyid)
                out.append(self._serialize(follower_profile))
            except UserProfile.DoesNotExist:
                continue
        return {"results": out, "status": 200}

    def following(self, request):
        privacy = self._privacy(request.user)
        rows = FollowDetail.objects.filter(user_privacy=privacy).select_related("following_user")
        return {"results": [self._serialize(r.following_user) for r in rows], "status": 200}

    def mutual(self, request):
        privacy = self._privacy(request.user)
        following_ids = set(
            FollowDetail.objects.filter(user_privacy=privacy).values_list("following_user_id", flat=True)
        )
        try:
            me = UserProfile.objects.get(userid=request.user)
        except UserProfile.DoesNotExist:
            return {"error": "Complete your profile first.", "status": 404}
        follower_user_ids = set(
            FollowDetail.objects.filter(following_user=me).values_list("user_privacy__privacyid", flat=True)
        )
        mutual_profiles = UserProfile.objects.filter(
            userid_id__in=follower_user_ids, id__in=following_ids
        )
        return {"results": [self._serialize(p) for p in mutual_profiles], "status": 200}

    def is_mutual(self, user_a, user_b):
        try:
            pa = UserProfile.objects.get(userid=user_a)
            pb = UserProfile.objects.get(userid=user_b)
        except UserProfile.DoesNotExist:
            return False
        priv_a, _ = UserPrivacy.objects.get_or_create(privacyid=user_a)
        priv_b, _ = UserPrivacy.objects.get_or_create(privacyid=user_b)
        return FollowDetail.objects.filter(user_privacy=priv_a, following_user=pb).exists() and FollowDetail.objects.filter(
            user_privacy=priv_b, following_user=pa
        ).exists()
