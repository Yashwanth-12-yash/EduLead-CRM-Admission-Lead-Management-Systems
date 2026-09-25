from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User profiles, returning structure compatible with
    EduLead CRM frontend 'Counsellor' and 'User' interfaces.
    """
    active_leads_count = serializers.SerializerMethodField()
    assigned_count = serializers.SerializerMethodField()
    enrolled_count = serializers.SerializerMethodField()
    conversion_rate = serializers.SerializerMethodField()
    today_achieved = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'name',
            'email',
            'phone',
            'role',
            'title',
            'avatar',
            'specialization',
            'max_capacity',
            'is_paused',
            'today_target',
            'is_active',
            'active_leads_count',
            'assigned_count',
            'enrolled_count',
            'conversion_rate',
            'today_achieved',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_active_leads_count(self, obj):
        # When Lead model is loaded, count active leads assigned to this user
        if hasattr(obj, 'assigned_leads'):
            return obj.assigned_leads.exclude(
                status__in=['ADMISSION_CONFIRMED', 'CONVERTED', 'LOST', 'NOT_INTERESTED']
            ).count()
        return 0

    def get_assigned_count(self, obj):
        if hasattr(obj, 'assigned_leads'):
            return obj.assigned_leads.count()
        return 0

    def get_enrolled_count(self, obj):
        if hasattr(obj, 'assigned_leads'):
            return obj.assigned_leads.filter(
                status__in=['ADMISSION_CONFIRMED', 'CONVERTED']
            ).count()
        return 0

    def get_conversion_rate(self, obj):
        if hasattr(obj, 'assigned_leads'):
            total = obj.assigned_leads.count()
            if total > 0:
                enrolled = obj.assigned_leads.filter(
                    status__in=['ADMISSION_CONFIRMED', 'CONVERTED']
                ).count()
                return round((enrolled / total) * 100, 1)
        return 22.2  # Baseline institutional average if no leads yet

    def get_today_achieved(self, obj):
        if hasattr(obj, 'assigned_leads'):
            today_start = timezone.now().date()
            return obj.assigned_leads.filter(
                status__in=['ADMISSION_CONFIRMED', 'CONVERTED'],
                updated_at__date=today_start
            ).count()
        return 0


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom Token serializer injecting user metadata and role directly into the response."""

    username_field = 'email'

    def validate(self, attrs):
        data = super().validate(attrs)

        # Inject user details directly into the login response
        data['user'] = {
            'id': str(self.user.id),
            'email': self.user.email,
            'name': self.user.name,
            'role': self.user.role,
            'title': self.user.title,
            'avatar': self.user.avatar,
            'specialization': self.user.specialization,
            'is_paused': self.user.is_paused,
            'today_target': self.user.today_target,
        }
        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Custom claims in JWT token payload
        token['email'] = user.email
        token['name'] = user.name
        token['role'] = user.role
        token['title'] = user.title
        return token


class UserCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for Admin/Manager staff user management."""
    password = serializers.CharField(write_only=True, required=False, min_length=8)

    class Meta:
        model = User
        fields = [
            'id',
            'name',
            'email',
            'phone',
            'role',
            'title',
            'avatar',
            'specialization',
            'max_capacity',
            'is_paused',
            'today_target',
            'is_active',
            'password',
        ]

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User.objects.create_user(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
