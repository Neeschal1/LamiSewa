from django.db import models
from django.contrib.auth.models import User
from .choices import *


class UserIDRecords(models.Model):
    record_id = models.OneToOneField(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.record_id.first_name} | {self.record_id}"
    

class IDVerification(models.Model):
    user_record = models.OneToOneField(UserIDRecords, on_delete=models.CASCADE, related_name='idverification')
    fullname = models.CharField(max_length=50, blank=False)
    date_of_birth = models.CharField(max_length=30, blank=False)
    permanent_address = models.CharField(max_length=50, blank=False)
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES, blank=False)
    front_side = models.URLField(blank=False)
    back_side = models.URLField(blank=True)
    live_photo = models.URLField(blank=False)
    status = models.CharField(max_length=20, default="Pending...")
    
    def __str__(self):
        return f"{self.user_record} -> {self.fullname}"
    
