from rest_framework import serializers
from apps.privacy.models.entities import *

class UserPrivacySerializers(serializers.ModelSerializer):
    class Meta:
        model = UserPrivacy
        fields = '__all__'