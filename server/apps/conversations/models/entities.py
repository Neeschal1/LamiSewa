from django.db import models
from django.contrib.auth.models import User
from apps.userprofile.models.entities import UserProfile


class Conversation(models.Model):
    conversation_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_conversation_id')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.conversation_id.first_name} | {self.conversation_id}"


class Thread(models.Model):
    member_a = models.ForeignKey(User, on_delete=models.CASCADE, related_name="threads_a")
    member_b = models.ForeignKey(User, on_delete=models.CASCADE, related_name="threads_b")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["member_a", "member_b"], name="unique_thread")
        ]
        ordering = ["-updated_at"]

    def __str__(self):
        return f"{self.member_a} <-> {self.member_b}"


class CallLog(models.Model):
    user_conversation_id = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='users_call_log')
    caller_id = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='called_user')
    call_type = models.CharField(max_length=5, choices=[
        ('Voice', 'VOICE CALL'),
        ('Video', 'VIDEO CALL'),
    ], blank=False)
    started_time = models.DateTimeField(auto_now_add=True, blank=False)
    end_time = models.DateTimeField()
    status = models.CharField(max_length=15, choices=[
        ('Received', "RECEIVED BY THE USER"),
        ('Declined', "DECLINED BY THE USER"),
        ('Not Reachable', "CURRENTLY NOT REACHABLE"),
    ], blank=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user_conversation_id', 'caller_id'],
                name='unique_calllog'
            )
        ]

    def __str__(self):
        return f"{self.user_conversation_id} -> {self.caller_id}"


class Messages(models.Model):
    user_conversation_id = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='users_messages', null=True, blank=True)
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE, related_name="messages", null=True, blank=True)
    message_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    message_type = models.CharField(max_length=15, choices=[
        ('Text', "TEXT"),
        ('Voice', "VOICE"),
        ('Attachments', "ATTACHMENTS"),
    ], blank=False, default="Text")
    text = models.TextField(blank=True, null=True)
    file_url = models.URLField(blank=True)
    seen = models.BooleanField(default=False, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_date"]

    def __str__(self):
        return f"{self.thread_id or self.user_conversation_id_id} -> {self.message_user}"
