from django.urls import path
from .views import (
    CheckInView,
    CheckOutView,
    AttendanceHistoryView,
    TodayAttendanceView,
    AttendanceStatisticsView,
    QRGenerateView,
    StaffAttendanceDetailView,
    MonthlyReportView
)

app_name = 'attendance'

urlpatterns = [
    # Staff Endpoints
    path('check-in/', CheckInView.as_view(), name='check-in'),
    path('check-out/', CheckOutView.as_view(), name='check-out'),
    path('history/', AttendanceHistoryView.as_view(), name='history'),
    path('today/', TodayAttendanceView.as_view(), name='today-attendance'),
    path('statistics/', AttendanceStatisticsView.as_view(), name='statistics'),
    
    # Admin Endpoints
    path('qr-generate/', QRGenerateView.as_view(), name='qr-generate'),
    path('staff/<uuid:staff_id>/', StaffAttendanceDetailView.as_view(), name='staff-detail'),
    path('monthly-report/', MonthlyReportView.as_view(), name='monthly-report'),
]