from rest_framework import permissions


class IsAgentOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow agents to create/edit objects.
    """
    def has_permission(self, request, view):
        # Read permissions for any request
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions only for authenticated agents
        return (request.user and
                request.user.is_authenticated and
                request.user.user_type == 'agent')


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_permission(self, request, view):
        # Read permissions for any request
        if request.method in permissions.SAFE_METHODS:
            return True

        # For write operations, user must be authenticated
        # Object-level permission will be checked in has_object_permission
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Read permissions for any request
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions only for the owner
        import logging
        logger = logging.getLogger(__name__)

        logger.info(f"IsOwnerOrReadOnly check - User: {request.user}, Method: {request.method}")
        logger.info(f"Object type: {type(obj).__name__}")

        if hasattr(obj, 'user'):
            result = obj.user == request.user
            logger.info(f"Has 'user' attr - obj.user: {obj.user}, match: {result}")
            return result
        elif hasattr(obj, 'agent') and hasattr(obj.agent, 'user'):
            result = obj.agent.user == request.user
            logger.info(f"Has 'agent.user' - obj.agent: {obj.agent}, obj.agent.user: {obj.agent.user}, match: {result}")
            return result

        logger.warning(f"No user or agent.user attribute found on {type(obj).__name__}")
        return False


class IsVerifiedAgent(permissions.BasePermission):
    """
    Permission for verified agents only.
    """
    def has_permission(self, request, view):
        return (request.user and
                request.user.is_authenticated and
                request.user.user_type == 'agent' and
                hasattr(request.user, 'agent_profile') and
                request.user.agent_profile.is_verified)