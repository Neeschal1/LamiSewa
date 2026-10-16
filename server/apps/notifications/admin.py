from apps.notifications.models.entities import Notification
from apps.notifications.forms import BroadcastForm
from apps.notifications.services.push import push_to_user
from django.contrib import admin
from django.contrib.auth.models import User
from django.shortcuts import redirect, render
from django.urls import path


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("recipient", "kind", "title", "is_read", "created_at")
    list_filter = ("kind", "is_read")
    search_fields = ("title", "body", "recipient__email")
    actions = ("broadcast_to_all_users",)
    change_list_template = "admin/notifications/notification/change_list.html"

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if not change:
            push_to_user(
                obj.recipient_id,
                {"ntype": obj.kind, "title": obj.title, "body": obj.body},
            )

    def get_urls(self):
        urls = super().get_urls()
        custom = [
            path(
                "broadcast/",
                self.admin_site.admin_view(self.broadcast_view),
                name="notifications_notification_broadcast",
            ),
        ]
        return custom + urls

    def broadcast_view(self, request):
        if request.method == "POST":
            form = BroadcastForm(request.POST)
            if form.is_valid():
                title = form.cleaned_data["title"][:120]
                body = form.cleaned_data["body"] or ""
                ids = list(User.objects.filter(is_active=True).values_list("id", flat=True))
                Notification.objects.bulk_create(
                    [
                        Notification(
                            recipient_id=uid,
                            actor=request.user,
                            kind="announcement",
                            title=title,
                            body=body,
                            data={},
                        )
                        for uid in ids
                    ],
                    batch_size=500,
                )
                for uid in ids:
                    push_to_user(uid, {"ntype": "announcement", "title": title, "body": body})
                self.message_user(request, f"Broadcast to {len(ids)} users.")
                return redirect("../")
        else:
            form = BroadcastForm()
        return render(
            request,
            "admin/notifications/notification/broadcast.html",
            {"form": form, "title": "Broadcast announcement"},
        )

    @admin.action(description="Broadcast selected notification to all users")
    def broadcast_to_all_users(self, request, queryset):
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
