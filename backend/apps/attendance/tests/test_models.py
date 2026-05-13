from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from apps.attendance.models import Attendance
from datetime import timedelta

User = get_user_model()


class AttendanceModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@yashmart.com",
            password="password123"
        )

    def test_attendance_creation(self):
        attendance = Attendance.objects.create(
            staff=self.user,
            date=timezone.now().date(),
            check_in=timezone.now()
        )
        self.assertEqual(attendance.status, 'PRESENT')
        self.assertIsNone(attendance.check_out)

    def test_working_hours_calculation(self):
        check_in = timezone.now() - timedelta(hours=8)
        check_out = timezone.now()
        attendance = Attendance.objects.create(
            staff=self.user,
            date=timezone.now().date(),
            check_in=check_in,
            check_out=check_out
        )
        self.assertAlmostEqual(float(attendance.working_hours), 8.0, places=1)
