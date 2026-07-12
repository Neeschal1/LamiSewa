from apps.userprofile.models.entities import *
from rest_framework import serializers

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["useremail", "username", "profileid", "userid"]
        extra_kwargs = {
            "userid": {"read_only": True},
            "useremail": {"required": True},
            "username": {"required": True},
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
        

class UsersAdditionalInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsersAdditionalInfo
        fields = '__all__'
        extra_kwargs = {
            "userprofileid": {"write_only": True},
            "height": {"required": True},
            "weight": {"required": True},
            "religion": {"required": True},
            "diet": {"required": True},
            "community": {"required": True},
        }
        

class UsersFeaturedImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsersFeaturedImages
        fields = '__all__'
        extra_kwargs = {
            "userprofileid": {"write_only": True},
        }
        
        
class UsersHobbiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsersHobbies
        fields = '__all__'
        extra_kwargs = {
            "userprofileid": {"write_only": True},
            "hobby1": {"required": True},
            "hobby2": {"required": True},
            "hobby3": {"required": True},
            "hobby4": {"required": True},
            "hobby5": {"required": True},
        }
        
        
class UsersCareerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsersCareer
        fields = '__all__'
        extra_kwargs = {
            "userprofileid": {"write_only": True},
            "highest_qualification": {"required": True},
            "college_name": {"required": True},
            "working_as": {"required": True},
            "occupation": {"required": True},
            "company_or_organization_name": {"required": True},
        }
        
        
class UsersFamilyDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsersFamilyDetail
        fields = '__all__'
        extra_kwargs = {
            "userprofileid": {"write_only": True},
            "family_type": {"required": True},
            "total_family_members": {"required": True},
            "siblings": {"required": True},
        }
        
        
class UsersAstroDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsersAstroDetail
        fields = '__all__'
        extra_kwargs = {
            "userprofileid": {"write_only": True},
            "mangalik": {"required": True},
            "sunshine": {"required": True},
            "moon_sign": {"required": True},
        }
        
        
class UsersPartnerPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsersPartnerPreference
        fields = '__all__'
        extra_kwargs = {
            "userprofileid": {"write_only": True},
            "age_ranging": {"required": True},
            "maritalstatus": {"required": True},
            "living_in": {"required": True},
            "partner_religion": {"required": True},
            "partner_diet": {"required": True},
            "partner_education": {"required": True},
            "partner_profession": {"required": True},
            "partner_mangalik": {"required": True},
            "preference_summary": {"read_only": True},
        }