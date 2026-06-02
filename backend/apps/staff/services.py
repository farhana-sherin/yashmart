from django.db.models import Q
from apps.attendance.models import Attendance
from django.utils import timezone

class StaffService:
    @staticmethod
    def get_staff_attendance(user, date_from=None, date_to=None):
        queryset = Attendance.objects.filter(staff=user)
        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)
        return queryset.order_by('-date', '-check_in')

    @staticmethod
    def get_staff_statistics(user):
        from apps.attendance.services import AttendanceService
        return AttendanceService.get_attendance_statistics(user=user)
