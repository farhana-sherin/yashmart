from django.conf import settings

# Office Location (Latitude, Longitude)
# Default is Thrissur, Kerala (for demonstration)
OFFICE_LOCATION = getattr(settings, 'ATTENDANCE_OFFICE_LOCATION', (10.5276, 76.2144))

# Maximum allowed distance from office in meters
MAX_DISTANCE = getattr(settings, 'ATTENDANCE_MAX_DISTANCE', 100)

# QR Code expiry time in minutes
QR_EXPIRY_MINUTES = getattr(settings, 'ATTENDANCE_QR_EXPIRY_MINUTES', 5)

# Office working hours start time (HH:MM)
OFFICE_START_TIME = getattr(settings, 'ATTENDANCE_OFFICE_START_TIME', "09:00")

# Grace period for late attendance in minutes
LATE_AFTER_MINUTES = getattr(settings, 'ATTENDANCE_LATE_AFTER_MINUTES', 15)

# Status choices
ATTENDANCE_STATUS = (
    ('PRESENT', 'Present'),
    ('LATE', 'Late'),
    ('ABSENT', 'Absent'),
    ('HALFDAY', 'Half Day'),
)