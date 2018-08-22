from rest_framework import permissions


def can_edit_committee(user, committee):
    if user.is_superuser:
        return True
    return committee is user.leader_of_committee


def is_admin(user):
    if user.is_anonymous:
        return False
    return user.is_board_member


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user


class CommitteePermissions(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return can_edit_committee(request.user, obj)


class AdmissionPermissions(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return is_admin(request.user)

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        return is_admin(request.user)


class ApplicationPermissions(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return False

    def has_permission(self, request, view):
        return is_admin(request.user)
