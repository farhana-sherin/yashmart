from rest_framework import serializers
from django.utils import timezone
from .models import Staff
from apps.accounts.models import User
from apps.attendance.models import Attendance

class UserBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'first_name', 'last_name', 'phone', 'role']

class StaffSerializer(serializers.ModelSerializer):
    user = UserBriefSerializer(read_only=True)
    full_name = serializers.CharField(source='user.name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    today_attendance = serializers.SerializerMethodField()

    class Meta:
        model = Staff
        fields = [
            'id', 'user', 'full_name', 'email', 'employee_id', 'department', 
            'designation', 'phone', 'joining_date', 'is_active', 'notes',
            'today_attendance', 'created_at', 'updated_at'
        ]
        read_only_fields = ['employee_id', 'created_at', 'updated_at']

    def get_today_attendance(self, obj):
        today = timezone.localtime(timezone.now()).date()
        att = Attendance.objects.filter(staff=obj.user, date=today).first()
        if att:
            return {
                'status': att.status,
                'check_in': timezone.localtime(att.check_in).strftime("%I:%M %p") if att.check_in else "-",
                'check_out': timezone.localtime(att.check_out).strftime("%I:%M %p") if att.check_out else "-",
                'working_hours': str(att.working_hours) if att.working_hours else "0.00"
            }
        return {
            'status': 'ABSENT',
            'check_in': '-',
            'check_out': '-',
            'working_hours': '0.00'
        }

class StaffCreateSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, required=False)
    phone = serializers.CharField(required=False, allow_blank=True)
    department = serializers.CharField(required=False, allow_blank=True)
    designation = serializers.CharField(required=False, allow_blank=True)
    joining_date = serializers.DateField(required=False)
    notes = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Staff
        fields = ['full_name', 'email', 'password', 'phone', 'department', 'designation', 'joining_date', 'notes']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        full_name = validated_data.pop('full_name')
        email = validated_data.pop('email')
        password = validated_data.pop('password', 'Staff@123')
        phone = validated_data.get('phone')

        # 1. Create User
        user = User.objects.create_user(
            email=email,
            password=password,
            name=full_name,
            phone=phone,
            role='STAFF',
            is_active=True,
            is_verified=True
        )

        # 2. Update or Create Staff Profile
        staff, created = Staff.objects.update_or_create(
            user=user,
            defaults={
                'phone': phone,
                'department': validated_data.get('department'),
                'designation': validated_data.get('designation'),
                'joining_date': validated_data.get('joining_date'),
                'notes': validated_data.get('notes'),
                'is_active': True
            }
        )
        return staff

class StaffUpdateSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(write_only=True, required=False)
    email = serializers.EmailField(write_only=True, required=False)
    
    class Meta:
        model = Staff
        fields = ['full_name', 'email', 'phone', 'department', 'designation', 'joining_date', 'is_active', 'notes']

    def update(self, instance, validated_data):
        full_name = validated_data.pop('full_name', None)
        email = validated_data.pop('email', None)
        
        user = instance.user
        user_changed = False
        if full_name:
            user.name = full_name
            user_changed = True
        if email:
            user.email = email
            user_changed = True
        if user_changed:
            user.save()
            
        return super().update(instance, validated_data)

class StaffDetailSerializer(StaffSerializer):
    attendance_stats = serializers.SerializerMethodField()

    class Meta(StaffSerializer.Meta):
        fields = StaffSerializer.Meta.fields + ['attendance_stats']

    def get_attendance_stats(self, obj):
        from apps.attendance.services import AttendanceService
        return AttendanceService.get_attendance_statistics(user=obj.user)
