"""Semantic matching gated by an active subscription."""

import json

from apps.payments.models.entities import SubscriptionPackage
from apps.userprofile.models.entities import UserProfile, UserProfileEmbedding
from django.utils import timezone
from ai.semantic import rank_candidates


class SemanticMatcher:
    MIN_SCORE = 0.80

    def _has_active_subscription(self, user) -> bool:
        try:
            record = user.paymentdetail
        except Exception:
            return False
        return SubscriptionPackage.objects.filter(
            user_record=record,
            package_status__in=["Completed", "Verified", "Active"],
            expiry_date__gt=timezone.now(),
        ).exists()

    def _profile_payload(self, profile):
        try:
            basic = profile.basic_info
            basic_data = {
                "fullname": basic.fullname,
                "nickname": basic.nickname,
                "bio": basic.bio,
                "profile_picture": basic.profile_picture,
                "cover_picture": basic.cover_picture,
                "gender": basic.gender,
                "date_of_birth": str(basic.date_of_birth) if basic.date_of_birth else None,
                "profile_handler": basic.profile_handler,
            }
        except Exception:
            basic_data = {}
        try:
            personal = profile.personal_info
            personal_data = {
                "maritalstatus": personal.maritalstatus,
                "gotra": personal.gotra,
                "current_living_country": personal.current_living_country,
                "current_city": personal.current_city,
                "residency_status": personal.residency_status,
            }
        except Exception:
            personal_data = {}
        try:
            additional = profile.additional_info
            additional_data = {
                "height": additional.height,
                "weight": additional.weight,
                "religion": additional.religion,
                "diet": additional.diet,
                "community": additional.community,
            }
        except Exception:
            additional_data = {}
        try:
            career = profile.career
            career_data = {
                "highest_qualification": career.highest_qualification,
                "college_name": career.college_name,
                "working_as": career.working_as,
                "occupation": career.occupation,
                "company_or_organization_name": career.company_or_organization_name,
            }
        except Exception:
            career_data = {}
        try:
            hobbies = profile.hobbies
            hobby_data = [hobbies.hobby1, hobbies.hobby2, hobbies.hobby3, hobbies.hobby4, hobbies.hobby5]
            hobby_data = [h for h in hobby_data if h]
        except Exception:
            hobby_data = []
        try:
            featured = profile.featured_image
            featured_data = [featured.image1, featured.image2, featured.image3, featured.image4, featured.image5, featured.image6]
            featured_data = [u for u in featured_data if u]
        except Exception:
            featured_data = []
        return basic_data, personal_data, additional_data, career_data, hobby_data, featured_data

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
            if float(score) < self.MIN_SCORE:
                continue
            basic_data, personal_data, additional_data, career_data, hobby_data, featured_data = self._profile_payload(profile)
            results.append(
                {
                    "profileid": profile.profileid,
                    "username": profile.username,
                    "visible_to_verified_only": profile.visible_to_verified_only,
                    "score": round(float(score), 4),
                    "basic_info": basic_data,
                    "personal_info": personal_data,
                    "additional_info": additional_data,
                    "career_info": career_data,
                    "hobbies": hobby_data,
                    "featured_images": featured_data,
                }
            )
        return {"results": results, "status": 200}
