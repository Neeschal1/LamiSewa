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
            
            lineitem = [
                {
                    "quantity": 1,
                    "price_data": {
                        "currency": "usd",
                        "unit_amount": int(packageamount * 100),
                        "product_data": {
                            "name": packagetype,
                            "description": 
                                f"""
                                    Transaction ID: {transactionid},
                                    Package Type: {packagetype},
                                    Package Amount: {packageamount},
                                    Package Status: {packagestatus},
                                    Paid Via: {paidvia},
                                    Payment Status: {paymentstatus},
                                """,
                        },
                    },
                }
            ]
            
            checkout_session = stripe.checkout.Session.create(
                line_items=lineitem,
                mode='payment',
                success_url="https://www.pinterest.com/pin/316729786314156192/",
                cancel_url="https://www.pinterest.com/pin/1125968651884142/"
            )
            
            pay = SubscriptionPackage.objects.create(
                package_type = packagetype,
                transaction_id = transactionid,
                package_amount = packageamount,
                paid_via = paidvia,
                payment_status = paymentstatus,
                package_status = packagestatus,
                user_record = userrecord
            )

            return Response({"message":"Payment Created.", "Buyer's Detail": {
                # "Buyer's Data:": pay.user_record.payment_id,
                "Package Type": pay.package_type,
                "Package Amount": pay.package_amount,
                "Paid Via": pay.paid_via,
                }, "URL":checkout_session.url})
            
        except Exception as e:
            return Response({"Message":"Exception Occured!", "Issue":str(e)})
        
