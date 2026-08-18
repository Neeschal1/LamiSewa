from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from apps.privacy.models.entities import *
from .serializers import *

class UserPrivacySerializersView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @swagger_auto_schema(request_body=UserPrivacySerializers)
    def create(self, request):
        try:
            UserPrivacy.objects.get_or_create(privacyid=request.user)
            return Response({"message": "users privacy record created."}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"Message":"Exception Occured!", "Issue":str(e)})