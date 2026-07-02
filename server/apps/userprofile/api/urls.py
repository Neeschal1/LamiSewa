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

urlpatterns = [
    path('', include(router.urls))
]