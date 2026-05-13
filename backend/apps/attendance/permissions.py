from rest_framework import permissions


class IsAdminUser(permissions.BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_staff and request.user.is_superuser)


class IsStaffUser(permissions.BasePermission):
    """
    Allows access to all staff members.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)


class IsAttendanceOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an attendance record to view it.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        return obj.staff == request.user
