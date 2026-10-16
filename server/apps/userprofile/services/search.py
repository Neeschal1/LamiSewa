from datetime import date

from django.db.models import Q

from apps.userprofile.models.entities import UserProfile


def _to_int(value, default):
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


class ProfileSearch:
    def search(self, request):
        params = request.query_params
        if str(params.get("random") or "").lower() in ("1", "true", "yes"):
            return self.random_member(request)
        qs = UserProfile.objects.exclude(userid=request.user).select_related(
            "basic_info", "personal_info", "additional_info", "career", "hobbies"
        )
        gender = (params.get("gender") or "").strip()
        city = (params.get("city") or "").strip()
        country = (params.get("country") or "").strip()
        marital = (params.get("maritalstatus") or "").strip()
        religion = (params.get("religion") or "").strip()
        occupation = (params.get("occupation") or "").strip()
        query = (params.get("q") or "").strip()
        living_in = (params.get("living_in") or "").strip()
        education = (params.get("education") or "").strip()
        diet = (params.get("diet") or "").strip()
        mangalik = (params.get("mangalik") or "").strip()
        community = (params.get("community") or "").strip()
        age_min_raw = (params.get("age_min") or "").strip()
        age_max_raw = (params.get("age_max") or "").strip()
        if gender:
            qs = qs.filter(basic_info__gender__iexact=gender)
        if city:
            qs = qs.filter(personal_info__current_city__icontains=city)
        if country:
            qs = qs.filter(personal_info__current_living_country__icontains=country)
        if marital:
            qs = qs.filter(personal_info__maritalstatus__iexact=marital)
        if religion:
            qs = qs.filter(additional_info__religion__iexact=religion)
        if occupation:
            qs = qs.filter(career__occupation__icontains=occupation)
        if living_in:
            qs = qs.filter(
                Q(personal_info__current_city__icontains=living_in)
                | Q(personal_info__current_living_country__icontains=living_in)
            )
        if education:
            qs = qs.filter(
                Q(career__highest_qualification__icontains=education)
                | Q(career__college_name__icontains=education)
                | Q(career__occupation__icontains=education)
            )
        if diet:
            qs = qs.filter(additional_info__diet__iexact=diet)
        if community:
            qs = qs.filter(additional_info__community__iexact=community)
        if mangalik:
            qs = qs.filter(astro_info__mangalik__iexact=mangalik)
        if age_min_raw or age_max_raw:
            age_min = max(18, min(100, _to_int(age_min_raw, 18)))
            age_max = max(18, min(100, _to_int(age_max_raw, 100)))
            if age_min > age_max:
                age_min, age_max = age_max, age_min
            today = date.today()
            try:
                oldest = date(today.year - age_max, today.month, today.day)
                youngest = date(today.year - age_min, today.month, today.day)
            except ValueError:
                oldest = date(today.year - age_max, today.month, 28)
                youngest = date(today.year - age_min, today.month, 28)
            qs = qs.filter(basic_info__date_of_birth__range=(oldest, youngest))
        if query:
            qs = qs.filter(
                Q(username__icontains=query)
                | Q(profileid__icontains=query)
                | Q(basic_info__fullname__icontains=query)
                | Q(basic_info__nickname__icontains=query)
            )
        results = []
        for profile in qs[:50]:
            results.append(self._card(profile))
        return {"results": results, "status": 200}

    def random_member(self, request):
        profile = (
            UserProfile.objects.exclude(userid=request.user).order_by("?").first()
        )
        if profile is None:
            return {"results": [], "status": 200}
        return {"results": [self._card(profile)], "status": 200}

    def _card(self, profile):
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
            hobby_data = [h for h in [hobbies.hobby1, hobbies.hobby2, hobbies.hobby3, hobbies.hobby4, hobbies.hobby5] if h]
        except Exception:
            hobby_data = []
        try:
            city_name = profile.personal_info.current_city
        except Exception:
            city_name = ""
        return {
            "profileid": profile.profileid,
            "username": profile.username,
            "basic_info": basic_data,
            "hobbies": hobby_data,
            "city": city_name,
        }
