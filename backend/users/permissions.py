"""
Enterprise Role-Based Permission System
Implements fine-grained access control for microservices architecture
"""
from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied
from django.conf import settings
import logging

logger = logging.getLogger('property237')


class RoleBasedPermission(BasePermission):
    """
    Permission class that checks user roles and specific permissions
    Usage: @permission_classes([IsAuthenticated, RoleBasedPermission])
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        user_type = request.user.user_type
        required_permission = getattr(view, 'required_permission', None)

        # Admin has full access
        if user_type == 'admin':
            return True

        # Check if specific permission is required
        if required_permission:
            user_permissions = settings.ROLE_PERMISSIONS.get(user_type, [])

            # Check for wildcard permission
            if '*' in user_permissions:
                return True

            # Check for specific permission
            if required_permission in user_permissions:
                return True

            logger.warning(
                f"Permission denied: User {request.user.email} ({user_type}) "
                f"lacks permission '{required_permission}'"
            )
            return False

        # If no specific permission required, allow authenticated users
        return True

    def has_object_permission(self, request, view, obj):
        """Object-level permissions"""
        if not request.user or not request.user.is_authenticated:
            return False

        user_type = request.user.user_type

        # Admin has full access to all objects
        if user_type == 'admin':
            return True

        # Property owners can manage their own properties
        if hasattr(obj, 'owner') and obj.owner == request.user:
            return True

        # Realtors can manage properties they're assigned to
        if user_type == 'realtor' and hasattr(obj, 'agent') and obj.agent == request.user:
            return True

        # Tenants can view/edit their own profile and related objects
        if user_type == 'tenant':
            # Check if object belongs to the tenant
            if hasattr(obj, 'tenant') and obj.tenant == request.user:
                return True
            if hasattr(obj, 'user') and obj.user == request.user:
                return True

        # Landlords can manage their properties and tenants
        if user_type == 'landlord':
            if hasattr(obj, 'landlord') and obj.landlord == request.user:
                return True
            # Can view tenant info for their properties
            if hasattr(obj, 'related_property') and hasattr(obj.related_property, 'owner'):
                if obj.related_property.owner == request.user:
                    return True

        return False


class AdminOnlyPermission(BasePermission):
    """Permission for admin-only endpoints"""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.user_type == 'admin'
        )


class RealtorPermission(BasePermission):
    """Permission for realtors and admins"""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        return request.user.user_type in ['admin', 'realtor']


class LandlordPermission(BasePermission):
    """Permission for landlords and admins"""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        return request.user.user_type in ['admin', 'landlord']


class TenantPermission(BasePermission):
    """Permission for tenants and admins"""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        return request.user.user_type in ['admin', 'tenant']


class PropertyOwnerPermission(BasePermission):
    """Permission for property owners (landlords + realtors + admins)"""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        return request.user.user_type in ['admin', 'landlord', 'realtor']


class ReadOnlyOrOwnerPermission(BasePermission):
    """
    Permission that allows read access to all authenticated users
    but write access only to owners/admins
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return request.method in ['GET', 'HEAD', 'OPTIONS'] and 'visitor' in settings.ROLE_PERMISSIONS

        return True

    def has_object_permission(self, request, view, obj):
        # Read permissions for any authenticated user
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True

        # Write permissions only for admins or owners
        if request.user.user_type == 'admin':
            return True

        # Check ownership
        if hasattr(obj, 'owner') and obj.owner == request.user:
            return True

        if hasattr(obj, 'user') and obj.user == request.user:
            return True

        if hasattr(obj, 'created_by') and obj.created_by == request.user:
            return True

        return False


class ServicePermission(BasePermission):
    """
    Permission for microservice-to-microservice communication
    Validates service tokens
    """

    def has_permission(self, request, view):
        # Check for service token in headers
        service_token = request.META.get('HTTP_X_SERVICE_TOKEN')

        if not service_token:
            return False

        # Validate service token against configured services
        valid_service_tokens = getattr(settings, 'SERVICE_TOKENS', {})

        for service_name, token in valid_service_tokens.items():
            if service_token == token:
                # Add service identity to request
                request.service_name = service_name
                logger.info(f"Service authentication successful: {service_name}")
                return True

        logger.warning(f"Invalid service token: {service_token}")
        return False


def require_permission(permission):
    """
    Decorator to require specific permission
    Usage: @require_permission('properties.manage')
    """
    def decorator(view_class):
        view_class.required_permission = permission
        return view_class
    return decorator


def require_role(*roles):
    """
    Decorator to require specific roles
    Usage: @require_role('admin', 'realtor')
    """
    def decorator(view_class):
        original_permission_classes = getattr(view_class, 'permission_classes', [])

        class RolePermission(BasePermission):
            def has_permission(self, request, view):
                if not request.user or not request.user.is_authenticated:
                    return False
                return request.user.user_type in roles

        view_class.permission_classes = original_permission_classes + [RolePermission]
        return view_class
    return decorator


# Utility functions for checking permissions in views
def has_permission(user, permission):
    """Check if user has specific permission"""
    if not user or not user.is_authenticated:
        return False

    if user.user_type == 'admin':
        return True

    user_permissions = settings.ROLE_PERMISSIONS.get(user.user_type, [])
    return '*' in user_permissions or permission in user_permissions


def check_object_permission(user, obj, action='read'):
    """Check object-level permissions"""
    if not user or not user.is_authenticated:
        return False

    if user.user_type == 'admin':
        return True

    # Owner permissions
    if hasattr(obj, 'owner') and obj.owner == user:
        return True

    if hasattr(obj, 'user') and obj.user == user:
        return True

    # Read-only permissions for related objects
    if action == 'read':
        if user.user_type == 'realtor' and hasattr(obj, 'agent') and obj.agent == user:
            return True

        if user.user_type == 'tenant' and hasattr(obj, 'tenant') and obj.tenant == user:
            return True

    return False


def log_permission_check(user, permission, granted=True):
    """Log permission checks for audit trail"""
    status = "GRANTED" if granted else "DENIED"
    logger.info(
        f"Permission {status}: User {user.email if user else 'Anonymous'} "
        f"({user.user_type if user else 'none'}) for '{permission}'"
    )