from apps.userprofile.models.entities import UserProfile


class ProfileSearch:
    def search(self, request):
        qs = UserProfile.objects.exclude(userid=request.user).select_related(
            "basic_info", "personal_info", "additional_info", "career", "hobbies"
        )
        gender = (request.query_params.get("gender") or "").strip()
        city = (request.query_params.get("city") or "").strip()
        country = (request.query_params.get("country") or "").strip()
        marital = (request.query_params.get("maritalstatus") or "").strip()
        religion = (request.query_params.get("religion") or "").strip()
        occupation = (request.query_params.get("occupation") or "").strip()
        query = (request.query_params.get("q") or "").strip()
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
        if query:
            qs = qs.filter(username__icontains=query)
        results = []
        for profile in qs[:50]:
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
            results.append(
                {
                    "profileid": profile.profileid,
                    "username": profile.username,
                    "basic_info": basic_data,
                    "hobbies": hobby_data,
                    "city": city_name,
                }
            )
        return {"results": results, "status": 200}
