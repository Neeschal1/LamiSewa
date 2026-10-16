from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import ConversationView, MessageView

router = DefaultRouter()
router.register('conversations', ConversationView, basename="conversations")
router.register('messages', MessageView, basename="messages")

urlpatterns = [path('', include(router.urls))]
