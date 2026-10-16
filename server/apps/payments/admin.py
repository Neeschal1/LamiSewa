from django.contrib import admin
from apps.payments.models.entities import SubscriptionPackage, UserPaymentRecords


@admin.register(UserPaymentRecords)
class UserPaymentRecordsAdmin(admin.ModelAdmin):
    list_display = ['payment_id']


@admin.register(SubscriptionPackage)
class SubscriptionPackageAdmin(admin.ModelAdmin):
    list_display = [
        "user_record",
        "package_type",
        "transaction_id",
        "package_amount",
        "purchased_date",
        "expiry_date",
        "paid_via",
        "payment_status",
        "package_status",
    ]
    search_fields = [
        "user_record",
        "payment_status",
        "package_type",
        "purchased_date",
        "package_status",
    ]
    list_filter = [
        "package_type",
        "paid_via",
        "package_status",
    ]
