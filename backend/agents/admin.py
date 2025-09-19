from django.contrib import admin
from .models import (
    AgentProfile, AgentCertification, AgentReview, AgentAchievement,
    AgentSchedule, AgentContact, AgentDocument, AgentMobileMoney, AgentAddress
)

@admin.register(AgentProfile)
class AgentProfileAdmin(admin.ModelAdmin):
    list_display = ('user','agency_name','is_verified','is_featured','total_sales')
    search_fields = ('user__email','agency_name')
    list_filter = ('is_verified', 'is_featured', 'specialization')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(AgentDocument)
class AgentDocumentAdmin(admin.ModelAdmin):
    list_display = ('agent', 'document_type', 'is_verified', 'uploaded_at')
    search_fields = ('agent__user__email', 'document_type')
    list_filter = ('document_type', 'is_verified')
    readonly_fields = ('uploaded_at', 'updated_at', 'file_size')

@admin.register(AgentMobileMoney)
class AgentMobileMoneyAdmin(admin.ModelAdmin):
    list_display = ('agent', 'provider', 'phone_number', 'is_verified')
    search_fields = ('agent__user__email', 'phone_number')
    list_filter = ('provider', 'is_verified', 'name_match_status')

@admin.register(AgentAddress)
class AgentAddressAdmin(admin.ModelAdmin):
    list_display = ('agent', 'city', 'region', 'country')
    search_fields = ('agent__user__email', 'city', 'region')

admin.site.register(AgentCertification)
admin.site.register(AgentReview)
admin.site.register(AgentAchievement)
admin.site.register(AgentSchedule)
admin.site.register(AgentContact)
