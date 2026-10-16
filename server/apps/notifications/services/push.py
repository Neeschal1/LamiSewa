def push_to_user(user_id, event: dict) -> None:
    try:
        from channels.layers import get_channel_layer
        from asgiref.sync import async_to_sync

        layer = get_channel_layer()
        if layer is None:
            return
        async_to_sync(layer.group_send)(
            f"user_{user_id}", {"type": "inbox.event", "event": event}
        )
    except Exception:
        pass
