from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LeadViewSet, FollowUpViewSet, ActivityViewSet, ReportsViewSet

router = DefaultRouter()
router.register(r'leads', LeadViewSet, basename='lead')
router.register(r'followups', FollowUpViewSet, basename='followup')
router.register(r'activities', ActivityViewSet, basename='activity')
router.register(r'reports', ReportsViewSet, basename='report')

urlpatterns = [
    path('', include(router.urls)),
]
