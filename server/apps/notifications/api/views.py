from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from apps.notifications.models.entities import Notification
from .serializers import NotificationSerializer


class NotificationView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        qs = Notification.objects.filter(recipient=request.user)[:50]
        return Response(
            {"message": "Notifications.", "data": NotificationSerializer(qs, many=True).data},
            status=status.HTTP_200_OK,
        )

    def update(self, request, pk=None):
        try:
            item = Notification.objects.get(id=pk, recipient=request.user)
        except Notification.DoesNotExist:
            return Response({"message": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        item.is_read = True
        item.save(update_fields=["is_read"])
        return Response({"message": "Marked read.", "data": NotificationSerializer(item).data})

    def create(self, request):
        if not request.user.is_staff:
            return Response({"message": "Admin only."}, status=status.HTTP_403_FORBIDDEN)
        recipient = request.data.get("recipient")
        title = (request.data.get("title") or "").strip()
        body = (request.data.get("body") or "").strip()
        if not recipient or not title:
            return Response({"message": "recipient and title required."}, status=status.HTTP_400_BAD_REQUEST)
        kind = request.data.get("kind", "announcement")
        payload_data = request.data.get("data", {})
        if isinstance(recipient, str) and recipient.lower() == "all":
            from django.contrib.auth.models import User

            ids = list(User.objects.filter(is_active=True).values_list("id", flat=True))
            items = [
                Notification(
                    recipient_id=uid,
                    actor=request.user,
                    kind=kind,
                    title=title[:120],
                    body=body,
                    data=payload_data,
                )
                for uid in ids
            ]
            Notification.objects.bulk_create(items, batch_size=500)
            return Response(
                {"message": f"Broadcast to {len(items)} users.", "data": {"count": len(items)}},
                status=status.HTTP_201_CREATED,
            )
        item = Notification.objects.create(
            recipient_id=recipient,
            actor=request.user,
            kind=kind,
            title=title[:120],
            body=body,
            data=payload_data,
        )
        return Response(
            {"message": "Posted.", "data": NotificationSerializer(item).data},
            status=status.HTTP_201_CREATED,
        )
