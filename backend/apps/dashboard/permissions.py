from rest_framework import permissions

class IsDashboardViewer(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.role in ['ADMIN', 'STAFF'] or request.user.is_superuser))
