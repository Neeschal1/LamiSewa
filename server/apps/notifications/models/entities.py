from django.db import models
from django.contrib.auth.models import User


class Notification(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    actor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="actor_notifications")
    kind = models.CharField(max_length=30, default="general")
    title = models.CharField(max_length=120)
    body = models.TextField(blank=True, default="")
    data = models.JSONField(default=dict, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.recipient} | {self.kind} | {self.title}"
