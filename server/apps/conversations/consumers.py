import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User


class InboxConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope.get("user")
        if not user or user.is_anonymous:
            await self.close()
            return
        self.group = f"user_{user.id}"
        await self.channel_layer.group_add(self.group, self.channel_name)
        await self.accept()

    async def disconnect(self, _code):
        try:
            await self.channel_layer.group_discard(self.group, self.channel_name)
        except Exception:
            pass

    async def receive(self, text_data=None, bytes_data=None):
        return

    async def inbox_event(self, event):
        await self.send(text_data=json.dumps({"kind": "inbox", **event.get("event", {})}))


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope.get("user")
        if not user or user.is_anonymous:
            await self.close()
            return
        self.thread_id = self.scope["url_route"]["kwargs"].get("thread_id")
        allowed = await self._is_member(user.id, self.thread_id)
        if not allowed:
            await self.close()
            return
        self.group = f"thread_{self.thread_id}"
        await self.channel_layer.group_add(self.group, self.channel_name)
        await self.accept()

    async def disconnect(self, _code):
        try:
            await self.channel_layer.group_discard(self.group, self.channel_name)
        except Exception:
            pass

    async def receive(self, text_data=None, bytes_data=None):
        try:
            payload = json.loads(text_data or "{}")
        except Exception:
            return
        user = self.scope.get("user")
        if payload.get("typing") is not None:
            await self.channel_layer.group_send(
                self.group,
                {
                    "type": "chat.typing",
                    "user_id": user.id,
                    "name": user.first_name or user.username,
                    "typing": bool(payload.get("typing")),
                },
            )
            return
        if payload.get("mark_seen"):
            marked = await self._mark_seen(user.id, self.thread_id)
            if marked:
                await self.channel_layer.group_send(
                    self.group, {"type": "chat.seen", "user_id": user.id}
                )
            return
        text = str(payload.get("text", "")).strip()[:2000]
        if not text:
            return
        msg = await self._save(user.id, self.thread_id, text)
        if not msg:
            return
        await self.channel_layer.group_send(
            self.group, {"type": "chat.message", "data": msg}
        )
        try:
            other_id = await self._other_id(user.id, self.thread_id)
            if other_id:
                await self.channel_layer.group_send(
                    f"user_{other_id}",
                    {
                        "type": "inbox.event",
                        "event": {
                            "ntype": "message",
                            "title": user.first_name or user.username,
                            "body": text,
                            "thread_id": self.thread_id,
                        },
                    },
                )
        except Exception:
            pass

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({"kind": "message", **event.get("data", {})}))

    async def chat_typing(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "kind": "typing",
                    "user_id": event.get("user_id"),
                    "name": event.get("name", ""),
                    "typing": event.get("typing", False),
                }
            )
        )

    async def chat_seen(self, event):
        await self.send(
            text_data=json.dumps({"kind": "seen", "user_id": event.get("user_id")})
        )

    @database_sync_to_async
    def _is_member(self, user_id, thread_id):
        from apps.conversations.models.entities import Thread

        try:
            t = Thread.objects.get(id=thread_id)
        except Thread.DoesNotExist:
            return False
        return user_id in (t.member_a_id, t.member_b_id)

    @database_sync_to_async
    def _other_id(self, user_id, thread_id):
        from apps.conversations.models.entities import Thread

        try:
            thread = Thread.objects.get(id=thread_id)
        except Thread.DoesNotExist:
            return None
        return thread.member_b_id if thread.member_a_id == user_id else thread.member_a_id

    @database_sync_to_async
    def _mark_seen(self, user_id, thread_id):
        from apps.conversations.models.entities import Thread

        try:
            thread = Thread.objects.get(id=thread_id)
        except Thread.DoesNotExist:
            return False
        return (
            thread.messages.exclude(message_user_id=user_id).filter(seen=False).update(seen=True)
            > 0
        )

    @database_sync_to_async
    def _save(self, user_id, thread_id, text):
        from apps.conversations.models.entities import Messages, Thread
        from apps.conversations.api.serializers import MessageSerializer
        from apps.privacy.services.follow import FollowService

        try:
            thread = Thread.objects.get(id=thread_id)
            user = User.objects.get(id=user_id)
        except Exception:
            return None
        other = thread.member_b if thread.member_a_id == user_id else thread.member_a
        mutual = FollowService().is_mutual(user, other)
        if not mutual and Messages.objects.filter(thread=thread, message_user=user).exists():
            return None
        msg = Messages.objects.create(
            thread=thread, message_user=user, message_type="Text", text=text
        )
        thread.save(update_fields=["updated_at"])
        return MessageSerializer(msg).data
