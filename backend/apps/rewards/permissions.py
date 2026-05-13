from rest_framework import permissions

class IsRewardManager(permissions.BasePermission):
    """
    Allows access only to Admin or users with specific roles to manage rewards.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ['ADMIN', 'STAFF'])
