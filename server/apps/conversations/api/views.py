from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from apps.conversations.models.entities import Messages, Thread
from apps.privacy.services.follow import FollowService
from .serializers import MessageSerializer, ThreadSerializer


def ordered_pair(a, b):
    return (a, b) if a.id < b.id else (b, a)


class ConversationView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        threads = Thread.objects.filter(
            Q(member_a=request.user) | Q(member_b=request.user)
        ).order_by("-updated_at")[:50]
        out = []
        for t in threads:
            other = t.member_b if t.member_a_id == request.user.id else t.member_a
            last = t.messages.order_by("-created_date").first()
            mutual = FollowService().is_mutual(request.user, other)
            sent_by_me = t.messages.filter(message_user=request.user).exists()
            out.append(
                {
                    "id": t.id,
                    "other_user_id": other.id,
                    "other_name": other.first_name or other.username,
                    "last_text": last.text if last else "",
                    "last_at": last.created_date if last else t.updated_at,
                    "mutual": mutual,
                    "can_message": bool(mutual or not sent_by_me),
                }
            )
        return Response({"message": "Conversations.", "data": out})

    def create(self, request):
        other_id = request.data.get("user_id")
        profileid = str(request.data.get("profileid") or "").strip()
        other = None
        if other_id:
            try:
                other = User.objects.get(id=other_id)
            except User.DoesNotExist:
                return Response({"message": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        elif profileid:
            from apps.userprofile.models.entities import UserProfile

            try:
                other = UserProfile.objects.get(profileid=profileid).userid
            except UserProfile.DoesNotExist:
                return Response({"message": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"message": "user_id or profileid required."}, status=status.HTTP_400_BAD_REQUEST)
        if other.id == request.user.id:
            return Response({"message": "You cannot message yourself."}, status=status.HTTP_400_BAD_REQUEST)
        a, b = ordered_pair(request.user, other)
        thread, _ = Thread.objects.get_or_create(member_a=a, member_b=b)
        return Response(
            {"message": "Thread ready.", "data": ThreadSerializer(thread).data},
            status=status.HTTP_201_CREATED,
        )


class MessageView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        thread_id = request.query_params.get("thread")
        if not thread_id:
            return Response({"message": "thread required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            thread = Thread.objects.get(id=thread_id)
        except Thread.DoesNotExist:
            return Response({"message": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        if request.user.id not in (thread.member_a_id, thread.member_b_id):
            return Response({"message": "Forbidden."}, status=status.HTTP_403_FORBIDDEN)
        msgs = thread.messages.order_by("created_date")[:200]
        return Response(
            {"message": "Messages.", "data": MessageSerializer(msgs, many=True).data}
        )

    def create(self, request):
        thread_id = request.data.get("thread")
        text = (request.data.get("text") or "").strip()[:2000]
        if not thread_id or not text:
            return Response({"message": "thread and text required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            thread = Thread.objects.get(id=thread_id)
        except Thread.DoesNotExist:
            return Response({"message": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        if request.user.id not in (thread.member_a_id, thread.member_b_id):
            return Response({"message": "Forbidden."}, status=status.HTTP_403_FORBIDDEN)
        other = thread.member_b if thread.member_a_id == request.user.id else thread.member_a
        mutual = FollowService().is_mutual(request.user, other)
        if not mutual and Messages.objects.filter(thread=thread, message_user=request.user).exists():
            return Response(
                {"message": "You can send only one message until you both follow each other."},
                status=status.HTTP_403_FORBIDDEN,
            )
        msg = Messages.objects.create(
            thread=thread, message_user=request.user, message_type="Text", text=text
        )
        Thread.objects.filter(id=thread.id).update()
        if not mutual:
            try:
                from apps.notifications.models.entities import Notification

                Notification.objects.create(
                    recipient=other,
                    actor=request.user,
                    kind="message",
                    title="New message request",
                    body=f"{request.user.first_name or request.user.username} sent you a message request.",
                    data={"thread": thread.id},
                )
            except Exception:
                pass
        try:
            from channels.layers import get_channel_layer
            from asgiref.sync import async_to_sync

            layer = get_channel_layer()
            if layer is not None:
                async_to_sync(layer.group_send)(
                    f"thread_{thread.id}",
                    {
                        "type": "chat.message",
                        "data": MessageSerializer(msg).data,
                    },
                )
        except Exception:
            pass
        return Response(
            {"message": "Sent.", "data": MessageSerializer(msg).data},
            status=status.HTTP_201_CREATED,
        )
