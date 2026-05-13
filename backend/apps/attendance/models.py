from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.utils import timezone
from apps.common.models import BaseModel
from .constants import ATTENDANCE_STATUS

User = get_user_model()


class Attendance(BaseModel):
    """
    Model to store daily attendance records of staff.
    """
    staff = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='attendances'
    )
    date = models.DateField(default=timezone.now)
    check_in = models.DateTimeField(null=True, blank=True)
    check_out = models.DateTimeField(null=True, blank=True)
    
    # Location tracking
    latitude = models.DecimalField(
        max_length=50,
        blank=True,
        null=True,
        max_digits=9,
        decimal_places=6
    )
    longitude = models.DecimalField(
        max_length=50,
        blank=True,
        null=True,
        max_digits=9,
        decimal_places=6
    )
    is_verified = models.BooleanField(default=False)
    
    # Status and calculation
    status = models.CharField(
        max_length=20,
        choices=ATTENDANCE_STATUS,
        default='PRESENT'
    )
    working_hours = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0.00
    )
    late_minutes = models.IntegerField(default=0)
    
    # Metadata
    notes = models.TextField(blank=True, null=True)
    qr_token = models.CharField(max_length=255, blank=True, null=True)
    device_info = models.JSONField(blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)

    class Meta:
        db_table = 'attendance'
        ordering = ['-date', '-check_in']
        unique_together = ['staff', 'date']
        indexes = [
            models.Index(fields=['staff', 'date']),
            models.Index(fields=['status']),
            models.Index(fields=['date']),
        ]

    def __str__(self):
        return f"{self.staff.email} - {self.date}"

    def mark_late(self, late_minutes: int):
        """Marks the attendance as late if criteria met."""
        self.late_minutes = late_minutes
        if late_minutes > 0:
            self.status = 'LATE'
        self.save(update_fields=['late_minutes', 'status'])

    def calculate_working_hours(self):
        """Calculates total working hours between check-in and check-out."""
        if self.check_in and self.check_out:
            duration = self.check_out - self.check_in
            hours = duration.total_seconds() / 3600
            self.working_hours = round(hours, 2)
            return self.working_hours
        return 0.00

    def can_checkout(self) -> bool:
        """Checks if the user can check out."""
        return self.check_in is not None and self.check_out is None

    def clean(self):
        """Custom validation for the model."""
        if self.check_out and self.check_in and self.check_out <= self.check_in:
            raise ValidationError("Check-out time must be after check-in time.")
        
    def save(self, *args, **kwargs):
        self.clean()
        if self.check_in and self.check_out:
            self.calculate_working_hours()
        super().save(*args, **kwargs)
