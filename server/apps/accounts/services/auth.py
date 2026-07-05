from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from .smsservice import SendOTP
from django.core.cache import cache


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
        try:
            useremail = User.objects.filter(email=email).exists()
            if useremail:
                type="Account Activation/Verification"
                sms = SendOTP()
                result = sms._send_sms(phonenumber, name, type)
                
                print(result)
                
                try:
                    user = User.objects.get(first_name = name)
                except User.DoesNotExist:
                    return Response({"Message": f"{name} doesnot exists. Sorry :("}, status=status.HTTP_404_NOT_FOUND)
                
                unique_attribute = user.email
                
                if result["success"] == True:
                    cache.set(f"users_info_{unique_attribute}", result, timeout=120)
                
                if not result["success"]:
                    return Response({"Message": result["error"]},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                return Response({"Message": "OTP sent successfully!"},status=status.HTTP_200_OK)
            return Response({"Message": "User with that email didn't found :("}, status=status.HTTP_404_NOT_FOUND)
        except User.DoesNotExist:
            return Response({
                "Message":"An account is already signed up with the entered email. Please choose another account. Thank you :)"}, status=status.HTTP_401_UNAUTHORIZED)
            
    
    def _verifyotpcode(self, email: str, otp: str) -> Response:
        try:
            user = User.objects.filter(email = email).exists()
        except User.DoesNotExist:
            return Response({"Message": f"Invalid {email}!"}, status=status.HTTP_404_NOT_FOUND)
        
        if user:
            storedotpcode = cache.get(f"users_info_{email}")
            if otp == storedotpcode["otpcode"]:
                return Response({"Message": "Credentials successfully verified!"}, status=status.HTTP_200_OK)
            return Response({"Message": "The OTP you entered is incorrect. Please try again."},status=status.HTTP_400_BAD_REQUEST)