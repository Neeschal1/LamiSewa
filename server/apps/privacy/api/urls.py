from django.urls import include
from .views import *
from django.urls import path
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register('userprivacy', UserPrivacySerializersView, basename="privacy")
router.register('follow', FollowView, basename="follow")
router.register('followers', FollowersView, basename="followers")
router.register('following', FollowingView, basename="following")
router.register('mutual', MutualView, basename="mutual")

urlpatterns = [
    path('', include(router.urls))
]