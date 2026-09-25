"""
WSGI config for EduLead CRM project.
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edulead_crm.settings')
application = get_wsgi_application()
