import datetime
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from leads.models import Lead, FollowUp, Activity

User = get_user_model()


class Command(BaseCommand):
    help = 'Seeds initial users, counsellors, admission leads, follow-ups, and activity histories for EduLead CRM.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Starting EduLead CRM initial data seeding...'))

        # 1. Create Staff & Counsellor Accounts
        users_data = [
            {
                'email': 'admin@edulead.edu',
                'name': 'Dr. Vikram Malhotra',
                'role': User.Role.ADMIN,
                'title': 'Director of Admissions',
                'phone': '+91 98450 11001',
                'avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                'is_staff': True,
                'is_superuser': True,
            },
            {
                'email': 'manager@edulead.edu',
                'name': 'Rajesh Varma',
                'role': User.Role.MANAGER,
                'title': 'Admissions Operations Head',
                'phone': '+91 98450 22002',
                'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                'is_staff': True,
                'is_superuser': False,
            },
            {
                'email': 'priya.sharma@edulead.edu',
                'name': 'Priya Sharma',
                'role': User.Role.COUNSELLOR,
                'title': 'Sr. Officer',
                'specialization': 'BCA, MCA & Tech Specialist',
                'phone': '+91 98450 33003',
                'avatar': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
                'max_capacity': 40,
                'today_target': 8,
            },
            {
                'email': 'arun.kumar@edulead.edu',
                'name': 'Arun Kumar',
                'role': User.Role.COUNSELLOR,
                'title': 'Officer',
                'specialization': 'MBA & Executive Management',
                'phone': '+91 98450 44004',
                'avatar': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
                'max_capacity': 35,
                'today_target': 6,
            },
            {
                'email': 'ravi.raj@edulead.edu',
                'name': 'Ravi Raj',
                'role': User.Role.COUNSELLOR,
                'title': 'Preferred Specialist',
                'specialization': 'B.Tech Engineering & Robotics',
                'phone': '+91 98450 55005',
                'avatar': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
                'max_capacity': 45,
                'today_target': 10,
            },
            {
                'email': 'sneha.patel@edulead.edu',
                'name': 'Sneha Patel',
                'role': User.Role.COUNSELLOR,
                'title': 'Junior Counsellor',
                'specialization': 'Design, Media & Communications',
                'phone': '+91 98450 66006',
                'avatar': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
                'max_capacity': 30,
                'today_target': 5,
            },
        ]

        user_map = {}
        for udata in users_data:
            user, created = User.objects.get_or_create(
                email=udata['email'],
                defaults=udata
            )
            if created:
                user.set_password('EduLead@2026')
                user.save()
            user_map[udata['email']] = user

        self.stdout.write(self.style.SUCCESS(f"Staff accounts ready: {len(user_map)} users."))

        # 2. Seed Leads
        priya = user_map['priya.sharma@edulead.edu']
        arun = user_map['arun.kumar@edulead.edu']
        ravi = user_map['ravi.raj@edulead.edu']
        sneha = user_map['sneha.patel@edulead.edu']

        now = timezone.now()

        leads_to_create = [
            {
                'lead_id': '#L-1084',
                'name': 'Rahul Sharma',
                'phone': '+91 98765 43210',
                'email': 'rahul.sharma@gmail.com',
                'city': 'Bengaluru',
                'state': 'Karnataka',
                'qualification': '12th Grade (Science - PCM)',
                'passing_year': 2026,
                'score_percentage': '88.5%',
                'course': 'BCA (Artificial Intelligence)',
                'preferred_campus': 'Main Campus',
                'preferred_intake': 'Fall 2026',
                'budget': '₹3.5 - 5 Lakhs',
                'source': Lead.Source.WEBSITE,
                'assigned_counsellor': priya,
                'status': Lead.Status.INTERESTED,
                'priority': Lead.Priority.URGENT,
                'lead_score': 92,
                'remarks': 'Very keen on AI specialization. Parents inquired about campus hostel accommodations.',
                'created_at': now - datetime.timedelta(days=2),
            },
            {
                'lead_id': '#L-1085',
                'name': 'Ananya Deshmukh',
                'phone': '+91 91234 56789',
                'email': 'ananya.d@outlook.com',
                'city': 'Mumbai',
                'state': 'Maharashtra',
                'qualification': 'B.Com Graduate',
                'passing_year': 2025,
                'score_percentage': '79.2%',
                'course': 'MBA (Finance & FinTech)',
                'preferred_campus': 'City Center Campus',
                'preferred_intake': 'Fall 2026',
                'budget': '₹8 - 10 Lakhs',
                'source': Lead.Source.WHATSAPP,
                'assigned_counsellor': arun,
                'status': Lead.Status.APPLICATION_STARTED,
                'priority': Lead.Priority.HIGH,
                'lead_score': 85,
                'remarks': 'Draft application underway. Scholarship eligibility under review.',
                'created_at': now - datetime.timedelta(days=5),
            },
            {
                'lead_id': '#L-1086',
                'name': 'Karthik Raja',
                'phone': '+91 94432 19876',
                'email': 'karthik.raja@yahoo.com',
                'city': 'Chennai',
                'state': 'Tamil Nadu',
                'qualification': '12th Science',
                'passing_year': 2026,
                'score_percentage': '94.0%',
                'course': 'B.Tech Computer Science',
                'preferred_campus': 'Main Campus',
                'preferred_intake': 'Fall 2026',
                'budget': '₹6 - 8 Lakhs',
                'source': Lead.Source.GOOGLE_ADS,
                'assigned_counsellor': ravi,
                'status': Lead.Status.ADMISSION_CONFIRMED,
                'priority': Lead.Priority.HIGH,
                'lead_score': 98,
                'remarks': 'Seat blocked with initial registration deposit. Documents verified.',
                'created_at': now - datetime.timedelta(days=12),
            },
            {
                'lead_id': '#L-1087',
                'name': 'Meera Sen',
                'phone': '+91 98301 24567',
                'email': 'meera.sen@gmail.com',
                'city': 'Kolkata',
                'state': 'West Bengal',
                'qualification': 'BA English',
                'passing_year': 2025,
                'score_percentage': '74.5%',
                'course': 'B.Des (UI/UX & Digital Media)',
                'preferred_campus': 'Design Hub Campus',
                'preferred_intake': 'Fall 2026',
                'budget': '₹4.5 - 6 Lakhs',
                'source': Lead.Source.INSTAGRAM,
                'assigned_counsellor': sneha,
                'status': Lead.Status.CONTACTED,
                'priority': Lead.Priority.MEDIUM,
                'lead_score': 68,
                'remarks': 'Attended online portfolio workshop. Scheduled campus visit next Saturday.',
                'created_at': now - datetime.timedelta(days=8),
            },
            {
                'lead_id': '#L-1088',
                'name': 'Vikram Singh',
                'phone': '+91 97110 54321',
                'email': 'vikram.singh@gmail.com',
                'city': 'Delhi NCR',
                'state': 'Delhi',
                'qualification': '12th Commerce',
                'passing_year': 2026,
                'score_percentage': '82.0%',
                'course': 'BBA (International Business)',
                'preferred_campus': 'City Center Campus',
                'preferred_intake': 'Fall 2026',
                'budget': '₹4 - 5.5 Lakhs',
                'source': Lead.Source.WALK_IN,
                'assigned_counsellor': arun,
                'status': Lead.Status.NEW,
                'priority': Lead.Priority.MEDIUM,
                'lead_score': 55,
                'remarks': 'Walked in with elder brother for brochure and syllabus details.',
                'created_at': now - datetime.timedelta(hours=4),
            },
            {
                'lead_id': '#L-1089',
                'name': 'Pooja Hegde',
                'phone': '+91 99801 88776',
                'email': 'pooja.hegde@rediffmail.com',
                'city': 'Mangaluru',
                'state': 'Karnataka',
                'qualification': 'BCA',
                'passing_year': 2025,
                'score_percentage': '81.4%',
                'course': 'MCA (Cloud Computing)',
                'preferred_campus': 'Main Campus',
                'preferred_intake': 'Fall 2026',
                'budget': '₹3 - 4.5 Lakhs',
                'source': Lead.Source.EDUCATION_FAIR,
                'assigned_counsellor': priya,
                'status': Lead.Status.FOLLOW_UP,
                'priority': Lead.Priority.HIGH,
                'lead_score': 77,
                'remarks': 'Met at Education Expo. Needs syllabus comparison vs State University.',
                'created_at': now - datetime.timedelta(days=18),
            },
        ]

        created_leads = []
        for ldata in leads_to_create:
            created_at = ldata.pop('created_at')
            lead, _ = Lead.objects.get_or_create(
                lead_id=ldata['lead_id'],
                defaults=ldata
            )
            # Update created_at directly for historical ageing test
            Lead.objects.filter(pk=lead.pk).update(created_at=created_at)
            lead.refresh_from_db()
            created_leads.append(lead)

        self.stdout.write(self.style.SUCCESS(f"Seeded {len(created_leads)} admission leads."))

        # 3. Seed Follow-ups
        today = timezone.now().date()
        for idx, lead in enumerate(created_leads[:4]):
            FollowUp.objects.get_or_create(
                lead=lead,
                counsellor=lead.assigned_counsellor,
                date=today + datetime.timedelta(days=idx - 1), # one yesterday (overdue), one today, two upcoming
                defaults={
                    'time': datetime.time(11 + idx * 2, 30),
                    'type': FollowUp.FollowUpType.CALL if idx % 2 == 0 else FollowUp.FollowUpType.WHATSAPP,
                    'status': FollowUp.FollowUpStatus.PENDING if idx > 0 else FollowUp.FollowUpStatus.COMPLETED,
                    'notes': f"Follow-up regarding admission scholarship and documentation for {lead.name}.",
                    'completed_at': timezone.now() if idx == 0 else None,
                }
            )

        # 4. Seed Activities
        for lead in created_leads:
            Activity.objects.get_or_create(
                lead=lead,
                title='Enquiry Registered',
                defaults={
                    'user': lead.assigned_counsellor,
                    'type': Activity.ActivityType.NOTE,
                    'description': f"Prospective student submitted application inquiry via {lead.source}.",
                    'created_at': lead.created_at,
                }
            )
            if lead.assigned_counsellor:
                Activity.objects.get_or_create(
                    lead=lead,
                    title=f"Assigned to {lead.assigned_counsellor.name}",
                    defaults={
                        'user': lead.assigned_counsellor,
                        'type': Activity.ActivityType.ASSIGNMENT,
                        'description': f"Auto-allocated to {lead.assigned_counsellor.name} ({lead.assigned_counsellor.title}).",
                        'created_at': lead.created_at + datetime.timedelta(minutes=15),
                    }
                )

        self.stdout.write(self.style.SUCCESS('Successfully seeded EduLead CRM data!'))
