from django.contrib import admin
from .models.entities import Conversation, CallLog, Messages


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('id', 'conversation_id', 'created_at')
    search_fields = ('conversation_id__username', 'conversation_id__first_name', 'conversation_id__email')
    list_filter = ('created_at',)
    ordering = ('-created_at',)


@admin.register(CallLog)
class CallLogAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user_conversation_id',
        'caller_id',
        'call_type',
        'status',
        'started_time',
        'end_time'
    )

    search_fields = (
        'caller_id__phonenumber',
        'caller_id__userid__username',
        'user_conversation_id__conversation_id__username',
    )

    list_filter = (
        'call_type',
        'status',
        'started_time',
    )

    ordering = ('-started_time',)

    readonly_fields = ('started_time',)


@admin.register(Messages)
class MessagesAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user_conversation_id',
        'message_user',
        'message_type',
        'seen',
        'created_date'
    )

    search_fields = (
        'text',
        'user_conversation_id__conversation_id__username',
    )

    list_filter = (
        'message_type',
        'seen',
        'created_date',
    )

    ordering = ('-created_date',)

    readonly_fields = ('created_date',)

    list_editable = ('seen',)