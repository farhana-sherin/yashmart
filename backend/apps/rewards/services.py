from decimal import Decimal
from django.db import transaction, models
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError
from .models import RewardTransaction
from apps.customers.models import Customer
from apps.settings_app.models import SystemSettings
import logging

logger = logging.getLogger(__name__)

class RewardService:
    
    @staticmethod
    @transaction.atomic
    def add_points(customer_id: str, points: int, remarks: str = "", user=None) -> RewardTransaction:
        if points <= 0:
            raise ValidationError("Points must be greater than zero.")
            
        try:
            customer = Customer.objects.select_for_update().get(id=customer_id)
        except Customer.DoesNotExist:
            raise ValidationError("Customer not found.")
            
        customer.add_points(points)
        
        return RewardTransaction.objects.create(
            customer=customer,
            transaction_type='POINT_ADD',
            points=points,
            remarks=remarks,
            created_by=user
        )

    @staticmethod
    @transaction.atomic
    def add_balance(customer_id: str, amount: Decimal, remarks: str = "", user=None) -> RewardTransaction:
        if amount <= 0:
            raise ValidationError("Amount must be greater than zero.")
            
        try:
            customer = Customer.objects.select_for_update().get(id=customer_id)
        except Customer.DoesNotExist:
            raise ValidationError("Customer not found.")
            
        customer.add_balance(amount)
        
        return RewardTransaction.objects.create(
            customer=customer,
            transaction_type='BALANCE_ADD',
            balance=amount,
            remarks=remarks,
            created_by=user
        )

    @staticmethod
    @transaction.atomic
    def convert_balance_to_points(customer_id: str, remarks: str = "", user=None) -> RewardTransaction:
        try:
            customer = Customer.objects.select_for_update().get(id=customer_id)
        except Customer.DoesNotExist:
            raise ValidationError("Customer not found.")
            
        settings = SystemSettings.load()
        
        try:
            result = customer.convert_balance_to_points(conversion_settings=settings)
        except ValueError as e:
            raise ValidationError(str(e))
        
        return RewardTransaction.objects.create(
            customer=customer,
            transaction_type='CONVERT',
            points=result['added_points'],
            balance=result['deducted_amount'],
            remarks=remarks,
            created_by=user
        )

    @staticmethod
    def get_customer_reward_summary(customer_id: str) -> dict:
        try:
            customer = Customer.objects.get(id=customer_id)
        except Customer.DoesNotExist:
            raise ValidationError("Customer not found.")
            
        return {
            'total_points': customer.total_points,
            'pending_balance': customer.pending_balance,
            'loyalty_id': customer.loyalty_id,
        }

    @staticmethod
    def get_reward_statistics() -> dict:
        from django.db.models import Sum, Count
        stats = RewardTransaction.objects.aggregate(
            total_points_awarded=Sum('points', filter=models.Q(transaction_type='POINT_ADD')),
            total_balance_awarded=Sum('balance', filter=models.Q(transaction_type='BALANCE_ADD')),
            total_points_converted=Sum('points', filter=models.Q(transaction_type='CONVERT')),
            total_transactions=Count('id')
        )
        return {
            'total_points_awarded': stats['total_points_awarded'] or 0,
            'total_balance_awarded': stats['total_balance_awarded'] or Decimal('0.00'),
            'total_points_converted': stats['total_points_converted'] or 0,
            'total_transactions': stats['total_transactions'] or 0
        }

    @staticmethod
    def validate_conversion(customer_id: str) -> bool:
        settings = SystemSettings.load()
        if not settings.reward_enabled:
            return False
            
        try:
            customer = Customer.objects.get(id=customer_id)
            return customer.pending_balance >= settings.point_conversion_rate
        except Customer.DoesNotExist:
            return False

    @staticmethod
    def get_conversion_rate() -> dict:
        settings = SystemSettings.load()
        return {
            'rate': settings.point_conversion_rate,
            'enabled': settings.reward_enabled,
        }
