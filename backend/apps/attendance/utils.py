import secrets
import string
from django.utils import timezone
from datetime import datetime


def get_client_ip(request):
    """
    Extracts the client IP address from the request object.
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def get_device_info(request):
    """
    Extracts basic device info from the User-Agent header.
    """
    return {
        "user_agent": request.META.get('HTTP_USER_AGENT', 'unknown'),
        "remote_host": request.META.get('REMOTE_HOST', 'unknown'),
    }


def generate_secure_token(length=32):
    """
    Generates a secure random token.
    """
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def attendance_status_helper(status):
    """
    Returns a human-readable status label.
    """
    status_map = {
        'PRESENT': 'Present',
        'LATE': 'Late',
        'ABSENT': 'Absent',
        'HALFDAY': 'Half Day',
    }
    return status_map.get(status, status)


def parse_time(time_str):
    """
    Parses a time string (HH:MM) into a time object.
    """
    return datetime.strptime(time_str, "%H:%M").time()


def get_today_range():
    """
    Returns the start and end of the current day.
    """
    today = timezone.now().date()
    start = timezone.make_aware(datetime.combine(today, datetime.min.time()))
    end = timezone.make_aware(datetime.combine(today, datetime.max.time()))
    return start, end