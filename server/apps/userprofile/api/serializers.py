from apps.userprofile.models.entities import *
from rest_framework import serializers

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["userid", "phonenumber"]
        extra_kwargs = {
            "userid": {"required": True, "write_only": True},
            "phonenumber": {"required": True},
            "profileid": {"read_only": True},
        }
        

class UsersBasicInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsersBasicInfo
        fields = '__all__'
        extra_kwargs = {
            "userprofileid": {"write_only": True},
            "fullname": {"required": True},
            "nickname": {"required": True},
            "bio": {"required": True},
            "profile_picture": {"required": True},
            "cover_picture": {"required": True},
            "profile_handler": {"required": True},
            "nickname": {"required": True},
            "gender": {"required": True},
            "date_of_birth": {"required": True},
        }
        
    
class UsersPersonalInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsersPersonalInfo
        fields = '__all__'
        extra_kwargs = {
            "userprofileid": {"write_only": True},
            "maritalstatus": {"required": True},
            "gotra": {"required": True},
            "current_living_country": {"required": True},
            "current_city": {"required": True},
            "residency_status": {"required": True},
        }