from django.contrib import admin
from .models import Attendance


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = (
        'staff', 'date', 'check_in', 'check_out', 
        'status', 'working_hours', 'is_verified'
    )
    list_filter = ('status', 'date', 'is_verified', 'staff')
    search_fields = ('staff__email', 'staff__first_name', 'staff__last_name', 'notes')
    date_hierarchy = 'date'
    readonly_fields = ('created_at', 'updated_at', 'working_hours', 'late_minutes')
    
    fieldsets = (
        ('Staff Information', {
            'fields': ('staff', 'date', 'status')
        }),
        ('Timing Details', {
            'fields': ('check_in', 'check_out', 'working_hours', 'late_minutes')
        }),
        ('Location & Verification', {
            'fields': ('latitude', 'longitude', 'is_verified', 'ip_address', 'device_info', 'qr_token')
        }),
        ('Additional Info', {
            'fields': ('notes', 'created_at', 'updated_at')
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('staff')
