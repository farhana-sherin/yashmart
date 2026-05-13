from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Attendance
from .utils import attendance_status_helper

User = get_user_model()


class AttendanceSerializer(serializers.ModelSerializer):
    staff_name = serializers.CharField(source='staff.get_full_name', read_only=True)
    status_label = serializers.SerializerMethodField()

    class Meta:
        model = Attendance
        fields = [
            'id', 'staff', 'staff_name', 'date', 'check_in', 'check_out',
            'status', 'status_label', 'working_hours', 'late_minutes',
            'is_verified', 'latitude', 'longitude', 'notes', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'staff', 'is_verified', 'working_hours', 'late_minutes']

    def get_status_label(self, obj):
        return attendance_status_helper(obj.status)


class CheckInSerializer(serializers.Serializer):
    latitude = serializers.DecimalField(max_digits=9, decimal_places=6, required=True)
    longitude = serializers.DecimalField(max_digits=9, decimal_places=6, required=True)
    qr_token = serializers.CharField(required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)

    def validate_latitude(self, value):
        if not (-90 <= value <= 90):
            raise serializers.ValidationError("Invalid latitude.")
        return value

    def validate_longitude(self, value):
        if not (-180 <= value <= 180):
            raise serializers.ValidationError("Invalid longitude.")
        return value


class CheckOutSerializer(serializers.Serializer):
    latitude = serializers.DecimalField(max_digits=9, decimal_places=6, required=True)
    longitude = serializers.DecimalField(max_digits=9, decimal_places=6, required=True)


class AttendanceHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ['id', 'date', 'check_in', 'check_out', 'status', 'working_hours']


class AttendanceAdminSerializer(serializers.ModelSerializer):
    staff_email = serializers.EmailField(source='staff.email', read_only=True)

    class Meta:
        model = Attendance
        fields = '__all__'