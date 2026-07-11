from django.contrib import admin
from .models.entities import *


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = [
        "useremail",
        "username",
        "profileid",
    ]
    search_fields = [
        "useremail",
        "username",
        "userid__username",
        "userid__email",
        "userid__first_name",
        "userid__last_name",
    ]


@admin.register(UsersBasicInfo)
class UsersBasicInfoAdmin(admin.ModelAdmin):
    list_display = [
        "fullname",
        "gender",
        "date_of_birth",
        "profile_handler",
        "userprofileid",
    ]
    search_fields = [
        "fullname",
        "nickname",
        "profile_handler",
        "userprofileid__profileid",
    ]
    list_filter = [
        "gender",
    ]


@admin.register(UsersPersonalInfo)
class PersonalInfoAdmin(admin.ModelAdmin):
    list_display = [
        "userprofileid",
        "maritalstatus",
        "gotra",
        "current_living_country",
        "current_city",
        "residency_status",
    ]
    search_fields = [
        "current_living_country",
        "current_city",
        "userprofileid__profileid",
    ]
    list_filter = [
        "maritalstatus",
        "gotra",
        "residency_status",
    ]


@admin.register(UsersAdditionalInfo)
class AdditionalInfoAdmin(admin.ModelAdmin):
    list_display = [
        "userprofileid",
        "height",
        "weight",
        "religion",
        "diet",
    ]
    search_fields = [
        "userprofileid__profileid",
    ]
    list_filter = [
        "religion",
        "diet",
    ]


@admin.register(UsersFeaturedImages)
class FeaturedImagesAdmin(admin.ModelAdmin):
    list_display = [
        "userprofileid",
    ]
    search_fields = [
        "userprofileid__profileid",
    ]


@admin.register(UsersHobbies)
class HobbiesAdmin(admin.ModelAdmin):
    list_display = [
        "userprofileid",
        "hobby1",
        "hobby2",
        "hobby3",
        "hobby4",
        "hobby5",
    ]
    search_fields = [
        "userprofileid__profileid",
        "hobby1",
        "hobby2",
        "hobby3",
        "hobby4",
        "hobby5",
    ]


@admin.register(UsersCareer)
class CareerAdmin(admin.ModelAdmin):
    list_display = [
        "userprofileid",
        "highest_qualification",
        "working_as",
        "occupation",
        "company_or_organization_name",
    ]
    search_fields = [
        "userprofileid__profileid",
        "college_name",
        "occupation",
        "company_or_organization_name",
    ]
    list_filter = [
        "highest_qualification",
        "working_as",
    ]


@admin.register(UsersFamilyDetail)
class FamilyDetailAdmin(admin.ModelAdmin):
    list_display = [
        "userprofileid",
        "family_type",
        "total_family_members",
        "siblings",
    ]
    search_fields = [
        "userprofileid__profileid",
    ]
    list_filter = [
        "family_type",
    ]


@admin.register(UsersAstroDetail)
class AstroDetailAdmin(admin.ModelAdmin):
    list_display = [
        "userprofileid",
        "mangalik",
        "sunshine",
        "moon_sign",
    ]
    search_fields = [
        "userprofileid__profileid",
    ]
    list_filter = [
        "mangalik",
        "sunshine",
        "moon_sign",
    ]


@admin.register(UsersPartnerPreference)
class PartnerPreferenceAdmin(admin.ModelAdmin):
    list_display = [
        "userprofileid",
        "age_ranging",
        "maritalstatus",
        "living_in",
        "partner_religion",
        "partner_education",
    ]
    search_fields = [
        "userprofileid__profileid",
        "living_in",
        "partner_profession",
    ]
    list_filter = [
        "maritalstatus",
        "partner_religion",
        "partner_diet",
        "partner_education",
        "partner_mangalik",
    ]


@admin.register(UsersStories)
class StoriesAdmin(admin.ModelAdmin):
    list_display = [
        "userprofileid",
        "storyviews",
    ]
    search_fields = [
        "userprofileid__profileid",
    ]