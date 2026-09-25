import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone


class Lead(models.Model):
    """
    Admission Lead model tracking prospective students across all acquisition channels.
    """

    class Status(models.TextChoices):
        NEW = 'NEW', 'New'
        ASSIGNED = 'ASSIGNED', 'Assigned'
        CONTACTED = 'CONTACTED', 'Contacted'
        INTERESTED = 'INTERESTED', 'Interested'
        FOLLOW_UP = 'FOLLOW_UP', 'Follow-up'
        APPLICATION_STARTED = 'APPLICATION_STARTED', 'Application Started'
        APPLICATION_SUBMITTED = 'APPLICATION_SUBMITTED', 'Application Submitted'
        ADMISSION_CONFIRMED = 'ADMISSION_CONFIRMED', 'Admission Confirmed'
        CONVERTED = 'CONVERTED', 'Converted'
        LOST = 'LOST', 'Lost'

    class Priority(models.TextChoices):
        LOW = 'LOW', 'Low'
        MEDIUM = 'MEDIUM', 'Medium'
        HIGH = 'HIGH', 'High'
        URGENT = 'URGENT', 'Urgent'

    class Source(models.TextChoices):
        WEBSITE = 'Website', 'Website'
        WALK_IN = 'Walk-in', 'Walk-in'
        PHONE_CALL = 'Phone Call', 'Phone Call'
        WHATSAPP = 'WhatsApp', 'WhatsApp'
        INSTAGRAM = 'Instagram', 'Instagram'
        FACEBOOK = 'Facebook', 'Facebook'
        GOOGLE_ADS = 'Google Ads', 'Google Ads'
        EDUCATION_FAIR = 'Education Fair', 'Education Fair'
        REFERRAL = 'Referral', 'Referral'
        CAMPAIGN = 'Campaign', 'Campaign'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    lead_id = models.CharField(max_length=30, unique=True, db_index=True, blank=True)
    name = models.CharField(max_length=255, db_index=True)
    phone = models.CharField(max_length=30, db_index=True)
    email = models.EmailField(max_length=255, db_index=True)
    has_whatsapp = models.BooleanField(default=True)

    city = models.CharField(max_length=100, default='Bengaluru')
    state = models.CharField(max_length=100, default='Karnataka')
    qualification = models.CharField(max_length=150, default='12th Grade (Science)')
    passing_year = models.PositiveIntegerField(default=2026)
    score_percentage = models.CharField(max_length=50, blank=True, default='')

    course = models.CharField(max_length=150, db_index=True)
    preferred_campus = models.CharField(max_length=150, default='Main Campus')
    preferred_intake = models.CharField(max_length=50, default='Fall 2026')
    budget = models.CharField(max_length=100, default='₹3.5 - 5 Lakhs')

    source = models.CharField(max_length=50, choices=Source.choices, default=Source.WEBSITE, db_index=True)
    campaign = models.CharField(max_length=150, blank=True, default='')

    assigned_counsellor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='assigned_leads',
        db_index=True
    )

    status = models.CharField(
        max_length=30,
        choices=Status.choices,
        default=Status.NEW,
        db_index=True
    )
    priority = models.CharField(
        max_length=20,
        choices=Priority.choices,
        default=Priority.MEDIUM,
        db_index=True
    )
    remarks = models.TextField(blank=True, default='')
    lead_score = models.PositiveIntegerField(default=60)
    avatar = models.URLField(max_length=500, blank=True, null=True)

    last_contacted_at = models.DateTimeField(null=True, blank=True)
    next_follow_up_at = models.DateTimeField(null=True, blank=True)
    next_follow_up_note = models.CharField(max_length=255, blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Lead'
        verbose_name_plural = 'Leads'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.lead_id or 'LEAD'} - {self.name} ({self.course})"

    def save(self, *args, **kwargs):
        # Auto-generate human-friendly lead_id (#L-1001+) if not provided
        if not self.lead_id:
            last_lead = Lead.objects.exclude(lead_id='').order_by('-created_at').first()
            if last_lead and last_lead.lead_id.startswith('#L-'):
                try:
                    num = int(last_lead.lead_id.replace('#L-', '')) + 1
                    self.lead_id = f"#L-{num}"
                except ValueError:
                    self.lead_id = f"#L-{int(timezone.now().timestamp()) % 100000}"
            else:
                self.lead_id = f"#L-1001"
        super().save(*args, **kwargs)

    @property
    def lead_age_days(self) -> int:
        return max(0, (timezone.now() - self.created_at).days)

    @property
    def ageing_category(self) -> str:
        days = self.lead_age_days
        if days <= 3:
            return 'Fresh'
        elif days <= 7:
            return 'Attention'
        elif days <= 14:
            return 'Ageing'
        elif days <= 30:
            return 'Critical'
        else:
            return 'Severely Overdue'


