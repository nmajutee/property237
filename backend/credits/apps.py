from django.apps import AppConfig


class CreditsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'credits'
    verbose_name = 'Credit Management System'

    def ready(self):
        import credits.signals
