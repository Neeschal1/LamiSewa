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

# user_record = models.ForeignKey(UserPaymentRecords, on_delete=models.CASCADE, related_name='users_payments')
#     package_type = models.CharField(max_length=15, blank=False, choices=PACKAGE_TYPES)
#     transaction_id = models.IntegerField(blank=False)
#     package_amount = models.IntegerField(blank=False)
#     purchased_date = models.DateTimeField(auto_now_add=True)
#     expiry_date = models.DateTimeField(blank=True, null=True)
#     paid_via = models.CharField(max_length=16, choices=PAYMENT_METHODS)
#     payment_status = models.CharField(max_length=10, default="Paid")
#     package_status = models.CharField(max_length=15, choices=STATUS_CHOICES, default="Pending")