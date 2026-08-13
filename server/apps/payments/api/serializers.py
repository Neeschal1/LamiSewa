from apps.payments.models.entities import *
from rest_framework import serializers

class UserPaymentRecordsSerializers(serializers.ModelSerializer):
    class Meta:
        model = UserPaymentRecords
        fields = '__all__'
    
class SubscriptionPackageSerializers(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPackage
        fields = ['user_record', 'package_type', 'transaction_id', 'package_amount', 'purchased_date', 'expiry_date', 'paid_via', 'payment_status', 'package_status']
        extra_kwargs = {
            'user_record': {'required': False, 'read_only': True},
            'package_type': {'required': True},
            'transaction_id': {'required': True},
            'package_amount': {'required': True},
            'purchased_date': {'required': False, 'read_only': True},
            'expiry_date': {'required': False, 'read_only': True},
            'paid_via': {'required': True},
            'payment_status': {'required': True},
            'package_status': {'required': True},
        }