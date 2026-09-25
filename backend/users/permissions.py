from rest_framework import permissions
from django.contrib.auth import get_user_model

User = get_user_model()


class IsAdminUser(permissions.BasePermission):
    """
    Allows access only to Admin users or superusers.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role == User.Role.ADMIN or request.user.is_superuser)
        )


class IsManagerUser(permissions.BasePermission):
    """
    Allows access to Managers, Admins, or superusers.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role in (User.Role.ADMIN, User.Role.MANAGER) or request.user.is_superuser)
        )


class IsCounsellorUser(permissions.BasePermission):
    """
    Allows access to Counsellor role users.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == User.Role.COUNSELLOR
        )


class IsManagerOrReadOnly(permissions.BasePermission):
    """
    Allows read-only access to authenticated users, but write access only to Managers and Admins.
    """
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(
            request.user.role in (User.Role.ADMIN, User.Role.MANAGER) or
            request.user.is_superuser
        )


class IsSelfOrManager(permissions.BasePermission):
    """
    Object-level permission allowing users to edit their own record or Managers/Admins to edit any.
    """
    def has_object_permission(self, request, view, obj):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.role in (User.Role.ADMIN, User.Role.MANAGER) or request.user.is_superuser:
            return True
        return obj == request.user
