from rest_framework import serializers
from apps.notifications.models.entities import Notification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ("id", "kind", "title", "body", "data", "is_read", "created_at")
