from django.db.models import Count, Q, Avg
from django.utils import timezone
from django.contrib.auth import get_user_model
from .models import Lead, FollowUp, Activity

User = get_user_model()


def get_pipeline_funnel():
    """
    Calculates conversion funnel stages from initial enquiry to confirmed admission.
    """
    total = Lead.objects.count()

    contacted = Lead.objects.exclude(
        status__in=[Lead.Status.NEW, Lead.Status.ASSIGNED]
    ).count()

    interested = Lead.objects.filter(
        status__in=[
            Lead.Status.INTERESTED,
            Lead.Status.FOLLOW_UP,
            Lead.Status.APPLICATION_STARTED,
            Lead.Status.APPLICATION_SUBMITTED,
            Lead.Status.ADMISSION_CONFIRMED,
            Lead.Status.CONVERTED,
        ]
    ).count()

    applications = Lead.objects.filter(
        status__in=[
            Lead.Status.APPLICATION_STARTED,
            Lead.Status.APPLICATION_SUBMITTED,
            Lead.Status.ADMISSION_CONFIRMED,
            Lead.Status.CONVERTED,
        ]
    ).count()

    converted = Lead.objects.filter(
        status__in=[
            Lead.Status.ADMISSION_CONFIRMED,
            Lead.Status.CONVERTED,
        ]
    ).count()

    return {
        'total_leads': total,
        'contacted': contacted,
        'interested': interested,
        'applications': applications,
        'converted': converted,
        'contacted_rate': round((contacted / total * 100), 1) if total > 0 else 0,
        'interested_rate': round((interested / total * 100), 1) if total > 0 else 0,
        'application_rate': round((applications / total * 100), 1) if total > 0 else 0,
        'overall_conversion_rate': round((converted / total * 100), 1) if total > 0 else 0,
    }


def get_source_performance():
    """
    Evaluates multi-channel acquisition ROI, volume, and conversion efficiency.
    """
    sources_data = []
    source_choices = [c[0] for c in Lead.Source.choices]

    for src in source_choices:
        leads_qs = Lead.objects.filter(source=src)
        count = leads_qs.count()
        if count == 0:
            continue

        apps = leads_qs.filter(
            status__in=[
                Lead.Status.APPLICATION_STARTED,
                Lead.Status.APPLICATION_SUBMITTED,
                Lead.Status.ADMISSION_CONFIRMED,
                Lead.Status.CONVERTED,
            ]
        ).count()

        conv = leads_qs.filter(
            status__in=[
                Lead.Status.ADMISSION_CONFIRMED,
                Lead.Status.CONVERTED,
            ]
        ).count()

        rate = round((conv / count * 100), 1) if count > 0 else 0

        sources_data.append({
            'source': src,
            'leads_count': count,
            'applications_count': apps,
            'converted_count': conv,
            'conversion_rate': rate,
        })

    sources_data.sort(key=lambda s: s['leads_count'], reverse=True)
    return sources_data


def get_course_demand():
    """
    Aggregates student enquiry demand, application volume, and enrolment by academic course.
    """
    courses_qs = (
        Lead.objects.values('course')
        .annotate(
            total_leads=Count('id'),
            applications=Count(
                'id',
                filter=Q(status__in=[
                    Lead.Status.APPLICATION_STARTED,
                    Lead.Status.APPLICATION_SUBMITTED,
                    Lead.Status.ADMISSION_CONFIRMED,
                    Lead.Status.CONVERTED,
                ])
            ),
            conversions=Count(
                'id',
                filter=Q(status__in=[
                    Lead.Status.ADMISSION_CONFIRMED,
                    Lead.Status.CONVERTED,
                ])
            ),
        )
        .order_by('-total_leads')
    )

    results = []
    for item in courses_qs:
        total = item['total_leads']
        conv = item['conversions']
        results.append({
            'course': item['course'],
            'total_leads': total,
            'applications': item['applications'],
            'conversions': conv,
            'conversion_rate': round((conv / total * 100), 1) if total > 0 else 0,
        })
    return results


def get_ageing_distribution():
    """
    Distributes active leads across institutional SLA ageing buckets.
    """
    now = timezone.now()
    active_leads = Lead.objects.exclude(
        status__in=[
            Lead.Status.ADMISSION_CONFIRMED,
            Lead.Status.CONVERTED,
            Lead.Status.LOST,
        ]
    )

    buckets = {
        'Fresh': 0,        # 0-3 days
        'Attention': 0,    # 4-7 days
        'Ageing': 0,       # 8-14 days
        'Critical': 0,     # 15-30 days
        'Severely Overdue': 0, # >30 days
    }

    for lead in active_leads:
        age_days = (now - lead.created_at).days
        if age_days <= 3:
            buckets['Fresh'] += 1
        elif age_days <= 7:
            buckets['Attention'] += 1
        elif age_days <= 14:
            buckets['Ageing'] += 1
        elif age_days <= 30:
            buckets['Critical'] += 1
        else:
            buckets['Severely Overdue'] += 1

    total_active = sum(buckets.values())
    return {
        'distribution': buckets,
        'total_active': total_active,
    }


def get_counsellor_leaderboard():
    """
    Ranks counsellors by conversion achievements, active lead capacity, and daily targets.
    """
    counsellors = User.objects.filter(is_active=True).annotate(
        assigned_total=Count('assigned_leads'),
        active_leads=Count(
            'assigned_leads',
            filter=~Q(assigned_leads__status__in=[
                Lead.Status.ADMISSION_CONFIRMED,
                Lead.Status.CONVERTED,
                Lead.Status.LOST,
            ])
        ),
        conversions=Count(
            'assigned_leads',
            filter=Q(assigned_leads__status__in=[
                Lead.Status.ADMISSION_CONFIRMED,
                Lead.Status.CONVERTED,
            ])
        ),
        today_conversions=Count(
            'assigned_leads',
            filter=Q(
                assigned_leads__status__in=[
                    Lead.Status.ADMISSION_CONFIRMED,
                    Lead.Status.CONVERTED,
                ],
                assigned_leads__updated_at__date=timezone.now().date()
            )
        )
    ).order_by('-conversions', '-assigned_total')

    leaderboard = []
    for rank, c in enumerate(counsellors, start=1):
        total = c.assigned_total
        conv = c.conversions
        rate = round((conv / total * 100), 1) if total > 0 else 0
        leaderboard.append({
            'rank': rank,
            'id': str(c.id),
            'name': c.name,
            'role': c.role,
            'title': c.title,
            'avatar': c.avatar,
            'specialization': c.specialization,
            'assigned_count': total,
            'active_leads_count': c.active_leads,
            'enrolled_count': conv,
            'conversion_rate': rate,
            'today_target': c.today_target,
            'today_achieved': c.today_conversions,
            'is_paused': c.is_paused,
            'max_capacity': c.max_capacity,
        })
    return leaderboard
