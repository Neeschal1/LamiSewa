from apps.userprofile.models.entities import FeaturedPhoto, UserProfile


MAX_FEATURED_PHOTOS = 6


class FeaturedPhotos:
    def _profile(self, user):
        try:
            return UserProfile.objects.get(userid=user)
        except UserProfile.DoesNotExist:
            return None

    def _serialize(self, photo):
        from apps.userprofile.api.serializers import FeaturedPhotoSerializer

        return FeaturedPhotoSerializer(photo).data

    def list(self, request):
        profile = self._profile(request.user)
        if profile is None:
            return {"error": "Complete your profile first.", "status": 404}
        photos = FeaturedPhoto.objects.filter(userprofileid=profile)
        return {"results": [self._serialize(p) for p in photos], "status": 200}

    def replace(self, request):
        profile = self._profile(request.user)
        if profile is None:
            return {"error": "Complete your profile first.", "status": 404}
        urls = request.data.get("image_urls")
        if not isinstance(urls, list):
            return {"error": "image_urls must be a list.", "status": 400}
        cleaned = []
        for url in urls:
            url = str(url or "").strip()
            if url and url not in cleaned:
                cleaned.append(url)
        if not cleaned:
            return {"error": "Add at least one photo.", "status": 400}
        if len(cleaned) > MAX_FEATURED_PHOTOS:
            return {"error": f"Maximum {MAX_FEATURED_PHOTOS} photos allowed.", "status": 400}
        FeaturedPhoto.objects.filter(userprofileid=profile).delete()
        photos = [
            FeaturedPhoto(userprofileid=profile, image_url=url, position=i)
            for i, url in enumerate(cleaned)
        ]
        FeaturedPhoto.objects.bulk_create(photos)
        saved = FeaturedPhoto.objects.filter(userprofileid=profile)
        return {"results": [self._serialize(p) for p in saved], "status": 201}

    def add(self, request):
        profile = self._profile(request.user)
        if profile is None:
            return {"error": "Complete your profile first.", "status": 404}
        url = str(request.data.get("image_url") or "").strip()
        if not url:
            return {"error": "image_url is required.", "status": 400}
        count = FeaturedPhoto.objects.filter(userprofileid=profile).count()
        if count >= MAX_FEATURED_PHOTOS:
            return {"error": f"Maximum {MAX_FEATURED_PHOTOS} photos allowed.", "status": 400}
        photo = FeaturedPhoto.objects.create(
            userprofileid=profile, image_url=url, position=count
        )
        return {"result": self._serialize(photo), "status": 201}

    def remove(self, request, pk):
        profile = self._profile(request.user)
        if profile is None:
            return {"error": "Complete your profile first.", "status": 404}
        deleted, _ = FeaturedPhoto.objects.filter(id=pk, userprofileid=profile).delete()
        if not deleted:
            return {"error": "Photo not found.", "status": 404}
        return {"deleted": True, "status": 200}

    def urls_for(self, profile):
        return list(
            FeaturedPhoto.objects.filter(userprofileid=profile).values_list("image_url", flat=True)
        )
