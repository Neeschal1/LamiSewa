import json

from django.db import transaction

from ai.embeddings import DIMENSION, MODEL_NAME, build_profile_summary, encode
from apps.userprofile.api.serializers import (
    UsersAdditionalInfoSerializer,
    UsersBasicInfoSerializer,
    UsersCareerSerializer,
    UsersPersonalInfoSerializer,
)
from apps.userprofile.models.entities import UserProfile, UserProfileEmbedding


SECTION_MODEL_FIELDS = {
    "basic_info": (
        UsersBasicInfoSerializer,
        "basic_info",
        {"fullname", "nickname", "bio", "profile_picture", "cover_picture", "profile_handler", "gender", "date_of_birth"},
    ),
    "personal_info": (
        UsersPersonalInfoSerializer,
        "personal_info",
        {"maritalstatus", "gotra", "current_living_country", "current_city", "residency_status"},
    ),
    "additional_info": (
        UsersAdditionalInfoSerializer,
        "additional_info",
        {"height", "weight", "religion", "diet", "community"},
    ),
    "career_info": (
        UsersCareerSerializer,
        "career",
        {"highest_qualification", "college_name", "working_as", "occupation", "company_or_organization_name"},
    ),
}


class OwnProfileUpdate:
    RESET_COVER = "__default__"

    def update(self, request) -> dict:
        try:
            profile = UserProfile.objects.get(userid=request.user)
        except UserProfile.DoesNotExist:
            return {"error": "Complete your profile first.", "status": 404}
        data = request.data
        username = data.get("username")
        if username is not None:
            username = str(username).strip()
            if not username:
                return {"error": "Username cannot be empty.", "status": 400}
            if (
                UserProfile.objects.filter(username=username)
                .exclude(pk=profile.pk)
                .exists()
            ):
                return {"error": "User with that username already exists!", "status": 409}
        updates = {}
        for key, (serializer_cls, rel, allowed) in SECTION_MODEL_FIELDS.items():
            section = data.get(key)
            if not isinstance(section, dict) or not section:
                continue
            cleaned = {k: v for k, v in section.items() if k in allowed}
            if key == "basic_info" and cleaned.get("cover_picture") == self.RESET_COVER:
                from env_config import Config

                cleaned["cover_picture"] = Config.DEFAULTUSERCOVER or ""
            if not cleaned:
                continue
            try:
                obj = getattr(profile, rel)
            except Exception:
                return {"error": f"Complete your profile first.", "status": 404}
            serializer = serializer_cls(obj, data=cleaned, partial=True)
            try:
                serializer.is_valid(raise_exception=True)
            except Exception as e:
                return {"error": str(getattr(e, "detail", e)), "status": 400}
            updates[key] = (serializer, cleaned)
        if username is None and not updates:
            return {"error": "Nothing to update.", "status": 400}
        with transaction.atomic():
            if username is not None:
                profile.username = username
                profile.save(update_fields=["username"])
            for serializer, _ in updates.values():
                serializer.save()
            self._refresh_embedding(profile)
        return {"username": profile.username, "updated": list(updates.keys()), "status": 200}

    def _refresh_embedding(self, profile):
        from apps.userprofile.api.serializers import UsersHobbiesSerializer

        def safe(serializer_cls, obj):
            try:
                return dict(serializer_cls(obj).data)
            except Exception:
                return {}

        payload = {
            "basic_info": safe(UsersBasicInfoSerializer, getattr(profile, "basic_info", None)),
            "personal_info": safe(UsersPersonalInfoSerializer, getattr(profile, "personal_info", None)),
            "additional_info": safe(UsersAdditionalInfoSerializer, getattr(profile, "additional_info", None)),
            "career_info": safe(UsersCareerSerializer, getattr(profile, "career", None)),
            "hobbies": safe(UsersHobbiesSerializer, getattr(profile, "hobbies", None)),
        }
        summary = build_profile_summary(payload)
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
