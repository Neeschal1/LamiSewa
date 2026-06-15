from django.db import models
from django.contrib.auth.models import User
from apps.userprofile.models.entities import UserProfile
from .choices import *


class UserPrivacy(models.Model):
    privacyid = models.OneToOneField(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.privacyid.first_name} | {self.privacyid}"
    

class BlockDetail(models.Model):
    user_privacy = models.ForeignKey(UserPrivacy, on_delete=models.CASCADE, related_name='blocked_users')
    blocked_id = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='blocked_by_users')
    created_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user_privacy', 'blocked_id'],
                name='unique_block'
            )
        ]
    
    def __str__(self):
        return f"{self.user_privacy} -> {self.blocked_id}"
    
    
class FavouriteDetail(models.Model):
    user_privacy = models.ForeignKey(UserPrivacy, on_delete=models.CASCADE, related_name='favourite_users') 
    favourites_user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='favourited_by_users')
    created_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user_privacy', 'favourites_user'],
                name='unique_favourite'
            )
        ]
    
    def __str__(self):
        return f"{self.user_privacy} -> {self.favourites_user}"
    

class FollowDetail(models.Model):
    user_privacy = models.ForeignKey(UserPrivacy, on_delete=models.CASCADE, related_name='user_following_other')
    following_user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='followed_user') 
    created_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user_privacy', 'following_user'],
                name='unique_follow'
            )
        ]
    
    def __str__(self):
        return f"{self.user_privacy} -> {self.following_user}"
    

class ReportUser(models.Model):
    user_privacy = models.ForeignKey(UserPrivacy, on_delete=models.CASCADE, related_name='user_reporting_other')
    reported_id = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='reported_user') 
    reason = models.CharField(max_length=30, choices=REPORT_REASONS)
    description = models.TextField(blank=True,   default="The reported user used abusive language or inappropriate behavior.")
    status = models.CharField(max_length=30, default="Pending", choices=STATUS_CHOICES)
    created_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user_privacy', 'reported_id'],
                name='unique_report_data'
            )
        ]
    
    def __str__(self):
        return f"{self.user_privacy} -> {self.reported_id}"