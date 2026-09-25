from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    CustomTokenObtainPairView,
    CurrentUserView,
    CounsellorListView,
    CounsellorTogglePauseView,
    UserViewSet,
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    # Authentication Endpoints
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='auth_login'),
    path('auth/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', CurrentUserView.as_view(), name='current_user'),

    # Counsellor Management Endpoints
    path('counsellors/', CounsellorListView.as_view(), name='counsellor_list'),
    path('counsellors/<uuid:pk>/toggle-pause/', CounsellorTogglePauseView.as_view(), name='counsellor_toggle_pause'),
    path('counsellors/<str:pk>/toggle-pause/', CounsellorTogglePauseView.as_view(), name='counsellor_toggle_pause_str'),

    # Users ViewSet Router (CRUD)
    path('', include(router.urls)),
]
