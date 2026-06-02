from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import Attendance
from .utils import attendance_status_helper

User = get_user_model()


class AttendanceSerializer(serializers.ModelSerializer):
    staff_name = serializers.CharField(source='staff.get_full_name', read_only=True)
    status_label = serializers.SerializerMethodField()
    check_in_time = serializers.SerializerMethodField()
    check_out_time = serializers.SerializerMethodField()
    total_hours = serializers.DecimalField(source='working_hours', max_digits=5, decimal_places=2, read_only=True)

    class Meta:
        model = Attendance
        fields = [
            'id', 'staff', 'staff_name', 'date', 'check_in', 'check_out',
            'check_in_time', 'check_out_time', 'total_hours',
            'status', 'status_label', 'working_hours', 'late_minutes',
            'is_verified', 'latitude', 'longitude', 'notes', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'staff', 'is_verified', 'working_hours', 'late_minutes']

    def get_status_label(self, obj):
        return attendance_status_helper(obj.status)

    def get_check_in_time(self, obj):
        if obj.check_in:
            try:
                local_time = timezone.localtime(obj.check_in)
                return local_time.strftime("%I:%M %p")
            except Exception:
                return obj.check_in.strftime("%H:%M:%S")
        return "-"

    def get_check_out_time(self, obj):
        if obj.check_out:
            try:
                local_time = timezone.localtime(obj.check_out)
                return local_time.strftime("%I:%M %p")
            except Exception:
                return obj.check_out.strftime("%H:%M:%S")
        return "-"


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
    staff_name = serializers.CharField(source='staff.get_full_name', read_only=True)
    check_in_time = serializers.SerializerMethodField()
    check_out_time = serializers.SerializerMethodField()
    total_hours = serializers.DecimalField(source='working_hours', max_digits=5, decimal_places=2, read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'date', 'check_in', 'check_out', 'check_in_time', 'check_out_time', 'status', 'working_hours', 'total_hours', 'staff_name']

    def get_check_in_time(self, obj):
        if obj.check_in:
            try:
                local_time = timezone.localtime(obj.check_in)
                return local_time.strftime("%I:%M %p")
            except Exception:
                return obj.check_in.strftime("%H:%M:%S")
        return "-"

    def get_check_out_time(self, obj):
        if obj.check_out:
            try:
                local_time = timezone.localtime(obj.check_out)
                return local_time.strftime("%I:%M %p")
            except Exception:
                return obj.check_out.strftime("%H:%M:%S")
        return "-"


class AttendanceAdminSerializer(serializers.ModelSerializer):
    staff_email = serializers.EmailField(source='staff.email', read_only=True)

    class Meta:
        model = Attendance
        fields = '__all__'