import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    
    DOMAIN_NAME_1 = os.getenv('DOMAIN_NAME_1')
    DOMAIN_NAME_2 = os.getenv('DOMAIN_NAME_2')
    DOMAIN_NAME_3 = os.getenv('DOMAIN_NAME_3')
    
    CORSALLOWEDCLIENT = os.getenv('CORSALLOWEDCLIENT')