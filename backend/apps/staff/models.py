from django.db import models
from django.conf import settings
from apps.common.models import BaseModel
from django.core.validators import RegexValidator
import random

class Staff(BaseModel):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="staff_profile"
    )
    employee_id = models.CharField(
        max_length=20,
        unique=True,
        db_index=True,
        blank=True
    )
    department = models.CharField(max_length=100, blank=True, null=True)
    designation = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(
        max_length=15,
        blank=True,
        null=True,
        validators=[RegexValidator(r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")]
    )
    joining_date = models.DateField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'staff_profiles'
        verbose_name = "Staff Profile"
        verbose_name_plural = "Staff Profiles"
        ordering = ['-joining_date', '-created_at']

    def save(self, *args, **kwargs):
        if not self.employee_id:
            # Generate a unique employee ID
            self.employee_id = f"EMP-{random.randint(10000, 99999)}"
            while Staff.objects.filter(employee_id=self.employee_id).exists():
                self.employee_id = f"EMP-{random.randint(10000, 99999)}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.email} - {self.employee_id}"
