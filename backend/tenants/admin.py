from django.contrib import admin
from .models import Tenant, TenantDocument


@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'employer_name', 'monthly_income_range', 'created_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'employer_name')
    list_filter = ('created_at',)


@admin.register(TenantDocument)
class TenantDocumentAdmin(admin.ModelAdmin):
    list_display = ('id', 'tenant', 'name', 'uploaded_at')
    search_fields = ('name', 'tenant__user__email')
    list_filter = ('uploaded_at',)
