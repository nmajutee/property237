"""
Firebase Cloud Messaging push notification service.
Requires FIREBASE_SERVER_KEY in settings or environment.
"""
import logging
import requests
from django.conf import settings

logger = logging.getLogger(__name__)

FCM_SEND_URL = 'https://fcm.googleapis.com/fcm/send'


def send_push_notification(user, title, body, data=None):
    """
    Send a push notification to all active devices of a user.
    Returns the count of successfully sent messages.
    """
    from .models import FCMDevice

    server_key = getattr(settings, 'FIREBASE_SERVER_KEY', None)
    if not server_key:
        logger.warning('FIREBASE_SERVER_KEY not configured, skipping push notification')
        return 0

    devices = FCMDevice.objects.filter(user=user, is_active=True)
    if not devices.exists():
        return 0

    tokens = list(devices.values_list('registration_id', flat=True))

    payload = {
        'registration_ids': tokens,
        'notification': {
            'title': title,
            'body': body,
        },
    }
    if data:
        payload['data'] = data

    headers = {
        'Authorization': f'key={server_key}',
        'Content-Type': 'application/json',
    }

    try:
        resp = requests.post(FCM_SEND_URL, json=payload, headers=headers, timeout=10)
        resp.raise_for_status()
        result = resp.json()

        # Deactivate invalid tokens
        if 'results' in result:
            for i, res in enumerate(result['results']):
                if res.get('error') in ('InvalidRegistration', 'NotRegistered'):
                    FCMDevice.objects.filter(registration_id=tokens[i]).update(is_active=False)

        return result.get('success', 0)
    except Exception as e:
        logger.error(f'FCM push failed: {e}')
        return 0
