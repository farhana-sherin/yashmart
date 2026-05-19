from rest_framework import status, views, generics, permissions, filters
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .models import Attendance
from .serializers import (
    AttendanceSerializer, CheckInSerializer, CheckOutSerializer,
    AttendanceHistorySerializer, AttendanceAdminSerializer
)
from .services import AttendanceService
from .permissions import IsAdminUser, IsAttendanceOwner
from .qr_utils import generate_attendance_qr_data, create_qr_image_base64


class StandardResponseMixin:
    def success_response(self, data=None, message="Success", status_code=status.HTTP_200_OK):
        return Response({
            "success": True,
            "message": message,
            "data": data
        }, status=status_code)

    def error_response(self, message="Error", errors=None, status_code=status.HTTP_400_BAD_REQUEST):
        return Response({
            "success": False,
            "message": message,
            "errors": errors or {}
        }, status=status_code)


class CheckInView(views.APIView, StandardResponseMixin):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        request_body=CheckInSerializer,
        responses={201: AttendanceSerializer, 400: 'Bad Request'}
    )
    def post(self, request):
        print(f"DEBUG: Check-In Request Data: {request.data}")
        serializer = CheckInSerializer(data=request.data)
        if serializer.is_valid():
            try:
                attendance = AttendanceService.perform_checkin(
                    user=request.user,
                    latitude=serializer.validated_data['latitude'],
                    longitude=serializer.validated_data['longitude'],
                    request=request,
                    qr_token=serializer.validated_data.get('qr_token'),
                )
                return self.success_response(
                    AttendanceSerializer(attendance).data,
                    message="Checked in successfully",
                    status_code=status.HTTP_201_CREATED
                )
            except ValidationError as e:
                return self.error_response(
                    message=e.detail.get('message', [str(e)])[0] if isinstance(e.detail, dict) else str(e),
                    errors=e.detail if isinstance(e.detail, dict) else {'error': str(e)}
                )
            except Exception as e:
                print(f"DEBUG: Check-In Service Error: {str(e)}")
                return self.error_response(message=str(e))
        
        print(f"DEBUG: Check-In Serializer Errors: {serializer.errors}")
        return self.error_response(message="Invalid location data", errors=serializer.errors)


class CheckOutView(views.APIView, StandardResponseMixin):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        request_body=CheckOutSerializer,
        responses={200: AttendanceSerializer, 400: 'Bad Request'}
    )
    def post(self, request):
        serializer = CheckOutSerializer(data=request.data)
        if serializer.is_valid():
            try:
                attendance = AttendanceService.perform_checkout(
                    user=request.user,
                    latitude=serializer.validated_data['latitude'],
                    longitude=serializer.validated_data['longitude']
                )
                return self.success_response(
                    AttendanceSerializer(attendance).data,
                    message="Checked out successfully"
                )
            except ValidationError as e:
                return self.error_response(
                    message=e.detail.get('message', [str(e)])[0] if isinstance(e.detail, dict) else str(e),
                    errors=e.detail if isinstance(e.detail, dict) else {'error': str(e)}
                )
            except Exception as e:
                return self.error_response(message=str(e))
        return self.error_response(message="Invalid data", errors=serializer.errors)


class AttendanceHistoryView(generics.ListAPIView, StandardResponseMixin):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AttendanceHistorySerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['date', 'status']
    ordering_fields = ['date', 'check_in']

    def get_queryset(self):
        return Attendance.objects.filter(staff=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return self.success_response(serializer.data)


class TodayAttendanceView(views.APIView, StandardResponseMixin):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        attendance = Attendance.objects.filter(
            staff=request.user, 
            date=timezone.now().date()
        ).first()
        
        if attendance:
            return self.success_response(AttendanceSerializer(attendance).data)
        return self.success_response(data=None, message="No attendance record for today")


class AttendanceStatisticsView(views.APIView, StandardResponseMixin):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        stats = AttendanceService.get_attendance_statistics(user=request.user)
        return self.success_response(stats)


class QRGenerateView(views.APIView, StandardResponseMixin):
    permission_classes = [IsAdminUser]

    def get(self, request):
        token, expires_at = generate_attendance_qr_data()
        qr_image = create_qr_image_base64(token)
        return self.success_response({
            "token": token,
            "expires_at": expires_at,
            "qr_image": f"data:image/png;base64,{qr_image}"
        })


class StaffAttendanceDetailView(views.APIView, StandardResponseMixin):
    permission_classes = [IsAdminUser]

    def get(self, request, staff_id):
        stats = AttendanceService.get_attendance_statistics(user_id=staff_id)
        recent_attendance = Attendance.objects.filter(staff_id=staff_id)[:10]
        return self.success_response({
            "statistics": stats,
            "recent_attendance": AttendanceSerializer(recent_attendance, many=True).data
        })


class MonthlyReportView(views.APIView, StandardResponseMixin):
    permission_classes = [IsAdminUser]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('month', openapi.IN_QUERY, type=openapi.TYPE_INTEGER),
            openapi.Parameter('year', openapi.IN_QUERY, type=openapi.TYPE_INTEGER),
            openapi.Parameter('staff_id', openapi.IN_QUERY, type=openapi.TYPE_INTEGER),
        ]
    )
    def get(self, request):
        month = request.query_params.get('month', timezone.now().month)
        year = request.query_params.get('year', timezone.now().year)
        staff_id = request.query_params.get('staff_id')
        
        report = AttendanceService.get_monthly_report(month, year, staff_id)
        serializer = AttendanceSerializer(report, many=True)
        return self.success_response(serializer.data)