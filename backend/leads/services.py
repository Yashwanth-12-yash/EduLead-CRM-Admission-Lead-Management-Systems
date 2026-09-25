from django.contrib.auth import get_user_model
from django.db.models import Count, Q
from django.utils import timezone
from .models import Lead, Activity

User = get_user_model()


def auto_assign_lead(lead: Lead, actor=None) -> Lead:
    """
    Intelligent Lead Allocation Engine.
    Assigns lead to an available counsellor based on:
    1. Active status (is_active=True, is_paused=False)
    2. Capacity headroom (active leads < max_capacity)
    3. Program specialization match (if matched counsellor has headroom)
    4. Lowest active workload (least loaded eligible counsellor)
    """
    eligible_counsellors = User.objects.filter(
        is_active=True,
        is_paused=False,
        role__in=[User.Role.COUNSELLOR, User.Role.MANAGER]
    ).annotate(
        active_leads=Count(
            'assigned_leads',
            filter=~Q(assigned_leads__status__in=[
                Lead.Status.ADMISSION_CONFIRMED,
                Lead.Status.CONVERTED,
                Lead.Status.LOST,
            ])
        )
    )

    # Filter to counsellors with capacity headroom
    available_pool = [c for c in eligible_counsellors if c.active_leads < c.max_capacity]

    if not available_pool:
        # Fallback to any active counsellor if all are at or above max capacity
        available_pool = list(eligible_counsellors)

    if not available_pool:
        return lead

    # Check for specialization match first
    specialist_match = None
    if lead.course:
        lead_course_lower = lead.course.lower()
        for c in available_pool:
            if c.specialization and (lead_course_lower in c.specialization.lower() or any(
                part.strip() in c.specialization.lower() for part in lead_course_lower.split()
            )):
                specialist_match = c
                break

    chosen_counsellor = specialist_match or min(available_pool, key=lambda c: c.active_leads)

    old_counsellor = lead.assigned_counsellor
    lead.assigned_counsellor = chosen_counsellor
    if lead.status == Lead.Status.NEW:
        lead.status = Lead.Status.ASSIGNED
    lead.save()

    # Log Activity
    Activity.objects.create(
        lead=lead,
        user=actor or chosen_counsellor,
        type=Activity.ActivityType.ASSIGNMENT,
        title=f"Assigned to {chosen_counsellor.name}",
        description=(
            f"Auto-routed via Workload Allocation Engine. "
            f"Active load: {chosen_counsellor.active_leads}/{chosen_counsellor.max_capacity}. "
            + (f"Reassigned from {old_counsellor.name}." if old_counsellor else "Initial assignment.")
        )
    )

    return lead


def bulk_assign_leads(lead_ids: list, counsellor_id: str, actor=None) -> dict:
    """
    Bulk assigns a list of lead IDs to a specific counsellor.
    """
    counsellor = User.objects.get(id=counsellor_id)
    leads = Lead.objects.filter(id__in=lead_ids)

    updated_count = 0
    for lead in leads:
        lead.assigned_counsellor = counsellor
        if lead.status == Lead.Status.NEW:
            lead.status = Lead.Status.ASSIGNED
        lead.save()

        Activity.objects.create(
            lead=lead,
            user=actor or counsellor,
            type=Activity.ActivityType.ASSIGNMENT,
            title=f"Bulk assigned to {counsellor.name}",
            description=f"Batch allocation by {actor.name if actor else 'System'}."
        )
        updated_count += 1

    return {
        'success': True,
        'count': updated_count,
        'counsellor_id': str(counsellor.id),
        'counsellor_name': counsellor.name,
    }
