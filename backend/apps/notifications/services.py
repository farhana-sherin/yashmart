from .models import Notification
from apps.customers.models import Customer
import logging

logger = logging.getLogger(__name__)

class NotificationService:
    @staticmethod
    def send_offer_notification(user, title, message):
        return Notification.objects.create(
            user=user,
            title=title,
            message=message,
            notification_type='OFFER'
        )

    @staticmethod
    def send_reward_notification(user, title, message):
        return Notification.objects.create(
            user=user,
            title=title,
            message=message,
            notification_type='REWARD'
        )

    @staticmethod
    def send_attendance_alert(user, title, message):
        return Notification.objects.create(
            user=user,
            title=title,
            message=message,
            notification_type='ATTENDANCE'
        )

    @staticmethod
    def mark_notification_read(notification_id, user):
        try:
            notification = Notification.objects.get(id=notification_id, user=user)
            notification.is_read = True
            notification.save(update_fields=['is_read', 'updated_at'])
            return notification
        except Notification.DoesNotExist:
            return None
