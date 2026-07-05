import requests
import random
from env_config import Config

class SendOTP:
    
    def _send_sms(self, phone_number, name, type):
        otpcode = random.randint(100000, 999999)
        
        payload = {
            "token": Config.SPARROW_SMS_TOKEN,
            "from": f"{Config.SPARROW_SMS_FROM}",
            "to": phone_number,
            "text": f"""Hey {name}, your LamiSewa {type} code is {otpcode}. This code is valid for 2 minutes. Please do not share it with anyone. 
            
              Thank You :)
            Team Lamisewa"""
        }
        try:
            response = requests.post(Config.SPARROW_SMS_URL, data=payload)
            response.raise_for_status()
            return {
                "success": True,
                "response": response.json()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }