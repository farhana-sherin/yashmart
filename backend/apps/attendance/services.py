from django.db import transaction
from django.utils import timezone
from django.db.models import Count, Avg, Q
from datetime import datetime, time
from .models import Attendance
from .validators import validate_gps_coordinates
from .utils import get_client_ip, get_device_info, parse_time
from .constants import OFFICE_START_TIME, LATE_AFTER_MINUTES
from rest_framework.exceptions import ValidationError


class AttendanceService:
    @staticmethod
    def already_checked_in(user, date=None):
        if date is None:
            date = timezone.now().date()
        return Attendance.objects.filter(staff=user, date=date).exists()

    @staticmethod
    @transaction.atomic
    def perform_checkin(user, latitude, longitude, request, qr_token=None):
        # 1. Check if already checked in
        if AttendanceService.already_checked_in(user):
            raise ValidationError("You have already checked in for today.")

        # 2. Validate GPS
        is_valid_gps, distance = validate_gps_coordinates(latitude, longitude)
        if not is_valid_gps:
            raise ValidationError(f"You are too far from the office ({round(distance, 2)}m).")

        # 3. Detect Late
        late_minutes = AttendanceService.detect_late_attendance()
        status = 'LATE' if late_minutes > 0 else 'PRESENT'

        # 4. Create Attendance Record
        attendance = Attendance.objects.create(
            staff=user,
            date=timezone.now().date(),
            check_in=timezone.now(),
            latitude=latitude,
            longitude=longitude,
            is_verified=True,
            status=status,
            late_minutes=late_minutes,
            ip_address=get_client_ip(request),
            device_info=get_device_info(request),
            qr_token=qr_token
        )
        return attendance

    @staticmethod
    @transaction.atomic
    def perform_checkout(user, latitude, longitude):
        # 1. Get today's attendance
        try:
            attendance = Attendance.objects.get(
                staff=user, 
                date=timezone.now().date(),
                check_out__isnull=True
            )
        except Attendance.DoesNotExist:
            raise ValidationError("No active check-in found for today.")

        # 2. Validate GPS
        is_valid_gps, distance = validate_gps_coordinates(latitude, longitude)
        if not is_valid_gps:
            raise ValidationError(f"You are too far from the office ({round(distance, 2)}m).")

        # 3. Update Record
        attendance.check_out = timezone.now()
        attendance.save()
        return attendance

    @staticmethod
    def detect_late_attendance():
        now = timezone.now()
        start_time = parse_time(OFFICE_START_TIME)
        office_start_dt = timezone.make_aware(
            datetime.combine(now.date(), start_time)
        )
        
        if now > office_start_dt:
            diff = now - office_start_dt
            late_mins = int(diff.total_seconds() / 60)
            if late_mins > LATE_AFTER_MINUTES:
                return late_mins
        return 0

    @staticmethod
    def get_attendance_statistics(user=None, user_id=None):
        query = Q()
        if user:
            query &= Q(staff=user)
        elif user_id:
            query &= Q(staff_id=user_id)
        
        stats = Attendance.objects.filter(query).aggregate(
            total_days=Count('id'),
            late_count=Count('id', filter=Q(status='LATE')),
            avg_working_hours=Avg('working_hours')
        )
        
        # Today's stats
        today_present = Attendance.objects.filter(date=timezone.now().date()).count()
        
        return {
            "total_present": stats['total_days'] or 0,
            "total_late": stats['late_count'] or 0,
            "avg_working_hours": round(stats['avg_working_hours'] or 0, 2),
            "today_present_count": today_present
        }

    @staticmethod
    def get_monthly_report(month, year, staff_id=None):
        query = Q(date__month=month, date__year=year)
        if staff_id:
            query &= Q(staff_id=staff_id)
        
        return Attendance.objects.filter(query).select_related('staff')