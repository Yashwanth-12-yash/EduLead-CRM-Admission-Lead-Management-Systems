import uuid
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Lead',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('lead_id', models.CharField(blank=True, db_index=True, max_length=30, unique=True)),
                ('name', models.CharField(db_index=True, max_length=255)),
                ('phone', models.CharField(db_index=True, max_length=30)),
                ('email', models.EmailField(db_index=True, max_length=255)),
                ('has_whatsapp', models.BooleanField(default=True)),
                ('city', models.CharField(default='Bengaluru', max_length=100)),
                ('state', models.CharField(default='Karnataka', max_length=100)),
                ('qualification', models.CharField(default='12th Grade (Science)', max_length=150)),
                ('passing_year', models.PositiveIntegerField(default=2026)),
                ('score_percentage', models.CharField(blank=True, default='', max_length=50)),
                ('course', models.CharField(db_index=True, max_length=150)),
                ('preferred_campus', models.CharField(default='Main Campus', max_length=150)),
                ('preferred_intake', models.CharField(default='Fall 2026', max_length=50)),
                ('budget', models.CharField(default='₹3.5 - 5 Lakhs', max_length=100)),
                ('source', models.CharField(choices=[('Website', 'Website'), ('Walk-in', 'Walk-in'), ('Phone Call', 'Phone Call'), ('WhatsApp', 'WhatsApp'), ('Instagram', 'Instagram'), ('Facebook', 'Facebook'), ('Google Ads', 'Google Ads'), ('Education Fair', 'Education Fair'), ('Referral', 'Referral'), ('Campaign', 'Campaign')], db_index=True, default='Website', max_length=50)),
                ('campaign', models.CharField(blank=True, default='', max_length=150)),
                ('status', models.CharField(choices=[('NEW', 'New'), ('ASSIGNED', 'Assigned'), ('CONTACTED', 'Contacted'), ('INTERESTED', 'Interested'), ('FOLLOW_UP', 'Follow-up'), ('APPLICATION_STARTED', 'Application Started'), ('APPLICATION_SUBMITTED', 'Application Submitted'), ('ADMISSION_CONFIRMED', 'Admission Confirmed'), ('CONVERTED', 'Converted'), ('LOST', 'Lost')], db_index=True, default='NEW', max_length=30)),
                ('priority', models.CharField(choices=[('LOW', 'Low'), ('MEDIUM', 'Medium'), ('HIGH', 'High'), ('URGENT', 'Urgent')], db_index=True, default='MEDIUM', max_length=20)),
                ('remarks', models.TextField(blank=True, default='')),
                ('lead_score', models.PositiveIntegerField(default=60)),
                ('avatar', models.URLField(blank=True, max_length=500, null=True)),
                ('last_contacted_at', models.DateTimeField(blank=True, null=True)),
                ('next_follow_up_at', models.DateTimeField(blank=True, null=True)),
                ('next_follow_up_note', models.CharField(blank=True, default='', max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('assigned_counsellor', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='assigned_leads', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Lead',
                'verbose_name_plural': 'Leads',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='FollowUp',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('date', models.DateField(db_index=True)),
                ('time', models.TimeField(default='14:00')),
                ('type', models.CharField(choices=[('CALL', 'Phone Call'), ('WHATSAPP', 'WhatsApp'), ('EMAIL', 'Email'), ('MEETING', 'Meeting'), ('VISIT', 'Campus Visit')], default='CALL', max_length=20)),
                ('status', models.CharField(choices=[('PENDING', 'Pending'), ('COMPLETED', 'Completed'), ('MISSED', 'Missed'), ('CANCELLED', 'Cancelled')], db_index=True, default='PENDING', max_length=20)),
                ('priority', models.CharField(choices=[('LOW', 'Low'), ('MEDIUM', 'Medium'), ('HIGH', 'High'), ('URGENT', 'Urgent')], default='MEDIUM', max_length=20)),
                ('notes', models.TextField(blank=True, default='')),
                ('completed_at', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('counsellor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='conducted_follow_ups', to=settings.AUTH_USER_MODEL)),
                ('lead', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='follow_ups', to='leads.lead')),
            ],
            options={
                'verbose_name': 'Follow-up',
                'verbose_name_plural': 'Follow-ups',
                'ordering': ['date', 'time'],
            },
        ),
        migrations.CreateModel(
            name='Activity',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('type', models.CharField(choices=[('CALL', 'Phone Call'), ('WHATSAPP', 'WhatsApp'), ('EMAIL', 'Email'), ('MEETING', 'Meeting'), ('WALK_IN', 'Walk-in'), ('VISIT', 'Campus Visit'), ('COUNSELLING', 'Counselling Session'), ('NOTE', 'Internal Note'), ('APPLICATION', 'Application Status'), ('PAYMENT', 'Fee Payment'), ('STATUS_CHANGE', 'Status Changed'), ('ASSIGNMENT', 'Lead Reassigned')], default='NOTE', max_length=30)),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True, default='')),
                ('outcome', models.CharField(blank=True, default='', max_length=255)),
                ('duration', models.CharField(blank=True, default='', max_length=50)),
                ('attachment_name', models.CharField(blank=True, default='', max_length=255)),
                ('attachment_url', models.URLField(blank=True, max_length=500, null=True)),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('lead', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='activities', to='leads.lead')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='activities', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Lead Activity',
                'verbose_name_plural': 'Lead Activities',
                'ordering': ['-created_at'],
            },
        ),
    ]
