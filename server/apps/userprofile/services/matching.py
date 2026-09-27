"""Semantic matching gated by an active subscription."""

import json

from apps.payments.models.entities import SubscriptionPackage
from apps.userprofile.models.entities import UserProfile, UserProfileEmbedding
from django.utils import timezone
from ai.semantic import rank_candidates


class SemanticMatcher:
    def _has_active_subscription(self, user) -> bool:
        try:
            record = user.paymentdetail
        except Exception:
            return False
        return SubscriptionPackage.objects.filter(
            user_record=record,
            package_status__iexact="Active",
            expiry_date__gt=timezone.now(),
        ).exists()

    def ranked_matches(self, request, top_k: int = 20):
        try:
            me = UserProfile.objects.get(userid=request.user)
            mine = UserProfileEmbedding.objects.get(userprofileid=me)
        except Exception as e:
            return {"error": f"Complete your profile first: {e}", "status": 404}

        if not self._has_active_subscription(request.user):
            return {"error": "Active subscription required.", "status": 402}

        try:
            query_vec = json.loads(mine.embedding or "[]")
        except Exception:
            query_vec = []
        if not query_vec:
            return {"error": "No embedding found for your profile.", "status": 404}

        candidates = []
        for emb in UserProfileEmbedding.objects.exclude(userprofileid=me).select_related(
            "userprofileid"
        ):
            try:
                vec = json.loads(emb.embedding or "[]")
            except Exception:
                continue
            if vec:
                candidates.append((emb.userprofileid, vec))

        ranked = rank_candidates(query_vec, candidates, top_k=top_k)
        results = []
        for profile, score in ranked:
            try:
                basic = profile.basic_info
                basic_data = {
                    "fullname": basic.fullname,
                    "nickname": basic.nickname,
                    "bio": basic.bio,
                    "profile_picture": basic.profile_picture,
                    "cover_picture": basic.cover_picture,
                    "gender": basic.gender,
                }
            except Exception:
                basic_data = {}
            try:
                hobbies = profile.hobbies
                hobby_data = [hobbies.hobby1, hobbies.hobby2, hobbies.hobby3, hobbies.hobby4, hobbies.hobby5]
            except Exception:
                hobby_data = []
            results.append(
                {
                    "profileid": profile.profileid,
                    "username": profile.username,
                    "visible_to_verified_only": profile.visible_to_verified_only,
                    "score": round(float(score), 4),
                    "basic_info": basic_data,
                    "hobbies": hobby_data,
                }
            )
        return {"results": results, "status": 200}
