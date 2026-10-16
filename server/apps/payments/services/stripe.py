from apps.payments.api.serializers import SubscriptionPackageSerializers
from rest_framework.views import APIView
from env_config import Config
from rest_framework.permissions import IsAuthenticated, AllowAny
from ..models.entities import SubscriptionPackage
from rest_framework.response import Response
import stripe

stripe.api_key = Config.STRIPE_SECRET_KEY

class StripePayment():
    def createpayment(self, request):
        try:
            paid = SubscriptionPackageSerializers(data=request.data)
            paid.is_valid(raise_exception=True)
            userrecord = request.user.paymentdetail
            packagetype = paid.validated_data["package_type"]
            transactionid = paid.validated_data["transaction_id"]
            packageamount = paid.validated_data["package_amount"]
            paidvia = paid.validated_data["paid_via"]
            paymentstatus = paid.validated_data["payment_status"]
            packagestatus = paid.validated_data["package_status"]

            checkout_url = None


            stripe_methods = {"visa", "mastercard", "master card", "american express"}
            if str(paidvia).strip().lower() in stripe_methods and Config.STRIPE_SECRET_KEY and "paste your" not in str(Config.STRIPE_SECRET_KEY):
                lineitem = [
                    {
                        "quantity": 1,
                        "price_data": {
                            "currency": "usd",
                            "unit_amount": int(packageamount * 100),
                            "product_data": {
                                "name": f"LamiSewa {packagetype}",
                                "description":
                                    f"Transaction ID: {transactionid}, Package: {packagetype}, Amount: {packageamount}",
                            },
                        },
                    }
                ]
                checkout_session = stripe.checkout.Session.create(
                    line_items=lineitem,
                    mode='payment',
                    success_url="lamisewa://payment-success?session_id={CHECKOUT_SESSION_ID}",
                    cancel_url="lamisewa://payment-cancelled",
                )
                checkout_url = checkout_session.url

            pay, _ = SubscriptionPackage.objects.update_or_create(
                user_record=userrecord,
                transaction_id=transactionid,
                defaults={
                    "package_type": packagetype,
                    "package_amount": packageamount,
                    "paid_via": paidvia,
                    "payment_status": paymentstatus,
                    "package_status": packagestatus,
                },
            )

            body = {"message": "Payment Created.", "Buyer's Detail": {
                "Package Type": pay.package_type,
                "Package Amount": pay.package_amount,
                "Paid Via": pay.paid_via,
                }, "URL": checkout_url}
            return Response(body)

        except Exception as e:
            return Response({"Message": "Exception Occured!", "Issue": str(e)})

    def subscription_status(self, request):
        from django.utils import timezone

        try:
            record = request.user.paymentdetail
        except Exception:
            return Response({"is_subscribed": False, "message": "No payment record."})
        active = SubscriptionPackage.objects.filter(
            user_record=record,
            package_status__in=["Completed", "Verified", "Active"],
            expiry_date__gt=timezone.now(),
        ).order_by("-expiry_date").first()
        if not active:
            return Response({"is_subscribed": False})
        return Response({
            "is_subscribed": True,
            "package_type": active.package_type,
            "expiry_date": active.expiry_date,
        })
