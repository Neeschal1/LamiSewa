from django.contrib import admin
from .models.entities import *


@admin.register(UserIDRecords)
class UserIDRecordsAdmin(admin.ModelAdmin):
    list_display = ['record_id']


@admin.register(IDVerification)
class IDVerificationAdmin(admin.ModelAdmin):
    list_display = [
        "user_record",
        "fullname",
        "date_of_birth",
        "document_type",
        "status",
    ]

    search_fields = [
        "fullname",
        "permanent_address",
        "user_record__record_id__username",
        "user_record__record_id__email",
        "user_record__record_id__first_name",
        "user_record__record_id__last_name",
    ]

    list_filter = [
        "document_type",
        "status",
    ]
