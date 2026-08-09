from rest_framework.response import Response
from apps.identifications.models.entities import *
from rest_framework import status

class Documents:
    def _useridrecords(self, recordid: int) -> Response:
        try:
            records = UserIDRecords.objects.filter(record_id = recordid).exists()
            if records == False:
                return Response({"message": "Record instance already created!"}, status=status.HTTP_400_BAD_REQUEST)
            userrecord = UserIDRecords.objects.create(record_id = recordid)
            return Response({"message": "New Record Id created!", "payload": {""}})
        except Exception as e:
            return Response({"Message": "Something went wrong!", "Exception": str(e)}, status=status.HTTP_417_EXPECTATION_FAILED)
    
    
    def _createnewdocument(self, fullname: str, dateofbirth: str, permanentaddress: str, documenttype: str, frontside: str, backside: str, livepicture: str, status: str) -> Response:
        try:
            
            return Response({"Message": ""})
        except Exception as e:
            return Response({"Message": "Something went wrong!", "Exception": str(e)}, status=status.HTTP_417_EXPECTATION_FAILED)