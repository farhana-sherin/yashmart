from rest_framework import viewsets, filters, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from .models import Staff
from .serializers import (
    StaffSerializer, StaffCreateSerializer,
    StaffUpdateSerializer, StaffDetailSerializer
)
from .filters import StaffFilter
from .permissions import IsAdminOrSelf, IsAdminUser
from .services import StaffService
from apps.attendance.serializers import AttendanceSerializer
from apps.common.pagination import StandardResultsSetPagination

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

class StaffViewSet(viewsets.ModelViewSet, StandardResponseMixin):
    queryset = Staff.objects.all().select_related('user')
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = StaffFilter
    search_fields = ['user__name', 'user__email', 'phone', 'employee_id', 'department', 'designation']
    ordering_fields = ['joining_date', 'created_at']
    ordering = ['-joining_date']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN' or user.is_superuser:
            return Staff.objects.all().select_related('user')
        return Staff.objects.filter(user=user).select_related('user')

    def get_permissions(self):
        if self.action in ['create', 'destroy']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAdminOrSelf]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action == 'create':
            return StaffCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return StaffUpdateSerializer
        elif self.action == 'retrieve':
            return StaffDetailSerializer
        return StaffSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Validation failed',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            staff = serializer.save()
            return Response({
                'success': True,
                'message': 'Staff created successfully',
                'data': StaffDetailSerializer(staff).data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            'success': True,
            'message': 'Staff retrieved successfully',
            'data': serializer.data
        })

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        staff = serializer.save()
        return Response({
            'success': True,
            'message': 'Staff updated successfully',
            'data': StaffDetailSerializer(staff).data
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        user = instance.user
        user.is_active = False
        user.save()
        return Response({
            'success': True,
            'message': 'Staff deactivated successfully'
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def attendance(self, request, pk=None):
        staff = self.get_object()
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        records = StaffService.get_staff_attendance(staff.user, date_from, date_to)
        
        page = self.paginate_queryset(records)
        if page is not None:
            serializer = AttendanceSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = AttendanceSerializer(records, many=True)
        return self.success_response(serializer.data)

    @action(detail=True, methods=['get'])
    def statistics(self, request, pk=None):
        staff = self.get_object()
        stats = StaffService.get_staff_statistics(staff.user)
        return self.success_response(stats)
