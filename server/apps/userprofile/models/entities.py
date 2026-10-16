from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from .choices import *
from env_config import Config


class UserProfile(models.Model):
    userid = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    useremail = models.CharField(max_length=50, unique=True)
    username = models.CharField(max_length=15, unique=True)
    profileid = models.CharField(max_length=20, unique=True)
    visible_to_verified_only = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.userid.first_name} | {self.userid} | {self.profileid}"


class UserProfileEmbedding(models.Model):
    userprofileid = models.OneToOneField(
        UserProfile, on_delete=models.CASCADE, related_name="embedding"
    )
    summary = models.TextField(default="")
    embedding = models.TextField(default="[]")
    model_name = models.CharField(max_length=100, default="all-MiniLM-L6-v2")
    dimension = models.IntegerField(default=384)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Embedding of: {self.userprofileid.profileid}"


class UsersBasicInfo(models.Model):
    userprofileid = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='basic_info')
    fullname = models.CharField(max_length=50)
    nickname = models.CharField(max_length=50, blank=True)
    profile_picture = models.URLField(default=Config.DEFAULTUSERPROFILE)
    cover_picture = models.URLField(default=Config.DEFAULTUSERCOVER)
    bio = models.TextField(default="LamiSewa user")
    profile_handler = models.CharField(max_length=30)
    gender = models.CharField(max_length=10, choices=GENDERS)
    date_of_birth = models.DateField()

    def __str__(self):
        return f"Basic info of: {self.userprofileid.userid.first_name} | {self.userprofileid.profileid}"


class UsersPersonalInfo(models.Model):
    userprofileid = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='personal_info')
    maritalstatus = models.CharField(max_length=15, choices=MARITAL_STATUS)
    gotra = models.CharField(max_length=15, choices=GOTRAS)
    current_living_country = models.CharField(max_length=50)
    current_city = models.CharField(max_length=50)
    residency_status = models.CharField(max_length=20, choices=RESIDENCY_STATUS)

    def __str__(self):
        return f"Personal info of: {self.userprofileid.userid.first_name} | {self.userprofileid.profileid}"


class UsersAdditionalInfo(models.Model):
    userprofileid = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='additional_info')
    height = models.CharField(max_length=20, blank=False, choices=HEIGHT_CHOICES)
    weight = models.CharField(max_length=10, blank=False, choices=WEIGHT_CHOICES)
    religion = models.CharField(max_length=30, choices=RELIGION_CHOICE)
    diet = models.CharField(max_length=20, default="Non-Vegeratian")
    community = models.CharField(max_length=20, choices=COMMUNITY_CHOICE)

    def __str__(self):
        return f"Additional info of: {self.userprofileid.userid.first_name} | {self.userprofileid.profileid}"


class UsersFeaturedImages(models.Model):
    userprofileid = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='featured_image')
    image1 = models.URLField(default=Config.DEFAULTUSERPROFILE, blank=True)
    image2 = models.URLField(default=Config.DEFAULTUSERPROFILE, blank=True)
    image3 = models.URLField(default=Config.DEFAULTUSERPROFILE, blank=True)
    image4 = models.URLField(default=Config.DEFAULTUSERPROFILE, blank=True)
    image5 = models.URLField(default=Config.DEFAULTUSERPROFILE, blank=True)
    image6 = models.URLField(default=Config.DEFAULTUSERPROFILE, blank=True)

    def __str__(self):
        return f"Featured Image list of: {self.userprofileid.userid.first_name} | {self.userprofileid.profileid}"


class UsersHobbies(models.Model):
    userprofileid = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='hobbies')
    hobby1 = models.CharField(max_length=255, blank=False)
    hobby2 = models.CharField(max_length=255, blank=False)
    hobby3 = models.CharField(max_length=255, blank=False)
    hobby4 = models.CharField(max_length=255, blank=False)
    hobby5 = models.CharField(max_length=255, blank=False)

    def __str__(self):
        return f"Hobbies list of: {self.userprofileid.userid.first_name} | {self.userprofileid.profileid}"


class UsersCareer(models.Model):
    userprofileid = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='career')
    highest_qualification = models.CharField(max_length=30, choices=QUALIFICATION_DEGREES, blank=False)
    college_name = models.CharField(max_length=255, blank=False)
    working_as = models.CharField(max_length=50, choices=WORKING_CHOICES, blank=False)
    occupation = models.CharField(max_length=50, blank=False)
    company_or_organization_name = models.CharField(max_length=255, blank=False)

    def __str__(self):
        return f"Career detail of: {self.userprofileid.userid.first_name} | {self.userprofileid.profileid}"


class UsersFamilyDetail(models.Model):
    userprofileid = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='family_info')
    family_type = models.CharField(max_length=30, choices=FAMILY_TYPES, blank=False)
    total_family_members = models.IntegerField(blank=False)
    siblings = models.IntegerField(blank=False)

    def __str__(self):
        return f"Family detail of: {self.userprofileid.userid.first_name} | {self.userprofileid.profileid}"


class UsersAstroDetail(models.Model):
    userprofileid = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='astro_info')
    mangalik = models.CharField(max_length=10, choices=MANGLIK_STATUS, blank=False)
    sunshine = models.CharField(max_length=15, choices=SUN_SIGNS, blank=False)
    moon_sign = models.CharField(max_length=15, choices=MOON_SIGNS, blank=False)

    def __str__(self):
        return f"Astro detail of: {self.userprofileid.userid.first_name} | {self.userprofileid.profileid}"


class UsersPartnerPreference(models.Model):
    userprofileid = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='partner_preference')
    age_ranging = models.CharField(max_length=10, blank=False, default="20 to 30")
    maritalstatus = models.CharField(max_length=15, choices=MARITAL_STATUS, blank=False)
    living_in = models.CharField(max_length=50)
    partner_religion = models.CharField(max_length=30, choices=RELIGION_CHOICE)
    partner_diet = models.CharField(max_length=20, default="Non-Vegeratian")
    partner_education = models.CharField(max_length=30, choices=QUALIFICATION_DEGREES, blank=False)
    partner_profession = models.CharField(max_length=50, blank=False)
    partner_mangalik = models.CharField(max_length=10, choices=MANGLIK_STATUS, blank=False)
    preference_summary = models.TextField()

    def __str__(self):
        return f"Partner Preference detail of: {self.userprofileid.userid.first_name} | {self.userprofileid.profileid}"


class UsersStories(models.Model):
    userprofileid = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='stories')
    story = models.URLField(blank=True)
    storyviews = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Story kept by: {self.userprofileid.userid.first_name} | {self.userprofileid.profileid}"


class StoryView(models.Model):
    story = models.ForeignKey(UsersStories, on_delete=models.CASCADE, related_name='views')
    viewer = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='story_views')
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['story', 'viewer'], name='unique_story_view')
        ]
        ordering = ['-viewed_at']

    def __str__(self):
        return f"{self.viewer.username} viewed story {self.story_id}"


class FeaturedPhoto(models.Model):
    userprofileid = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='featured_photos')
    image_url = models.URLField()
    position = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['position', 'id']

    def __str__(self):
        return f"Featured photo of: {self.userprofileid.username} | {self.image_url[:60]}"
