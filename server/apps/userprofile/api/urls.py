from django.urls import include
from .views import *
from django.urls import path
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register('userprofile', UserProfileSerializerView, basename="userprofile")
router.register('user-profile/basic-info', UsersBasicInfoSerializerView, basename="basicinfo")
router.register('user-profile/personal-info', UsersPersonalInfoSerializerView, basename="personalinfo")
router.register('user-profile/additional-info', UsersAdditionalInfoSerializerView, basename="additionalinfo")
router.register('user-profile/featured-images-details', UsersFeaturedImagesSerializerView, basename="featuredimages")
router.register('user-profile/hobbies-list', UsersHobbiesSerializerView, basename="hobbiesdata")
router.register('user-profile/career-info', UsersCareerSerializerView, basename="careerinfo")
router.register('user-profile/family-detail', UsersFamilyDetailSerializerView, basename="familydetail")
router.register('user-profile/astro-detail', UsersAstroDetailSerializerView, basename="astrodetails")
router.register('user-profile/partner-preference-detail', UsersPartnerPreferenceSerializerView, basename="partnerpreference")
router.register('user-profile/complete-profile', CompleteProfileView, basename="completeprofile")
router.register('matches', SemanticMatchView, basename="semanticmatches")
router.register('search', ProfileSearchView, basename="profilesearch")

urlpatterns = [
    path('me/', OwnProfileUpdateAPIView.as_view(), name="own-profile-update"),
    path('members/<str:profileid>/', MemberDetailAPIView.as_view(), name="member-detail"),
    path('', include(router.urls))
]