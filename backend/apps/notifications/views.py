from rest_framework import views, generics, permissions, status
from drf_yasg.utils import swagger_auto_schema
from .models import Notification
from .serializers import NotificationSerializer
from .services import NotificationService
from apps.common.responses import success_response, error_response
from apps.common.pagination import StandardResultsSetPagination

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return success_response(data=response.data, message="Notifications retrieved successfully.")

class MarkNotificationReadView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(responses={200: NotificationSerializer()})
    def put(self, request, pk, *args, **kwargs):
        notification = NotificationService.mark_notification_read(pk, request.user)
        if notification:
            serializer = NotificationSerializer(notification)
            return success_response(data=serializer.data, message="Notification marked as read.")
        return error_response(message="Notification not found.", status_code=status.HTTP_404_NOT_FOUND)
