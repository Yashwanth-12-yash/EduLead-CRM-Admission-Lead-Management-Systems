from rest_framework import viewsets, generics, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from django.db.models import Q, Count
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter

from users.permissions import IsManagerOrReadOnly, IsManagerUser
from .models import Lead, FollowUp, Activity
from .services import auto_assign_lead, bulk_assign_leads
from .serializers import (
    LeadListSerializer,
    LeadDetailSerializer,
    LeadCreateUpdateSerializer,
    FollowUpSerializer,
    ActivitySerializer,
)


@extend_schema_view(
    list=extend_schema(
        tags=['Leads'],
        summary='List & Filter Admission Leads',
        description='Fetches leads with multi-channel filtering (status, priority, course, source, counsellor, search query, ageing).',
        parameters=[
            OpenApiParameter('status', description='Filter by Lead Status (e.g., NEW, CONTACTED, INTERESTED, CONVERTED)'),
            OpenApiParameter('priority', description='Filter by Priority (LOW, MEDIUM, HIGH, URGENT)'),
            OpenApiParameter('course', description='Filter by Interested Course'),
            OpenApiParameter('source', description='Filter by Acquisition Channel'),
            OpenApiParameter('counsellor', description='Filter by Assigned Counsellor UUID'),
            OpenApiParameter('search', description='Search query across Name, Phone, Email, and Lead ID'),
        ]
    ),
    retrieve=extend_schema(
        tags=['Leads'],
        summary='Get Full Lead Detail',
        description='Fetches lead profile together with active follow-ups and chronological activity audit timeline.'
    ),
    create=extend_schema(tags=['Leads'], summary='Create New Admission Lead'),
    update=extend_schema(tags=['Leads'], summary='Update Lead Profile'),
    partial_update=extend_schema(tags=['Leads'], summary='Partial Update Lead Profile'),
    destroy=extend_schema(tags=['Leads'], summary='Delete Lead')
)
class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all().select_related('assigned_counsellor').prefetch_related('follow_ups', 'activities')
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return LeadDetailSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return LeadCreateUpdateSerializer
        return LeadListSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user

        # If logged in as counsellor, can filter by assigned leads or view all based on query
        params = self.request.query_params

        status_param = params.get('status')
        if status_param:
            qs = qs.filter(status=status_param)

        priority_param = params.get('priority')
        if priority_param:
            qs = qs.filter(priority=priority_param)

        course_param = params.get('course')
        if course_param:
            qs = qs.filter(course__icontains=course_param)

        source_param = params.get('source')
        if source_param:
            qs = qs.filter(source=source_param)

        counsellor_param = params.get('counsellor')
        if counsellor_param:
            if counsellor_param.lower() == 'unassigned':
                qs = qs.filter(assigned_counsellor__isnull=True)
            else:
                qs = qs.filter(assigned_counsellor_id=counsellor_param)

        search_query = params.get('search')
        if search_query:
            qs = qs.filter(
                Q(name__icontains=search_query) |
                Q(phone__icontains=search_query) |
                Q(email__icontains=search_query) |
                Q(lead_id__icontains=search_query) |
                Q(city__icontains=search_query)
            )

        return qs

    def perform_create(self, serializer):
        auto_assign = serializer.validated_data.pop('auto_assign', False)
        lead = serializer.save()

        # Log lead creation activity
        Activity.objects.create(
            lead=lead,
            user=self.request.user,
            type=Activity.ActivityType.NOTE,
            title='Lead Created',
            description=f"Enquiry registered from {lead.source} for {lead.course}."
        )

        # Trigger auto-routing if requested or if counsellor is unassigned
        if auto_assign or not lead.assigned_counsellor:
            auto_assign_lead(lead, actor=self.request.user)

    @extend_schema(
        tags=['Leads'],
        summary='Auto-Assign Lead',
        description='Triggers round-robin workload allocation engine to route lead to the optimal available counsellor.'
    )
    @action(detail=True, methods=['post'], url_path='auto-assign')
    def auto_assign(self, request, pk=None):
        lead = self.get_object()
        updated_lead = auto_assign_lead(lead, actor=request.user)
        return Response(LeadListSerializer(updated_lead).data, status=status.HTTP_200_OK)

    @extend_schema(
        tags=['Leads'],
        summary='Bulk Assign Leads',
        description='Assigns multiple leads to a selected counsellor in a single batch.'
    )
    @action(detail=False, methods=['post'], url_path='bulk-assign', permission_classes=[IsManagerUser])
    def bulk_assign(self, request):
        lead_ids = request.data.get('lead_ids', [])
        counsellor_id = request.data.get('counsellor_id')

        if not lead_ids or not counsellor_id:
            return Response(
                {'error': 'lead_ids (list) and counsellor_id (string) are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        result = bulk_assign_leads(lead_ids, counsellor_id, actor=request.user)
        return Response(result, status=status.HTTP_200_OK)

    @extend_schema(
        tags=['Leads'],
        summary='Change Lead Status',
        description='Updates the admission lifecycle status of a lead and logs a timeline audit event.'
    )
    @action(detail=True, methods=['patch'], url_path='status')
    def change_status(self, request, pk=None):
        lead = self.get_object()
        new_status = request.data.get('status')
        remarks = request.data.get('remarks', '')

        if not new_status or new_status not in Lead.Status.values:
            return Response(
                {'error': f"Valid status required: {Lead.Status.values}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        old_status = lead.status
        lead.status = new_status
        if remarks:
            lead.remarks = remarks
        lead.save()

        # Log timeline event
        Activity.objects.create(
            lead=lead,
            user=request.user,
            type=Activity.ActivityType.STATUS_CHANGE,
            title=f"Status changed to {lead.get_status_display()}",
            description=f"Status transitioned from {old_status} to {new_status}. {remarks}".strip()
        )

        return Response(LeadListSerializer(lead).data, status=status.HTTP_200_OK)

    @extend_schema(
        tags=['Leads'],
        summary='Lead Metrics Overview',
        description='Fetches aggregated pipeline counts for KPI dashboard cards.'
    )
    @action(detail=False, methods=['get'], url_path='metrics')
    def metrics(self, request):
        counts = Lead.objects.aggregate(
            total=Count('id'),
            new_leads=Count('id', filter=Q(status=Lead.Status.NEW)),
            assigned=Count('id', filter=Q(status=Lead.Status.ASSIGNED)),
            contacted=Count('id', filter=Q(status=Lead.Status.CONTACTED)),
            interested=Count('id', filter=Q(status=Lead.Status.INTERESTED)),
            follow_up=Count('id', filter=Q(status=Lead.Status.FOLLOW_UP)),
            application_started=Count('id', filter=Q(status=Lead.Status.APPLICATION_STARTED)),
            application_submitted=Count('id', filter=Q(status=Lead.Status.APPLICATION_SUBMITTED)),
            converted=Count('id', filter=Q(status__in=[Lead.Status.ADMISSION_CONFIRMED, Lead.Status.CONVERTED])),
            lost=Count('id', filter=Q(status=Lead.Status.LOST)),
        )
        return Response(counts, status=status.HTTP_200_OK)


@extend_schema_view(
    list=extend_schema(tags=['Follow-ups'], summary='List Scheduled Follow-ups'),
    retrieve=extend_schema(tags=['Follow-ups'], summary='Get Follow-up Details'),
    create=extend_schema(tags=['Follow-ups'], summary='Schedule New Follow-up'),
    update=extend_schema(tags=['Follow-ups'], summary='Update Follow-up'),
    destroy=extend_schema(tags=['Follow-ups'], summary='Cancel Follow-up')
)
class FollowUpViewSet(viewsets.ModelViewSet):
    queryset = FollowUp.objects.all().select_related('lead', 'counsellor')
    serializer_class = FollowUpSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        lead_id = self.request.query_params.get('lead')
        if lead_id:
            qs = qs.filter(lead_id=lead_id)

        counsellor_id = self.request.query_params.get('counsellor')
        if counsellor_id:
            qs = qs.filter(counsellor_id=counsellor_id)

        status_param = self.request.query_params.get('status')
        if status_param:
            qs = qs.filter(status=status_param)

        return qs

    def perform_create(self, serializer):
        follow_up = serializer.save()
        # Update lead next_follow_up_at
        lead = follow_up.lead
        lead.next_follow_up_at = timezone.make_aware(
            timezone.datetime.combine(follow_up.date, follow_up.time)
        )
        lead.next_follow_up_note = follow_up.notes[:250] if follow_up.notes else f"Next {follow_up.type}"
        lead.save()

        # Log Activity
        Activity.objects.create(
            lead=lead,
            user=self.request.user,
            type=Activity.ActivityType.CALL if follow_up.type == 'CALL' else Activity.ActivityType.NOTE,
            title=f"Follow-up Scheduled ({follow_up.get_type_display()})",
            description=f"Scheduled for {follow_up.date} at {follow_up.time}. {follow_up.notes}".strip()
        )

    @extend_schema(tags=['Follow-ups'], summary='Mark Follow-up as Completed')
    @action(detail=True, methods=['post'], url_path='complete')
    def complete(self, request, pk=None):
        follow_up = self.get_object()
        follow_up.status = FollowUp.FollowUpStatus.COMPLETED
        follow_up.completed_at = timezone.now()
        outcome = request.data.get('outcome', '')
        if outcome:
            follow_up.notes = f"{follow_up.notes}\nOutcome: {outcome}".strip()
        follow_up.save()

        # Update lead's last contacted timestamp
        lead = follow_up.lead
        lead.last_contacted_at = timezone.now()
        lead.save()

        # Log completed interaction activity
        Activity.objects.create(
            lead=lead,
            user=request.user,
            type=Activity.ActivityType.CALL if follow_up.type == 'CALL' else Activity.ActivityType.COUNSELLING,
            title=f"Completed Follow-up ({follow_up.get_type_display()})",
            description=f"Conducted by {request.user.name}. Outcome: {outcome or 'Completed'}"
        )

        return Response(FollowUpSerializer(follow_up).data, status=status.HTTP_200_OK)


@extend_schema_view(
    list=extend_schema(tags=['Activities'], summary='List Lead Timeline Activities'),
    create=extend_schema(tags=['Activities'], summary='Log Custom Interaction Activity')
)
class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all().select_related('lead', 'user')
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        lead_id = self.request.query_params.get('lead')
        if lead_id:
            qs = qs.filter(lead_id=lead_id)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


from .analytics import (
    get_pipeline_funnel,
    get_source_performance,
    get_course_demand,
    get_ageing_distribution,
    get_counsellor_leaderboard,
)


@extend_schema(tags=['Reports & Analytics'])
class ReportsViewSet(viewsets.ViewSet):
    """
    Institutional Intelligence and Performance Audit Endpoints.
    """
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(summary='Get Comprehensive Executive Overview')
    @action(detail=False, methods=['get'], url_path='overview')
    def overview(self, request):
        return Response({
            'funnel': get_pipeline_funnel(),
            'sources': get_source_performance(),
            'courses': get_course_demand(),
            'ageing': get_ageing_distribution(),
            'counsellors': get_counsellor_leaderboard()[:5],
            'cycle_window': 'Current Academic Admissions Cycle',
            'generated_at': timezone.now().isoformat(),
        }, status=status.HTTP_200_OK)

    @extend_schema(summary='Conversion Funnel Analytics')
    @action(detail=False, methods=['get'], url_path='funnel')
    def funnel(self, request):
        return Response(get_pipeline_funnel(), status=status.HTTP_200_OK)

    @extend_schema(summary='Acquisition Source ROI & Conversion')
    @action(detail=False, methods=['get'], url_path='sources')
    def sources(self, request):
        return Response(get_source_performance(), status=status.HTTP_200_OK)

    @extend_schema(summary='Course Demand & Enrolment Share')
    @action(detail=False, methods=['get'], url_path='courses')
    def courses(self, request):
        return Response(get_course_demand(), status=status.HTTP_200_OK)

    @extend_schema(summary='Lead Ageing SLA Distribution')
    @action(detail=False, methods=['get'], url_path='ageing')
    def ageing(self, request):
        return Response(get_ageing_distribution(), status=status.HTTP_200_OK)

    @extend_schema(summary='Counsellor Performance Leaderboard')
    @action(detail=False, methods=['get'], url_path='counsellors')
    def counsellors(self, request):
        return Response(get_counsellor_leaderboard(), status=status.HTTP_200_OK)

