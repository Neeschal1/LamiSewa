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
        recipient_id = request.data.get("recipient")
        title = (request.data.get("title") or "").strip()
        body = (request.data.get("body") or "").strip()
        if not recipient_id or not title:
            return Response({"message": "recipient and title required."}, status=status.HTTP_400_BAD_REQUEST)
        item = Notification.objects.create(
            recipient_id=recipient_id,
            actor=request.user,
            kind=request.data.get("kind", "announcement"),
            title=title[:120],
            body=body,
            data=request.data.get("data", {}),
        )
        return Response(
            {"message": "Posted.", "data": NotificationSerializer(item).data},
            status=status.HTTP_201_CREATED,
        )
