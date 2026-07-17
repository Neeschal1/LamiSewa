from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from .choices import *

class UserPaymentRecords(models.Model):
    payment_id = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.payment_id.first_name} | {self.payment_id}"
    

class SubscriptionPackage(models.Model):
    user_record = models.ForeignKey(UserPaymentRecords, on_delete=models.CASCADE, related_name='users_payments')
    package_type = models.CharField(max_length=15, blank=False, choices=PACKAGE_TYPES)
    transaction_id = models.IntegerField(blank=False)
    package_amount = models.IntegerField(blank=False)
    purchased_date = models.DateTimeField(auto_now_add=True)
    expiry_date = models.DateTimeField(blank=True, null=True)
    paid_via = models.CharField(max_length=16, choices=PAYMENT_METHODS)
    payment_status = models.CharField(max_length=10, default="Paid")
    package_status = models.CharField(max_length=15, choices=STATUS_CHOICES, default="Pending")
    
    def save(self, *args, **kwargs):
        if not self.expiry_date:

            if self.package_type == "BASIC":
                self.expiry_date = timezone.now() + timedelta(days=60)

            elif self.package_type == "PREMIUM":
                self.expiry_date = timezone.now() + timedelta(days=180)

            elif self.package_type == "VIP":
                self.expiry_date = timezone.now() + timedelta(days=365)

        super().save(*args, **kwargs)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user_record', 'transaction_id'],
                name='unique_identity'
            )
        ]

    def __str__(self):
        return f"{self.user_record} -> {self.transaction_id}"