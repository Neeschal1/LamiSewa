import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    
    DOMAIN_NAME_1 = os.getenv('DOMAIN_NAME_1')
    DOMAIN_NAME_2 = os.getenv('DOMAIN_NAME_2')
    DOMAIN_NAME_3 = os.getenv('DOMAIN_NAME_3')
    
    CORSALLOWEDCLIENT = os.getenv('CORSALLOWEDCLIENT')
    
    DEFAULTUSERPROFILE = os.getenv('DEFAULTUSERPROFILE')
    DEFAULTUSERCOVER = os.getenv('DEFAULTUSERCOVER')
    
    STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY')
    STRIPE_PUBLISHABLE_KEY = os.getenv('STRIPE_PUBLISHABLE_KEY')
    
    SPARROW_SMS_URL = os.getenv('SPARROW_SMS_URL')
    SPARROW_SMS_TOKEN = os.getenv('SPARROW_SMS_TOKEN')
    SPARROW_SMS_FROM = os.getenv('SPARROW_SMS_FROM')