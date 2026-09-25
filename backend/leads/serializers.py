from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import Lead, FollowUp, Activity

User = get_user_model()


class ActivitySerializer(serializers.ModelSerializer):
    lead_id = serializers.UUIDField(source='lead.id', read_only=True)
    user_id = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = [
            'id',
            'lead_id',
            'user_id',
            'user_name',
            'type',
            'title',
            'description',
            'outcome',
            'duration',
            'attachment_name',
            'attachment_url',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def get_user_id(self, obj):
        return str(obj.user.id) if obj.user else None

    def get_user_name(self, obj):
        return obj.user.name if obj.user else 'System Engine'


class FollowUpSerializer(serializers.ModelSerializer):
    lead_name = serializers.CharField(source='lead.name', read_only=True)
    lead_course = serializers.CharField(source='lead.course', read_only=True)
    counsellor_name = serializers.CharField(source='counsellor.name', read_only=True)

    # CamelCase aliases for frontend client compatibility
    leadId = serializers.UUIDField(source='lead.id', read_only=True)
    leadName = serializers.CharField(source='lead.name', read_only=True)
    leadCourse = serializers.CharField(source='lead.course', read_only=True)
    counsellorId = serializers.UUIDField(source='counsellor.id', read_only=True)
    counsellorName = serializers.CharField(source='counsellor.name', read_only=True)
    completedAt = serializers.DateTimeField(source='completed_at', read_only=True)

    class Meta:
        model = FollowUp
        fields = [
            'id',
            'lead',
            'lead_name',
            'lead_course',
            'counsellor',
            'counsellor_name',
            'date',
            'time',
            'type',
            'status',
            'priority',
            'notes',
            'completed_at',
            'created_at',
            'updated_at',
            # Frontend aliases
            'leadId',
            'leadName',
            'leadCourse',
            'counsellorId',
            'counsellorName',
            'completedAt',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'completed_at']


class LeadListSerializer(serializers.ModelSerializer):
    assigned_counsellor_id = serializers.SerializerMethodField()
    assigned_counsellor_name = serializers.SerializerMethodField()
    lead_age_days = serializers.ReadOnlyField()
    ageing_category = serializers.ReadOnlyField()

    # Frontend camelCase aliases
    leadId = serializers.CharField(source='lead_id', read_only=True)
    hasWhatsapp = serializers.BooleanField(source='has_whatsapp', read_only=True)
    passingYear = serializers.IntegerField(source='passing_year', read_only=True)
    scorePercentage = serializers.CharField(source='score_percentage', read_only=True)
    preferredCampus = serializers.CharField(source='preferred_campus', read_only=True)
    preferredIntake = serializers.CharField(source='preferred_intake', read_only=True)
    assignedCounsellorId = serializers.SerializerMethodField()
    assignedCounsellorName = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)
    lastContactedAt = serializers.DateTimeField(source='last_contacted_at', read_only=True)
    nextFollowUpAt = serializers.DateTimeField(source='next_follow_up_at', read_only=True)
    nextFollowUpNote = serializers.CharField(source='next_follow_up_note', read_only=True)
    leadScore = serializers.IntegerField(source='lead_score', read_only=True)

    class Meta:
        model = Lead
        fields = [
            'id',
            'lead_id',
            'name',
            'phone',
            'email',
            'has_whatsapp',
            'city',
            'state',
            'qualification',
            'passing_year',
            'score_percentage',
            'course',
            'preferred_campus',
            'preferred_intake',
            'budget',
            'source',
            'campaign',
            'assigned_counsellor_id',
            'assigned_counsellor_name',
            'status',
            'priority',
            'remarks',
            'lead_score',
            'avatar',
            'last_contacted_at',
            'next_follow_up_at',
            'next_follow_up_note',
            'lead_age_days',
            'ageing_category',
            'created_at',
            'updated_at',
            # CamelCase frontend mappings
            'leadId',
            'hasWhatsapp',
            'passingYear',
            'scorePercentage',
            'preferredCampus',
            'preferredIntake',
            'assignedCounsellorId',
            'assignedCounsellorName',
            'createdAt',
            'updatedAt',
            'lastContactedAt',
            'nextFollowUpAt',
            'nextFollowUpNote',
            'leadScore',
        ]
        read_only_fields = ['id', 'lead_id', 'created_at', 'updated_at']

    def get_assigned_counsellor_id(self, obj):
        return str(obj.assigned_counsellor.id) if obj.assigned_counsellor else None

    def get_assigned_counsellor_name(self, obj):
        return obj.assigned_counsellor.name if obj.assigned_counsellor else None

    def get_assignedCounsellorId(self, obj):
        return self.get_assigned_counsellor_id(obj)

    def get_assignedCounsellorName(self, obj):
        return self.get_assigned_counsellor_name(obj)


class LeadDetailSerializer(LeadListSerializer):
    follow_ups = FollowUpSerializer(many=True, read_only=True)
    activities = ActivitySerializer(many=True, read_only=True)

    class Meta(LeadListSerializer.Meta):
        fields = LeadListSerializer.Meta.fields + ['follow_ups', 'activities']


class LeadCreateUpdateSerializer(serializers.ModelSerializer):
    auto_assign = serializers.BooleanField(write_only=True, required=False, default=False)

    class Meta:
        model = Lead
        fields = [
            'id',
            'lead_id',
            'name',
            'phone',
            'email',
            'has_whatsapp',
            'city',
            'state',
            'qualification',
            'passing_year',
            'score_percentage',
            'course',
            'preferred_campus',
            'preferred_intake',
            'budget',
            'source',
            'campaign',
            'assigned_counsellor',
            'status',
            'priority',
            'remarks',
            'lead_score',
            'avatar',
            'last_contacted_at',
            'next_follow_up_at',
            'next_follow_up_note',
            'auto_assign',
        ]
        read_only_fields = ['id', 'lead_id']
