from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from .smsservice import SendOTP
from django.core.cache import cache
import random


class UserAuth:
    def _login(self, email: str, password: str) -> Response:
        if not User.objects.filter(email = email).exists():
            return Response({"Message":"User didn't found with the email provided. So sorry for your inconvenience :("}, status=status.HTTP_404_NOT_FOUND)
        user = User.objects.get(email = email)
        
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)
        
        if (check_password(password, user.password)):
            return Response({"Message":"Login successful :)", "Tokens": {
                "accesstoken": access_token,
                "refreshtoken": refresh_token
            }})
        
        return Response({"Message":"Invalid Credentials. So Sorry :("}, status=status.HTTP_401_UNAUTHORIZED)
    
    

    def _signup(self, firstname: str, email: str, username: str, password: str, number_of_users: int) -> Response:
        if (User.objects.filter(email=email).exists()):
            return Response({"Message":"An account is already signed up with the entered email. Please choose another account. Thank you :)"})
        
        user = User.objects.create(
            first_name = firstname,
            email = email,
            username = username,
            password = make_password(password),
            is_active = True
        )
        
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)
    
        if not user:
            return Response({"Message":"User's account not created. Please try again later :("})
            
        return Response({
            "Message":{
                "Account Detail": f"Account created successfully for {user.first_name}", 
                "UserID": user.id, 
                "Tokens": {
                    "accesstoken":access_token, 
                    "refreshtoken": refresh_token}}, 
                "Total number of users": number_of_users}, 
            status = status.HTTP_201_CREATED)
        
    
    def _verifycredentials(self, name: str, phonenumber: str, email: str) -> Response:
        print("\n\n\nEntered _verifycredentials")
        print("Email:", email)
        
        user_exists = User.objects.filter(email=email).exists()
        print("User exists:", user_exists)

        if user_exists:
            print("Returning user exists response")
            return Response({"Message": "An account with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)
        
        print("\n\n\nSending OTP...")
        type="Account Activation/Verification"
        # sms = SendOTP()
        # result = sms._send_sms(phonenumber, name, type)   
        
        otp = str(random.randint(100000, 999999))
        result = {"success": True, "otpcode": otp}
        
        print(f"\n\n\n{result}\n\n\n")
        
        if result["success"] == True:
            cache.set(f"users_info_{email}", result, timeout=120)     
            print("Saved key:", f"users_info_{email}")
            print("Saved value:", cache.get(f"users_info_{email}")) 
        if not result["success"]:
            return Response({"Message": result["error"]},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"Message": "OTP sent successfully!"},status=status.HTTP_200_OK)
            
    
    def _verifyotpcode(self, email: str, otp: str) -> Response:
        print("\n\nEmail from request:", email)
        print("\nCache key:", f"users_info_{email}")
        print("\nCache value:", cache.get(f"users_info_{email}\n\n")) 
        try:
            user = User.objects.filter(email = email).exists()
        except User.DoesNotExist:
            return Response({"Message": f"Invalid {email}!"}, status=status.HTTP_404_NOT_FOUND)
        
        if user:
            return Response({"Message": "An account is already signed up with the entered email. Please choose another email."}, status=status.HTTP_400_BAD_REQUEST)
        
        storedotpcode = cache.get(f"users_info_{email}")

        if otp == storedotpcode["otpcode"]:
            return Response({"Message": "Credentials successfully verified!"}, status=status.HTTP_200_OK)
            
        if storedotpcode["success"] == False:
            return Response({"Message": "OTP has expired or was not found. Please request a new one."}, status=status.HTTP_400_BAD_REQUEST)
            
        return Response({"Message": "The OTP you entered is incorrect. Please try again."}, status=status.HTTP_400_BAD_REQUEST)
        
            