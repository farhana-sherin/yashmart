from django.db import models
from django.conf import settings
from apps.common.models import BaseModel
from apps.settings_app.models import SystemSettings
from apps.customers.utils import generate_loyalty_id
from apps.customers.validators import validate_phone, validate_non_negative
from django.core.exceptions import ValidationError
from decimal import Decimal

class Customer(BaseModel):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="customer_profile"
    )
    phone = models.CharField(
        max_length=15, 
        blank=True, 
        null=True,
        validators=[validate_phone]
    )
    address = models.TextField(blank=True, null=True)
    total_points = models.IntegerField(
        default=0,
        validators=[validate_non_negative]
    )
    pending_balance = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[validate_non_negative]
    )
    joined_at = models.DateTimeField(auto_now_add=True)
    loyalty_id = models.CharField(
        max_length=20,
        unique=True,
        blank=True,
        db_index=True
    )
    notes = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Customer"
        verbose_name_plural = "Customers"
        ordering = ['-joined_at']

    def save(self, *args, **kwargs):
        if not self.loyalty_id:
            self.loyalty_id = generate_loyalty_id()
            # Ensure unique loyalty_id
            while Customer.objects.filter(loyalty_id=self.loyalty_id).exists():
                self.loyalty_id = generate_loyalty_id()
        super().save(*args, **kwargs)

    def clean(self):
        super().clean()
        if self.total_points < 0:
            raise ValidationError({'total_points': "Points cannot be negative."})
        if self.pending_balance < 0:
            raise ValidationError({'pending_balance': "Balance cannot be negative."})

    def __str__(self):
        return f"{self.user.email} - {self.loyalty_id}"

    def add_points(self, points: int):
        if points <= 0:
            raise ValueError("Points to add must be greater than zero.")
        self.total_points += points
        self.save(update_fields=['total_points', 'updated_at'])
        return self.total_points

    def add_balance(self, amount: Decimal):
        if amount <= 0:
            raise ValueError("Amount to add must be greater than zero.")
        self.pending_balance += amount
        self.save(update_fields=['pending_balance', 'updated_at'])
        return self.pending_balance

    def deduct_balance(self, amount: Decimal):
        if amount <= 0:
            raise ValueError("Amount to deduct must be greater than zero.")
        if self.pending_balance < amount:
            raise ValueError("Insufficient pending balance.")
        self.pending_balance -= amount
        self.save(update_fields=['pending_balance', 'updated_at'])
        return self.pending_balance

    def convert_balance_to_points(self, conversion_settings=None):
        if not conversion_settings:
            conversion_settings = SystemSettings.load()
            
        if not conversion_settings.reward_enabled:
            raise ValueError("Reward system is currently disabled.")

        convert_rate = conversion_settings.point_conversion_rate

        if self.pending_balance < convert_rate:
            raise ValueError(f"Minimum balance required for conversion is {convert_rate}.")

        # E.g. rate = 10 (10 rs = 1 point). Balance = 25. Points = 25 // 10 = 2. Deduct 20.
        points_to_add = int(self.pending_balance // convert_rate)
        amount_to_deduct = Decimal(points_to_add) * convert_rate

        self.deduct_balance(amount_to_deduct)
        self.add_points(points_to_add)

        return {
            'deducted_amount': amount_to_deduct,
            'added_points': points_to_add
        }
