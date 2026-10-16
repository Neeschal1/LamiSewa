from rest_framework import serializers
from apps.conversations.models.entities import Thread, Messages


class ThreadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = ("id", "member_a", "member_b", "updated_at")


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Messages
        fields = ("id", "thread", "message_user", "message_type", "text", "file_url", "seen", "created_date")
        read_only_fields = ("id", "message_user", "created_date")
