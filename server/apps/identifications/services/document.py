from rest_framework.response import Response
from apps.identifications.models.entities import *

class Documents:
    def _useridrecords(self, recordid: int) -> Response:
        return
    
    def _createnewdocument(self, fullname: str, dateofbirth: str, permanentaddress: str, documenttype: str, frontside: str, backside: str, livepicture: str, status: str) -> Response:
        try:
            
            return Response({"Message": ""})
        except Exception as e:
            return Response({"Message": "Something went wrong!", "Exception": str(e)}, status=status.HTTP_417_EXPECTATION_FAILED)