from apps.userprofile.models.entities import UserProfile
from rest_framework.response import Response
from rest_framework import status
import random

class UserProfileService:
    def _generate_profile_id(self):
        return f"BB00{random.randint(0, 999999)}"
    
    def _profileid(self, id: int, phonenumber: str) -> Response:
        while True:
            profile_id = self._generate_profile_id()
            if not UserProfile.objects.filter(profileid = profile_id).exists():
                break
        
        profile = UserProfile.objects.create(
            userid=id,
            phonenumber=phonenumber,
            profileid=profile_id,
        )
        return Response({"message": f"Successfully created {profile.userid.first_name}'s Profile.", "data": {"Userid": profile.userid.pk, "Phonenumber": profile.phonenumber, "Profileid": profile.profileid}}, status=status.HTTP_201_CREATED)
