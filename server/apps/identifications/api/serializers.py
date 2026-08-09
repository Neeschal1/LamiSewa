from rest_framework import serializers
from apps.identifications.models.entities import IDVerification, UserIDRecords

class UserIDRecordsSerializers(serializers.ModelSerializer):
    class Meta:
        model = UserIDRecords
        fields = ['record_id']
        extra_kwargs = {
            'record_id': {'required': True}
        }

class IDVerificationSerializers(serializers.ModelSerializer):
    class Meta:
        model = IDVerification
        fields = ['fullname', 'date_of_birth', 'permanent_address', 'document_type', 'front_side', 'back_side', 'live_photo', 'status']
        extra_kwargs = {
            'fullname': {'required': True},
            'date_of_birth': {'required': True},
            'permanent_address': {'required': True},
            'document_type': {'required': True},
            'front_side': {'required': True},
            'back_side': {'required': True},
            'live_photo': {'required': True},
            'status': {'required': True},
        }