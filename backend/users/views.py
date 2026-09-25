from rest_framework import generics, viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema, extend_schema_view

from .serializers import (
    UserSerializer,
    CustomTokenObtainPairSerializer,
    UserCreateUpdateSerializer,
)

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Login endpoint taking 'email' and 'password'.
    Returns JWT access & refresh tokens along with the user profile object.
    """
    serializer_class = CustomTokenObtainPairSerializer


class CurrentUserView(generics.RetrieveUpdateAPIView):
    """
    GET /api/auth/me/
    Retrieves the currently authenticated user's profile and counsellor workload metrics.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


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


class CounsellorTogglePauseView(generics.GenericAPIView):
    """
    POST /api/counsellors/<id>/toggle-pause/
    Toggles counsellor participation in the automated Round-Robin Lead Allocation Engine.
    """
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()

    def post(self, request, pk):
        try:
            counsellor = self.get_queryset().get(pk=pk)
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


class UserViewSet(viewsets.ModelViewSet):
    """
    Administrative management endpoint for Staff and Counsellors.
    """
    queryset = User.objects.all().order_by('-created_at')
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return UserCreateUpdateSerializer
        return UserSerializer
