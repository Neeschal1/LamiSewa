from django.db import models
from django.contrib.auth.models import User
from apps.userprofile.models.entities import UserProfile


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
    