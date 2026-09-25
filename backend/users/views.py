from rest_framework import generics, viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter

from .serializers import (
    UserSerializer,
    CustomTokenObtainPairSerializer,
    UserCreateUpdateSerializer,
)
from .permissions import (
    IsAdminUser,
    IsManagerUser,
    IsManagerOrReadOnly,
    IsSelfOrManager,
)

User = get_user_model()


@extend_schema(
    tags=['Authentication'],
    summary='User Login with JWT',
    description='Authenticates user with email and password, returning JWT access & refresh tokens along with full user role and profile details.'
)
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@extend_schema_view(
    get=extend_schema(
        tags=['Authentication'],
        summary='Get Current User Profile',
        description='Fetches the authenticated user profile, workload metrics, and permissions.'
    ),
    put=extend_schema(
        tags=['Authentication'],
        summary='Update Current User Profile',
        description='Updates name, phone, title, avatar, specialization, or capacity settings.'
    ),
    patch=extend_schema(
        tags=['Authentication'],
        summary='Partial Update Current User Profile'
    )
)
class CurrentUserView(generics.RetrieveUpdateAPIView):
    """
    GET /api/auth/me/
    Retrieves the currently authenticated user's profile and counsellor workload metrics.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


@extend_schema(
    tags=['Counsellors'],
    summary='List Active Counsellors',
    description='Retrieves all active counsellors, including live active lead count, conversion rate, and capacity for allocation.',
    parameters=[
        OpenApiParameter(
            name='role',
            description='Filter by role: ADMIN, MANAGER, or COUNSELLOR',
            required=False,
            type=str
        )
    ]
)
class CounsellorListView(generics.ListAPIView):
    """
    GET /api/counsellors/
    Lists all counsellors with live workload, active capacity, and conversion rate.
    Used by Lead Assignment Hub and Team Leaderboard.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = User.objects.filter(is_active=True).order_by('name')
        role_filter = self.request.query_params.get('role')
        if role_filter:
            queryset = queryset.filter(role=role_filter)
        return queryset


@extend_schema(
    tags=['Counsellors'],
    summary='Toggle Counsellor Routing Pause',
    description='Pauses or resumes counsellor from receiving automated round-robin lead allocation.'
)
class CounsellorTogglePauseView(generics.GenericAPIView):
    """
    POST /api/counsellors/<id>/toggle-pause/
    Toggles counsellor participation in the automated Round-Robin Lead Allocation Engine.
    Managers/Admins can toggle anyone; Counsellors can toggle themselves.
    """
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()

    def post(self, request, pk):
        try:
            counsellor = self.get_queryset().get(pk=pk)
            # Authorization check
            is_manager = request.user.role in (User.Role.ADMIN, User.Role.MANAGER) or request.user.is_superuser
            if not is_manager and str(request.user.id) != str(counsellor.id):
                raise PermissionDenied('You can only toggle your own allocation status.')

            counsellor.is_paused = not counsellor.is_paused
            counsellor.save()
            return Response({
                'id': str(counsellor.id),
                'name': counsellor.name,
                'is_paused': counsellor.is_paused,
                'status': 'paused' if counsellor.is_paused else 'available',
                'message': f"Counsellor {counsellor.name} is now {'paused' if counsellor.is_paused else 'available'} for auto-routing."
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'Counsellor not found.'}, status=status.HTTP_404_NOT_FOUND)


@extend_schema_view(
    list=extend_schema(tags=['Users'], summary='List all users'),
    create=extend_schema(tags=['Users'], summary='Create staff/counsellor account (Manager/Admin only)'),
    retrieve=extend_schema(tags=['Users'], summary='Get user detail by ID'),
    update=extend_schema(tags=['Users'], summary='Update user account'),
    partial_update=extend_schema(tags=['Users'], summary='Partial update user account'),
    destroy=extend_schema(tags=['Users'], summary='Delete/deactivate user account (Manager/Admin only)')
)
class UserViewSet(viewsets.ModelViewSet):
    """
    Administrative management endpoint for Staff and Counsellors.
    Read: Authenticated users.
    Write: Managers and Admins only.
    """
    queryset = User.objects.all().order_by('-created_at')
    permission_classes = [IsManagerOrReadOnly]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return UserCreateUpdateSerializer
        return UserSerializer
