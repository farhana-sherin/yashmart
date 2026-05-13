from django.db import models
from django.conf import settings
from apps.common.models import BaseModel
from apps.customers.models import Customer
from apps.rewards.utils import generate_reference_id
from apps.rewards.validators import validate_positive_amount
from django.core.exceptions import ValidationError
from decimal import Decimal

class RewardTransaction(BaseModel):
    TRANSACTION_TYPES = (
        ('POINT_ADD', 'Add Points'),
        ('BALANCE_ADD', 'Add Balance'),
        ('CONVERT', 'Convert Balance to Points'),
    )

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name="reward_transactions",
        db_index=True
    )
    transaction_type = models.CharField(
        max_length=20,
        choices=TRANSACTION_TYPES,
        db_index=True
    )
    points = models.IntegerField(default=0)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    remarks = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_transactions"
    )
    reference_id = models.CharField(
        max_length=50,
        unique=True,
        blank=True,
        db_index=True
    )

    class Meta:
        verbose_name = "Reward Transaction"
        verbose_name_plural = "Reward Transactions"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['customer', 'transaction_type']),
            models.Index(fields=['created_at']),
        ]

    def save(self, *args, **kwargs):
        if not self.reference_id:
            self.reference_id = generate_reference_id()
            while RewardTransaction.objects.filter(reference_id=self.reference_id).exists():
                self.reference_id = generate_reference_id()
        super().save(*args, **kwargs)

    def clean(self):
        super().clean()
        if self.transaction_type == 'POINT_ADD' and self.points <= 0:
            raise ValidationError("Points must be greater than zero for POINT_ADD transaction.")
        if self.transaction_type == 'BALANCE_ADD' and self.balance <= 0:
            raise ValidationError("Balance must be greater than zero for BALANCE_ADD transaction.")

    def __str__(self):
        return f"{self.reference_id} - {self.transaction_type} - {self.customer.loyalty_id}"