class FollowUp(models.Model):
    """
    Scheduled or completed follow-up interaction with a student lead.
    """

    class FollowUpType(models.TextChoices):
        CALL = 'CALL', 'Phone Call'
        WHATSAPP = 'WHATSAPP', 'WhatsApp'
        EMAIL = 'EMAIL', 'Email'
        MEETING = 'MEETING', 'Meeting'
        VISIT = 'VISIT', 'Campus Visit'

    class FollowUpStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        COMPLETED = 'COMPLETED', 'Completed'
        MISSED = 'MISSED', 'Missed'
        CANCELLED = 'CANCELLED', 'Cancelled'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='follow_ups', db_index=True)
    counsellor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='conducted_follow_ups',
        db_index=True
    )
    date = models.DateField(db_index=True)
    time = models.TimeField(default='14:00')
    type = models.CharField(
        max_length=20,
        choices=FollowUpType.choices,
        default=FollowUpType.CALL
    )
    status = models.CharField(
        max_length=20,
        choices=FollowUpStatus.choices,
        default=FollowUpStatus.PENDING,
        db_index=True
    )
    priority = models.CharField(
        max_length=20,
        choices=Lead.Priority.choices,
        default=Lead.Priority.MEDIUM
    )
    notes = models.TextField(blank=True, default='')
    completed_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Follow-up'
        verbose_name_plural = 'Follow-ups'
        ordering = ['date', 'time']

    def __str__(self):
        return f"{self.type} with {self.lead.name} on {self.date} at {self.time}"


class Activity(models.Model):
    """
    Audit and interaction timeline event logged for a student lead.
    """

    class ActivityType(models.TextChoices):
        CALL = 'CALL', 'Phone Call'
        WHATSAPP = 'WHATSAPP', 'WhatsApp'
        EMAIL = 'EMAIL', 'Email'
        MEETING = 'MEETING', 'Meeting'
        WALK_IN = 'WALK_IN', 'Walk-in'
        VISIT = 'VISIT', 'Campus Visit'
        COUNSELLING = 'COUNSELLING', 'Counselling Session'
        NOTE = 'NOTE', 'Internal Note'
        APPLICATION = 'APPLICATION', 'Application Status'
        PAYMENT = 'PAYMENT', 'Fee Payment'
        STATUS_CHANGE = 'STATUS_CHANGE', 'Status Changed'
        ASSIGNMENT = 'ASSIGNMENT', 'Lead Reassigned'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='activities', db_index=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='activities'
    )
    type = models.CharField(
        max_length=30,
        choices=ActivityType.choices,
        default=ActivityType.NOTE
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    outcome = models.CharField(max_length=255, blank=True, default='')
    duration = models.CharField(max_length=50, blank=True, default='')

    attachment_name = models.CharField(max_length=255, blank=True, default='')
    attachment_url = models.URLField(max_length=500, blank=True, null=True)

    created_at = models.DateTimeField(default=timezone.now, db_index=True)

    class Meta:
        verbose_name = 'Lead Activity'
        verbose_name_plural = 'Lead Activities'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.type}: {self.title} ({self.lead.name})"
