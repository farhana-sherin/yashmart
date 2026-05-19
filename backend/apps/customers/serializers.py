from rest_framework import serializers
from .models import Customer
from apps.accounts.models import User

class UserBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'phone', 'role']

class CustomerSerializer(serializers.ModelSerializer):
    user = UserBriefSerializer(read_only=True)
    full_name = serializers.CharField(source='user.name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = Customer
        fields = [
            'id', 'user', 'full_name', 'email', 'phone', 'address', 
            'total_points', 'pending_balance', 'joined_at', 'loyalty_id', 
            'notes', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'total_points', 'pending_balance', 'joined_at', 
            'loyalty_id', 'is_active', 'created_at', 'updated_at'
        ]

class CustomerCreateSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = Customer
        fields = ['full_name', 'email', 'phone', 'address', 'notes']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
        
    def create(self, validated_data):
        full_name = validated_data.pop('full_name')
        email = validated_data.pop('email')
        phone = validated_data.get('phone')
        
        # 1. Create User
        user = User.objects.create_user(
            email=email,
            password='Customer@123', # Default password
            name=full_name,
            phone=phone,
            role='CUSTOMER',
            is_active=True,
            is_verified=True
        )
        
        # 2. Update or Create Customer Profile
        # Note: A signal might have already created a profile during User.objects.create_user
        customer, created = Customer.objects.update_or_create(
            user=user,
            defaults=validated_data
        )
        return customer

class CustomerUpdateSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Customer
        fields = ['full_name', 'phone', 'address', 'notes', 'is_active']

    def update(self, instance, validated_data):
        full_name = validated_data.pop('full_name', None)
        if full_name:
            user = instance.user
            user.name = full_name
            user.save(update_fields=['name'])
            
        return super().update(instance, validated_data)

class CustomerDetailSerializer(CustomerSerializer):
    recent_transactions = serializers.SerializerMethodField()

    class Meta(CustomerSerializer.Meta):
        fields = CustomerSerializer.Meta.fields + ['recent_transactions']

    def get_recent_transactions(self, obj):
        from apps.rewards.serializers import RewardTransactionSerializer
        transactions = obj.reward_transactions.all()[:5]
        return RewardTransactionSerializer(transactions, many=True).data
