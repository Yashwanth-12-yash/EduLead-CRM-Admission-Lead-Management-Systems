"""
ASGI config for EduLead CRM project.
"""

import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edulead_crm.settings')
application = get_asgi_application()
