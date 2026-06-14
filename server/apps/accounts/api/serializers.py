from django.contrib.auth.models import User
from rest_framework import serializers

# Account signup serializer
class UserAccountSignupSerializers(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "username", "email", "password", "is_active"]
        extra_kwargs = {
            "id": {"read_only": True},
            "first_name": {"required": True},
            "username": {"required": True},
            "email": {"required": True},
            "password": {"required": True, "write_only": True},
            "is_active" : {"read_only": True}
        }
        
        
# Account login serializer
class UserAccountLoginSerializers(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'})
