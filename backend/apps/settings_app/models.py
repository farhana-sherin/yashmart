from django.db import models
from apps.common.models import TimeStampedModel

class SystemSettings(TimeStampedModel):
    """
    Singleton model for system-wide configuration settings.
    """
    company_name = models.CharField(max_length=255, default="YasMart Supermarket")
    company_email = models.EmailField(default="info@yasmart.local")
    company_phone = models.CharField(max_length=20, default="+1234567890")
    company_address = models.TextField(default="Main Street, City")
    
    point_conversion_rate = models.DecimalField(max_digits=10, decimal_places=2, default=10.00, help_text="Amount required for 1 point")
    attendance_radius = models.IntegerField(default=50, help_text="Allowed radius in meters for attendance")
    qr_expiry_minutes = models.IntegerField(default=5, help_text="QR code expiry duration in minutes")
    
    reward_enabled = models.BooleanField(default=True)
    offer_notifications_enabled = models.BooleanField(default=True)
    maintenance_mode = models.BooleanField(default=False)

    class Meta:
        verbose_name = "System Settings"
        verbose_name_plural = "System Settings"

    def save(self, *args, **kwargs):
        self.pk = 1
        super(SystemSettings, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return "System Settings"
