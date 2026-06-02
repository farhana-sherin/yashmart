from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return getattr(request.user, 'role', None) == 'ADMIN' or request.user.is_superuser


class IsAdminOrSelf(permissions.BasePermission):
    """
    Allows full access to Admins, but restricts Staff to retrieving/actions on their own profile.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if getattr(request.user, 'role', None) == 'ADMIN' or request.user.is_superuser:
            return True
        # Staff can retrieve, and call custom action endpoints
        if getattr(request.user, 'role', None) == 'STAFF' and view.action in ['retrieve', 'attendance', 'statistics']:
            return True
        return False

    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        if getattr(request.user, 'role', None) == 'ADMIN' or request.user.is_superuser:
            return True
        return obj.user == request.user
