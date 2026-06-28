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
        
