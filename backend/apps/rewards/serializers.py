from rest_framework import serializers
from .models import RewardTransaction
from apps.customers.models import Customer
from apps.settings_app.models import SystemSettings

class RewardTransactionSerializer(serializers.ModelSerializer):
    customer_loyalty_id = serializers.CharField(source='customer.loyalty_id', read_only=True)
    created_by_email = serializers.CharField(source='created_by.email', read_only=True, allow_null=True)

    class Meta:
        model = RewardTransaction
        fields = [
            'id', 'reference_id', 'customer_loyalty_id', 'transaction_type', 
            'points', 'balance', 'remarks', 'created_by_email', 
            'created_at', 'is_active'
        ]
        read_only_fields = fields

class AddPointsSerializer(serializers.Serializer):
    customer_id = serializers.UUIDField()
    points = serializers.IntegerField(min_value=1)
    remarks = serializers.CharField(max_length=255, required=False, allow_blank=True)

    def validate_customer_id(self, value):
        if not Customer.objects.filter(id=value).exists():
            raise serializers.ValidationError("Customer does not exist.")
        return value

class AddBalanceSerializer(serializers.Serializer):
    customer_id = serializers.UUIDField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0.01)
    remarks = serializers.CharField(max_length=255, required=False, allow_blank=True)

    def validate_customer_id(self, value):
        if not Customer.objects.filter(id=value).exists():
            raise serializers.ValidationError("Customer does not exist.")
        return value

class ConvertBalanceSerializer(serializers.Serializer):
    customer_id = serializers.UUIDField()
    remarks = serializers.CharField(max_length=255, required=False, allow_blank=True)

    def validate(self, attrs):
        customer_id = attrs.get('customer_id')
        try:
            customer = Customer.objects.get(id=customer_id)
        except Customer.DoesNotExist:
            raise serializers.ValidationError({"customer_id": "Customer does not exist."})

        settings = SystemSettings.load()
        if not settings.reward_enabled:
            raise serializers.ValidationError("Reward system is currently disabled.")

        if customer.pending_balance < settings.point_conversion_rate:
            raise serializers.ValidationError({
                "balance": f"Insufficient balance. Minimum required is {settings.point_conversion_rate}."
            })
            
        return attrs

class RewardHistorySerializer(RewardTransactionSerializer):
    pass
