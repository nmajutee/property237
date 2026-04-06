"""
Tenant Credit Scoring Algorithm
Calculates a score (0-850) based on payment history, verification,
documents, lease compliance, and profile completeness.
"""
from decimal import Decimal
from django.db.models import Count, Q, Sum
from django.utils import timezone


def calculate_tenant_score(tenant_profile):
    """
    Calculate a credit score for a tenant (0-850).

    Breakdown (weights):
      - Payment history:    40%  (340 pts max)
      - Verification:       20%  (170 pts max)
      - Document uploads:   15%  (127 pts max)
      - Lease compliance:   15%  (128 pts max)
      - Profile complete:   10%  (85 pts max)

    Returns dict with total score and component breakdown.
    """
    user = tenant_profile.user
    scores = {}

    # 1. Payment history (340 pts)
    scores['payment_history'] = _score_payment_history(tenant_profile, user)

    # 2. Verification status (170 pts)
    scores['verification'] = _score_verification(tenant_profile, user)

    # 3. Document uploads (127 pts)
    scores['documents'] = _score_documents(tenant_profile)

    # 4. Lease compliance (128 pts)
    scores['lease_compliance'] = _score_lease_compliance(tenant_profile)

    # 5. Profile completeness (85 pts)
    scores['profile_completeness'] = _score_profile(tenant_profile)

    total = sum(scores.values())
    total = min(total, 850)

    # Persist to model
    tenant_profile.credit_score = total
    tenant_profile.save(update_fields=['credit_score'])

    return {
        'total': total,
        'max': 850,
        'grade': _grade(total),
        'components': scores,
    }


def _score_payment_history(profile, user):
    """Score based on RentSchedule payment records."""
    from leases.models import RentSchedule

    schedules = RentSchedule.objects.filter(
        lease__tenant=profile,
        due_date__lte=timezone.now().date(),
    )
    total = schedules.count()
    if total == 0:
        return 170  # No history → neutral (half credit)

    paid_on_time = schedules.filter(is_paid=True, late_fee_applied=False).count()
    paid_late = schedules.filter(is_paid=True, late_fee_applied=True).count()
    unpaid = schedules.filter(is_paid=False).count()

    ratio = (paid_on_time + paid_late * 0.5) / total
    penalty = min(unpaid * 30, 170)  # Each unpaid = -30, cap at 170
    score = int(340 * ratio) - penalty
    return max(score, 0)


def _score_verification(profile, user):
    """Score based on KYC / phone / email verification."""
    pts = 0
    if getattr(user, 'is_email_verified', False):
        pts += 30
    if getattr(user, 'is_phone_verified', False):
        pts += 40
    if getattr(user, 'is_kyc_verified', False):
        pts += 60
    if profile.is_verified:
        pts += 40
    return min(pts, 170)


def _score_documents(profile):
    """Score based on uploaded documents."""
    doc_fields = [
        'government_id_upload', 'id_document_front', 'id_document_back',
        'employment_certificate', 'income_statement', 'bank_statement',
        'taxpayer_card',
    ]
    uploaded = sum(1 for f in doc_fields if getattr(profile, f, None))
    # Each doc worth ~18 pts
    return min(int(127 * uploaded / len(doc_fields)), 127)


def _score_lease_compliance(profile):
    """Score based on lease termination reasons."""
    from leases.models import LeaseAgreement

    leases = LeaseAgreement.objects.filter(tenant=profile)
    total = leases.count()
    if total == 0:
        return 64  # Neutral

    bad_terminations = leases.filter(
        termination_reason__in=['non_payment', 'breach'],
    ).count()
    good = total - bad_terminations
    ratio = good / total
    return int(128 * ratio)


def _score_profile(profile):
    """Score based on profile completeness."""
    fields = [
        profile.employment_status,
        profile.monthly_income_range,
        profile.emergency_contact_name,
        profile.emergency_contact_phone,
        profile.employer_name,
        profile.national_id_number or profile.passport_number,
        profile.guarantor_name,
        profile.date_of_birth,
    ]
    filled = sum(1 for f in fields if f)
    return int(85 * filled / len(fields))


def _grade(score):
    if score >= 750:
        return 'Excellent'
    elif score >= 650:
        return 'Good'
    elif score >= 550:
        return 'Fair'
    elif score >= 400:
        return 'Poor'
    return 'Very Poor'
