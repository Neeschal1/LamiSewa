import json
import random

from django.contrib.auth.models import User
from django.db import transaction

from ai.embeddings import DIMENSION, MODEL_NAME, build_profile_summary, encode
from apps.userprofile.models.entities import (
    UserProfile,
    UserProfileEmbedding,
    UsersAdditionalInfo,
    UsersBasicInfo,
    UsersCareer,
    UsersHobbies,
    UsersPersonalInfo,
)


class CompleteProfile:
    def _generate_profile_id(self):
        return f"BB00{random.randint(100000, 999999)}"

    def create(self, request) -> dict:
        data = request.data
        user = request.user
        username = (data.get("username") or "").strip()
        if not username:
            return {"error": "Username is required.", "status": 400}
        if UserProfile.objects.filter(username=username).exclude(userid=user).exists():
            return {"error": "User with that username already exists!", "status": 409}

        basic = data.get("basic_info") or {}
        personal = data.get("personal_info") or {}
        additional = data.get("additional_info") or {}
        career = data.get("career_info") or {}
        hobbies = data.get("hobbies") or {}
        visible_only = bool(data.get("visible_to_verified_only", False))

        required_sections = {
            "basic_info": basic,
            "personal_info": personal,
            "additional_info": additional,
            "career_info": career,
            "hobbies": hobbies,
        }
        missing = [k for k, v in required_sections.items() if not v]
        if missing:
            return {"error": f"Missing sections: {', '.join(missing)}.", "status": 400}

        with transaction.atomic():
            profile, created = UserProfile.objects.get_or_create(
                userid=user,
                defaults={
                    "useremail": user.email,
                    "username": username,
                    "profileid": self._unique_profile_id(),
                },
            )
            if not created and profile.username != username:
                if UserProfile.objects.filter(username=username).exclude(pk=profile.pk).exists():
                    return {"error": "User with that username already exists!", "status": 409}
                profile.username = username
            profile.useremail = user.email or profile.useremail
            profile.visible_to_verified_only = visible_only
            profile.save()

            UsersBasicInfo.objects.update_or_create(
                userprofileid=profile, defaults={**basic}
            )
            UsersPersonalInfo.objects.update_or_create(
                userprofileid=profile, defaults={**personal}
            )
            UsersAdditionalInfo.objects.update_or_create(
                userprofileid=profile, defaults={**additional}
            )
            UsersCareer.objects.update_or_create(
                userprofileid=profile, defaults={**career}
            )
            UsersHobbies.objects.update_or_create(
                userprofileid=profile, defaults={**hobbies}
            )

            summary = build_profile_summary(
                {
                    "basic_info": basic,
                    "personal_info": personal,
                    "additional_info": additional,
                    "career_info": career,
                    "hobbies": hobbies,
                }
            )
            vector = encode(summary)
            UserProfileEmbedding.objects.update_or_create(
                userprofileid=profile,
                defaults={
                    "summary": summary,
                    "embedding": json.dumps(vector),
                    "model_name": MODEL_NAME,
                    "dimension": DIMENSION,
                },
            )

        return {
            "profileid": profile.profileid,
            "username": profile.username,
            "summary": summary,
        }

    def _unique_profile_id(self):
        while True:
            pid = self._generate_profile_id()
            if not UserProfile.objects.filter(profileid=pid).exists():
                return pid
