from rest_framework import views, status
from drf_yasg.utils import swagger_auto_schema
from .serializers import SystemSettingsSerializer
from .services import SettingsService
from apps.common.responses import success_response, error_response
from apps.customers.permissions import IsAdminUser

class SystemSettingsView(views.APIView):
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH']:
            return [IsAdminUser()]
        return []

    @swagger_auto_schema(responses={200: SystemSettingsSerializer()})
    def get(self, request, *args, **kwargs):
        settings = SettingsService.get_settings()
        serializer = SystemSettingsSerializer(settings)
        return success_response(data=serializer.data, message="Settings retrieved successfully.")

    @swagger_auto_schema(request_body=SystemSettingsSerializer, responses={200: SystemSettingsSerializer()})
    def put(self, request, *args, **kwargs):
        serializer = SystemSettingsSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            settings = SettingsService.update_settings(serializer.validated_data)
            return success_response(data=SystemSettingsSerializer(settings).data, message="Settings updated successfully.")
        return error_response(errors=serializer.errors, message="Failed to update settings.", status_code=status.HTTP_400_BAD_REQUEST)
