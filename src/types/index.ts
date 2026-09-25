export type Role = 'ADMIN' | 'MANAGER' | 'COUNSELLOR';

export type LeadStatus =
  | 'NEW'
  | 'ASSIGNED'
  | 'CONTACTED'
  | 'INTERESTED'
  | 'FOLLOW_UP'
  | 'APPLICATION_STARTED'
  | 'APPLICATION_SUBMITTED'
  | 'ADMISSION_CONFIRMED'
  | 'CONVERTED'
  | 'LOST';

export type LeadPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type LeadSource =
  | 'Website'
  | 'Walk-in'
  | 'Phone Call'
  | 'WhatsApp'
  | 'Instagram'
  | 'Facebook'
  | 'Google Ads'
  | 'Education Fair'
  | 'Referral'
  | 'Campaign';

export type AgeingCategory =
  | 'Fresh'            // 0-3 days
  | 'Attention'        // 4-7 days
  | 'Ageing'           // 8-14 days
  | 'Critical'         // 15-30 days
  | 'Severely Overdue'; // 30+ days

export interface Lead {
  id: string;
  leadId: string; // e.g. #L-1084
  name: string;
  phone: string;
  email: string;
  hasWhatsapp: boolean;
  city: string;
  state: string;
  qualification: string;
  passingYear: number;
  scorePercentage?: string;
  course: string;
  preferredCampus: string;
  preferredIntake: string;
  budget: string;
  source: LeadSource;
  campaign?: string;
  assignedCounsellorId: string | null;
  assignedCounsellorName?: string;
  status: LeadStatus;
  priority: LeadPriority;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  lastContactedAt: string | null;
  nextFollowUpAt: string | null;
  nextFollowUpNote?: string;
  remarks: string;
  leadScore: number; // 0-100
  avatar?: string;
}

export type FollowUpType = 'CALL' | 'WHATSAPP' | 'EMAIL' | 'MEETING' | 'VISIT';
export type FollowUpStatus = 'PENDING' | 'COMPLETED' | 'MISSED' | 'CANCELLED';

export interface FollowUp {
  id: string;
  leadId: string;
  leadName: string;
  leadCourse: string;
  counsellorId: string;
  counsellorName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  type: FollowUpType;
  status: FollowUpStatus;
  notes: string;
  priority: LeadPriority;
  completedAt?: string;
}

export type ActivityType =
  | 'CALL'
  | 'WHATSAPP'
  | 'EMAIL'
  | 'MEETING'
  | 'WALK_IN'
  | 'VISIT'
  | 'COUNSELLING'
  | 'NOTE'
  | 'APPLICATION'
  | 'PAYMENT'
  | 'STATUS_CHANGE'
  | 'ASSIGNMENT';

export interface Activity {
  id: string;
  leadId: string;
  userId: string;
  userName: string;
  type: ActivityType;
  title: string;
  description: string;
  outcome?: string;
  duration?: string;
  attachment?: {
    name: string;
    url?: string;
  };
  createdAt: string;
}

export interface Counsellor {
  id: string;
  name: string;
  email: string;
  role: Role;
  title: string; // e.g. "Sr. Officer", "Officer", "Preferred", "Junior"
  avatar: string;
  activeLeadsCount: number;
  maxCapacity: number; // default 40
  status: 'available' | 'paused' | 'busy';
  conversionRate: number; // e.g. 25.0
  assignedCount: number;
  dialedCount: number;
  enrolledCount: number;
  todayTarget: number;
  todayAchieved: number;
  rank?: number;
  specialization?: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  department: string;
  duration: string;
  fees: string;
  feeAmount: number;
  availableSeats: number;
  totalSeats: number;
  status: 'ACTIVE' | 'INACTIVE';
  totalLeads: number;
  applications: number;
  admissions: number;
  conversionRate: number;
}

export interface Campaign {
  id: string;
  name: string;
  source: LeadSource;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  leads: number;
  applications: number;
  conversions: number;
  status: 'ACTIVE' | 'SCHEDULED' | 'COMPLETED';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type:
    | 'LEAD_ASSIGNED'
    | 'FOLLOWUP_DUE'
    | 'FOLLOWUP_OVERDUE'
    | 'LEAD_CONVERTED'
    | 'APP_SUBMITTED'
    | 'LEAD_REASSIGNED'
    | 'SYSTEM';
  leadId?: string;
  counsellorId?: string;
  createdAt: string;
  isRead: boolean;
}

export interface DashboardMetrics {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  interestedLeads: number;
  followupsToday: number;
  overdueFollowups: number;
  applications: number;
  convertedAdmissions: number;
  conversionRate: number;
  tuitionBooked: number; // in Crores or Lakhs
  avgTurnaroundDays: number;
}
