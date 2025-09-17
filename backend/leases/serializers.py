from rest_framework import serializers
from .models import LeaseAgreement, RentSchedule


class RentScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = RentSchedule
        fields = ['id', 'due_date', 'amount', 'is_paid']


class LeaseAgreementSerializer(serializers.ModelSerializer):
    rent_schedule = RentScheduleSerializer(many=True, read_only=True)

    class Meta:
        model = LeaseAgreement
        fields = [
            'id', 'property', 'tenant', 'landlord', 'start_date', 'end_date', 'rent_amount',
            'security_deposit', 'terms', 'status', 'signed_date', 'created_at', 'updated_at',
            'rent_schedule'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'rent_schedule']
