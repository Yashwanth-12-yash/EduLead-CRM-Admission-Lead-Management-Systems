import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone


class UserManager(BaseUserManager):
    """Custom manager for EduLead CRM User model with email as primary login identifier."""

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email address is required for user creation.')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', User.Role.ADMIN)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    User model for EduLead CRM supporting Role-Based Access Control:
    ADMIN, MANAGER, and COUNSELLOR.
    """

    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        MANAGER = 'MANAGER', 'Manager'
        COUNSELLOR = 'COUNSELLOR', 'Counsellor'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, max_length=255, db_index=True)
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=25, blank=True, null=True)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.COUNSELLOR,
        db_index=True
    )
    title = models.CharField(
        max_length=100,
        default='Officer',
        help_text='Display title, e.g., Sr. Officer, Officer, Preferred, Junior'
    )
    avatar = models.URLField(
        max_length=500,
        blank=True,
        null=True,
        help_text='Profile photo or studio headshot URL'
    )
    specialization = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text='Program domain specialization (e.g. BCA & Tech Specialist)'
    )

    # Counsellor Workload & Allocation Engine attributes
    max_capacity = models.PositiveIntegerField(
        default=40,
        help_text='Maximum active lead handling limit for round-robin allocation'
    )
    is_paused = models.BooleanField(
        default=False,
        help_text='When true, counsellor is paused from receiving automated round-robin lead allocation'
    )
    today_target = models.PositiveIntegerField(
        default=8,
        help_text='Daily admissions confirmation target'
    )

    # Standard Django user fields
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.get_role_display()}) - {self.email}"

    @property
    def is_admin(self):
        return self.role == self.Role.ADMIN or self.is_superuser

    @property
    def is_manager(self):
        return self.role in (self.Role.ADMIN, self.Role.MANAGER)

    @property
    def is_counsellor(self):
        return self.role == self.Role.COUNSELLOR
