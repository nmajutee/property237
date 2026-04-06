import logging
import time

logger = logging.getLogger('audit')


class AuditLoggingMiddleware:
    """Log all API requests for security auditing."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()
        response = self.get_response(request)
        duration = time.time() - start_time

        # Only log API requests
        if request.path.startswith('/api/'):
            user = getattr(request, 'user', None)
            user_id = user.pk if user and user.is_authenticated else None

            ip = request.META.get('HTTP_X_FORWARDED_FOR', '').split(',')[0].strip()
            if not ip:
                ip = request.META.get('REMOTE_ADDR', '')

            logger.info(
                'api_request',
                extra={
                    'method': request.method,
                    'path': request.path,
                    'status_code': response.status_code,
                    'user_id': user_id,
                    'ip': ip,
                    'duration_ms': round(duration * 1000, 2),
                    'user_agent': request.META.get('HTTP_USER_AGENT', '')[:200],
                },
            )

        return response
