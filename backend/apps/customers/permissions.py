from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return getattr(request.user, 'role', None) in ['ADMIN', 'STAFF']

class IsCustomerOwner(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to access it.
    Assumes the model instance has an `user` attribute.
    """
    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
            
        # Admin and Staff can view all
        if getattr(request.user, 'role', None) in ['ADMIN', 'STAFF']:
            return True
            
        # Customer can only view their own data
        return obj.user == request.user
