from django.db import models
from django.conf import settings
from apps.common.models import TimeStampedModel

class Notification(TimeStampedModel):
    NOTIFICATION_TYPES = (
        ('OFFER', 'Offer'),
        ('REWARD', 'Reward'),
        ('ATTENDANCE', 'Attendance'),
        ('SYSTEM', 'System'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name="notifications"
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES, default='SYSTEM')
    is_read = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.title}"
