from apps.notifications.models.entities import Notification
from django.contrib import admin
from django.contrib.auth.models import User


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("recipient", "kind", "title", "is_read", "created_at")
    list_filter = ("kind", "is_read")
    search_fields = ("title", "body", "recipient__email")
    actions = ("broadcast_to_all_users",)

    @admin.action(description="Broadcast selected notification to all users")
    def broadcast_to_all_users(self, request, queryset):
        from apps.notifications.services.push import push_to_user

        total = 0
        for item in queryset:
            ids = User.objects.filter(is_active=True).exclude(id=item.recipient_id).values_list("id", flat=True)
            copies = [
                Notification(
                    recipient_id=uid,
                    actor=item.actor,
                    kind=item.kind,
                    title=item.title,
                    body=item.body,
                    data=item.data,
                )
                for uid in ids
            ]
            Notification.objects.bulk_create(copies, batch_size=500)
            total += len(copies)
            for uid in ids:
                push_to_user(uid, {"ntype": item.kind, "title": item.title, "body": item.body})
        self.message_user(request, f"Broadcast {total} copies to all users.")
