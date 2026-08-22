from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from .smsservice import SendOTP
from apps.userprofile.models.entities import UserProfile
import time
from django.core.cache import cache
import random


class UserAuth:
    def _login(self, email: str, password: str) -> Response:
        try:
            try:
                user = User.objects.get(email = email)
            except User.DoesNotExist:
                 return Response({"Message":"User didn't found with the email provided. So sorry for your inconvenience :("}, status=status.HTTP_404_NOT_FOUND)
            
            match_password = check_password(password, user.password)
            if not match_password:
                return Response({"Message":"Invalid Credentials. So Sorry :("}, status=status.HTTP_401_UNAUTHORIZED)
            
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            
            userinfo = UserProfile.objects.filter(useremail = user.email).exists()
            
            if match_password:
                return Response({"Message":"Login successful :)", "UserprofileStatus": userinfo, "Tokens": {
                    "accesstoken": access_token,
                    "refreshtoken": refresh_token
                }})
            
        except Exception as e:
            return Response({"Message": "Something went wrong!"}, status=status.HTTP_417_EXPECTATION_FAILED)
    

    def _signup(self, firstname: str, email: str, username: str, password: str, number_of_users: int) -> Response:
        try:
            user_account_exists_through_email = User.objects.filter(email=email).exists()
            if user_account_exists_through_email == True:
                return Response({"Message":"An account is already signed up with the entered email. Please choose another account. Thank you :)"}, status=status.HTTP_400_BAD_REQUEST)
        
            otpvalue = cache.get(f'users_account_signup_status_{email}')
            if otpvalue is None:
                return Response({"Message": "Your account is not verified yet. Please get verified first in order to create an account and continue with!"}, status=status.HTTP_401_UNAUTHORIZED)

            if otpvalue["status"] == True:
                user = User.objects.create(
                    first_name = firstname,
                    email = email,
                    username = username,
                    password = make_password(password),
                    is_active = True
                )
                
                cache.delete(f"users_account_signup_status_{email}")
                
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                refresh_token = str(refresh)
                
                userinfo = UserProfile.objects.filter(useremail = user.email).exists()
            
                if not user:
                    return Response({"Message":"User's account not created. Please try again later :("}, status=status.HTTP_403_FORBIDDEN)
                    
                return Response({
                    "Message":{
                        "Account Detail": f"Account created successfully for {user.first_name}", 
                        "UserprofileStatus": userinfo,
                        "Tokens": {
                            "accesstoken":access_token, 
                            "refreshtoken": refresh_token}}
                    }, status = status.HTTP_201_CREATED)

            return Response({"Message": "OTP has expired or was not found. Please request a new one."}, status=status.HTTP_400_BAD_REQUEST)
           
        except Exception as e:
            return Response({"Message": "Something went wrong!", "Exception": str(e)}, status=status.HTTP_417_EXPECTATION_FAILED)
    
    
    def _verifycredentials(self, name: str, phonenumber: str, email: str) -> Response:
        try:
            not_a_unique_email = User.objects.filter(email=email).exists()
            not_a_unique_phone_number = User.objects.filter(username = phonenumber).exists()
            
            if not_a_unique_email == True:
                return Response({"Message": "An account with this email already exists."}, status=status.HTTP_409_CONFLICT)
            
            if not_a_unique_phone_number == True:
                return Response({"Message":"An account is already signed up with the entered phone number!"}, status=status.HTTP_409_CONFLICT)
            
            type="Account Activation/Verification"
            sms = SendOTP()
            result = sms._send_sms(phonenumber, name, type)   
            
            otp = str(random.randint(100000, 999999))
            result = {"success": True, "otpcode": otp}
            
            print(f"\n\n\n{result}\n\n\n")
            
            if not result["success"]:
                return Response({"Message": result["error"]},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            if result["success"] == True:
                cache.set(f"users_info_{email}", result, timeout=120)     
                
            return Response({"Message": "OTP sent successfully!"},status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"Message": "Something went wrong!", "Exception": str(e)}, status=status.HTTP_417_EXPECTATION_FAILED)
            
    
    def _verifyotpcode(self, email: str, otp: str) -> Response:
        try:
            user = User.objects.filter(email = email).exists()
            
            if user == True:
                return Response({"Message": "An account is already signed up with the entered email. Please choose another email."}, status=status.HTTP_400_BAD_REQUEST)
            
            storedotpcode = cache.get(f"users_info_{email}")

            if storedotpcode is None:
                return Response({"Message": "OTP has expired or was not found. Please request a new one."}, status=status.HTTP_400_BAD_REQUEST)
            
            if otp == storedotpcode["otpcode"]:
                cache.set(f'users_account_signup_status_{email}', {"status": True}, timeout=300)
                cache.delete(f"users_info_{email}")
                return Response({"Message": "Credentials successfully verified!"}, status=status.HTTP_200_OK)
            
            return Response({"Message": "The OTP you entered is incorrect. Please try again."}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({"Message": "Something went wrong!", "Exception": str(e)}, status=status.HTTP_417_EXPECTATION_FAILED)
        
    
    def _findaccount(self, username: str) -> Response:
        try:
            user = User.objects.filter(username = username).exists()
          
            if user == True:
                type="Account Activation/Verification"
                # sms = SendOTP()
                # result = sms._send_sms(phonenumber, name, type)   
                
                otp = str(random.randint(100000, 999999))
                result = {"success": True, "otpcode": otp}
                
                print(f"\n\n\n{result}\n\n\n")
                
                if result["success"] == True:
                    userinfo = User.objects.get(username = username)
                    cache.set(f"users_info_{userinfo}", result, timeout=120)     
                    
                if not result["success"]:
                    return Response({"Message": result["error"]},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                return Response({"Message": "OTP sent successfully!", "User Detail": f"{userinfo.pk}"},status=status.HTTP_200_OK)
            
            return Response({"Message": "User with the entered contact number does not exists!"}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({"Message": "Something went wrong!", "Exception": str(e)}, status=status.HTTP_417_EXPECTATION_FAILED)
        
    
    def _codeverification(self, username: str, code: str) -> Response:
        try:
            userinfo = User.objects.filter(username = username).exists()
          
            if userinfo == True:
                user = User.objects.get(username = username)
                storedotpcode = cache.get(f"users_info_{user.username}")
                
                if storedotpcode is None:
                    return Response({"Message": "OTP has expired or was not found. Please request a new one."}, status=status.HTTP_400_BAD_REQUEST)

                if code == storedotpcode["otpcode"]:
                    cache.set(f'users_account_reset_password_status_{user.username}', {"status": True}, timeout=300) 
                    return Response({"Message": "Credentials successfully verified!"}, status=status.HTTP_200_OK)
                
                return Response({"Message": "The OTP you entered is incorrect. Please try again."}, status=status.HTTP_400_BAD_REQUEST)
            
            return Response({"Message": "If an account exists, an OTP has been sent."}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({"Message": "Something went wrong!", "Exception": str(e)}, status=status.HTTP_417_EXPECTATION_FAILED)
                
            
    def _resetpassword(self, username: str, password: str) -> Response:
        try:
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return Response({"Message": "Failed to reset your password!"}, status=status.HTTP_404_NOT_FOUND)
            
            if user:
                stored_otp_code_for_password_reset = cache.get(f'users_account_reset_password_status_{user.email}') 
                if stored_otp_code_for_password_reset["status"] == True:
                    user.set_password(password)
                    user.save()
                    cache.delete(f'users_account_reset_password_status_{user.username}')
                    return Response({"Message": "User's password reset successfully :)"}, status=status.HTTP_200_OK)
                else:
                    return Response({"Message": "OTP has expired or was not found. Please request a new one."}, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
                return Response({"Message": "Something went wrong!", "Exception": str(e)}, status=status.HTTP_417_EXPECTATION_FAILED)
            
    
    def _validatefingerprint(self, useremail: str) -> Response:
        try:
            try:
                user = User.objects.get(email=useremail)
            except User.DoesNotExist:
                return Response(
                    {"Message": "User not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            userinfo = UserProfile.objects.filter(useremail=user.email).exists()

            return Response({
                "Message": "Login successful :)",
                "UserprofileStatus": userinfo,
                "Tokens": {
                    "accesstoken": access_token,
                    "refreshtoken": refresh_token,
                },
            })

        except Exception as e:
            return Response(
                {"Message": "Something went wrong!", "Exception": str(e)},
                status=status.HTTP_417_EXPECTATION_FAILED,
            )