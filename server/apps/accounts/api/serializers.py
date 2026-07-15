from django.contrib.auth.models import User
from rest_framework import serializers

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
        
        
class UserAccountLoginSerializers(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'})
    

class EmailFingerprintVerificationSerializers(serializers.Serializer):
    email = serializers.EmailField()


class UserAccountCredentialsSetupSerializer(serializers.Serializer):
    contactnumber = serializers.CharField()
    fullname = serializers.CharField()
    email = serializers.EmailField()
    

class VerifyOTPSerializer(serializers.Serializer):
    otp = serializers.CharField()
    email = serializers.EmailField()
    

class FindAccountSerializer(serializers.Serializer):
    contactNumber = serializers.CharField()
    
    
class CodeVerificationForForgotPasswordSerializers(serializers.Serializer):
    contactNumber = serializers.CharField()
    code = serializers.CharField()
    

class ResetPasswordSerializers(serializers.Serializer):
    contactNumber = serializers.CharField()
    password = serializers.CharField()