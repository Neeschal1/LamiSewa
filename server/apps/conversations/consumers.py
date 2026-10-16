import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User


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
        text = str(payload.get("text", "")).strip()[:2000]
        if not text:
            return
        user = self.scope.get("user")
        msg = await self._save(user.id, self.thread_id, text)
        if not msg:
            return
        await self.channel_layer.group_send(
            self.group, {"type": "chat.message", "data": msg}
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event.get("data", {})))

    @database_sync_to_async
    def _is_member(self, user_id, thread_id):
        from apps.conversations.models.entities import Thread

        try:
            t = Thread.objects.get(id=thread_id)
        except Thread.DoesNotExist:
            return False
        return user_id in (t.member_a_id, t.member_b_id)

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
        if not FollowService().is_mutual(user, other):
            return None
        msg = Messages.objects.create(
            thread=thread, message_user=user, message_type="Text", text=text
        )
        return MessageSerializer(msg).data
