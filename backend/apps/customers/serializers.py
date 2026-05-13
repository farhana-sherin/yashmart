from rest_framework import serializers
from .models import Customer
from apps.accounts.models import User

class UserBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'phone', 'role']

class CustomerSerializer(serializers.ModelSerializer):
    user = UserBriefSerializer(read_only=True)
    
    class Meta:
        model = Customer
        fields = [
            'id', 'user', 'phone', 'address', 'total_points', 
            'pending_balance', 'joined_at', 'loyalty_id', 
            'notes', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'total_points', 'pending_balance', 'joined_at', 
            'loyalty_id', 'is_active', 'created_at', 'updated_at'
        ]

class CustomerCreateSerializer(serializers.ModelSerializer):
    user_id = serializers.UUIDField(write_only=True)
    
    class Meta:
        model = Customer
        fields = ['user_id', 'phone', 'address', 'notes']

    def validate_user_id(self, value):
        if not User.objects.filter(id=value).exists():
            raise serializers.ValidationError("User does not exist.")
        if Customer.objects.filter(user_id=value).exists():
            raise serializers.ValidationError("Customer profile already exists for this user.")
        return value
        
    def create(self, validated_data):
        user_id = validated_data.pop('user_id')
        user = User.objects.get(id=user_id)
        return Customer.objects.create(user=user, **validated_data)

class CustomerUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['phone', 'address', 'notes', 'is_active']

class CustomerDetailSerializer(CustomerSerializer):
    recent_transactions = serializers.SerializerMethodField()

    class Meta(CustomerSerializer.Meta):
        fields = CustomerSerializer.Meta.fields + ['recent_transactions']

    def get_recent_transactions(self, obj):
        from apps.rewards.serializers import RewardTransactionSerializer
        transactions = obj.reward_transactions.all()[:5]
        return RewardTransactionSerializer(transactions, many=True).data
