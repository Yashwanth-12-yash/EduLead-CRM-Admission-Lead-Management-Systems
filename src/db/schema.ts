import { pgTable, text, integer, timestamp, boolean, doublePrecision } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table (mapped with Firebase Auth UID & CRM profile)
export const users = pgTable('users', {
  id: text('id').primaryKey(), // Using counsellor/user ID or Firebase UID
  uid: text('uid').unique(), // Firebase Auth UID
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').notNull().default('COUNSELLOR'), // ADMIN | MANAGER | COUNSELLOR
  title: text('title').default('Officer'),
  avatar: text('avatar'),
  phone: text('phone'),
  specialization: text('specialization'),
  activeLeadsCount: integer('active_leads_count').default(0),
  maxCapacity: integer('max_capacity').default(40),
  status: text('status').default('available'), // available | paused | busy
  conversionRate: doublePrecision('conversion_rate').default(0),
  assignedCount: integer('assigned_count').default(0),
  dialedCount: integer('dialed_count').default(0),
  enrolledCount: integer('enrolled_count').default(0),
  todayTarget: integer('today_target').default(8),
  todayAchieved: integer('today_achieved').default(0),
  rank: integer('rank').default(1),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Courses table
export const courses = pgTable('courses', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  code: text('code').notNull(),
  department: text('department').notNull(),
  duration: text('duration').notNull(),
  fees: text('fees').notNull(),
  feeAmount: integer('fee_amount').notNull().default(0),
  availableSeats: integer('available_seats').notNull().default(0),
  totalSeats: integer('total_seats').notNull().default(0),
  status: text('status').notNull().default('ACTIVE'),
  totalLeads: integer('total_leads').default(0),
  applications: integer('applications').default(0),
  admissions: integer('admissions').default(0),
  conversionRate: doublePrecision('conversion_rate').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Campaigns table
export const campaigns = pgTable('campaigns', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  source: text('source').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  budget: integer('budget').notNull().default(0),
  spent: integer('spent').notNull().default(0),
  leads: integer('leads').notNull().default(0),
  applications: integer('applications').notNull().default(0),
  conversions: integer('conversions').notNull().default(0),
  status: text('status').notNull().default('ACTIVE'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Leads table
export const leads = pgTable('leads', {
  id: text('id').primaryKey(),
  leadId: text('lead_id').notNull(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  hasWhatsapp: boolean('has_whatsapp').default(false),
  city: text('city').notNull(),
  state: text('state').notNull(),
  qualification: text('qualification').notNull(),
  passingYear: integer('passing_year').notNull(),
  scorePercentage: text('score_percentage'),
  course: text('course').notNull(),
  preferredCampus: text('preferred_campus').notNull(),
  preferredIntake: text('preferred_intake').notNull(),
  budget: text('budget').notNull(),
  source: text('source').notNull(),
  campaign: text('campaign'),
  assignedCounsellorId: text('assigned_counsellor_id').references(() => users.id),
  assignedCounsellorName: text('assigned_counsellor_name'),
  status: text('status').notNull().default('NEW'),
  priority: text('priority').notNull().default('MEDIUM'),
  createdAt: text('created_at').notNull(), // ISO string format
  updatedAt: text('updated_at').notNull(),
  lastContactedAt: text('last_contacted_at'),
  nextFollowUpAt: text('next_follow_up_at'),
  nextFollowUpNote: text('next_follow_up_note'),
  remarks: text('remarks').notNull().default(''),
  leadScore: integer('lead_score').notNull().default(50),
  avatar: text('avatar'),
});

// FollowUps table
export const followUps = pgTable('follow_ups', {
  id: text('id').primaryKey(),
  leadId: text('lead_id').notNull().references(() => leads.id, { onDelete: 'cascade' }),
  leadName: text('lead_name').notNull(),
  leadCourse: text('lead_course').notNull(),
  counsellorId: text('counsellor_id').notNull().references(() => users.id),
  counsellorName: text('counsellor_name').notNull(),
  date: text('date').notNull(),
  time: text('time').notNull(),
  type: text('type').notNull(),
  status: text('status').notNull().default('PENDING'),
  notes: text('notes').notNull(),
  priority: text('priority').notNull().default('MEDIUM'),
  completedAt: text('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Activities table
export const activities = pgTable('activities', {
  id: text('id').primaryKey(),
  leadId: text('lead_id').notNull().references(() => leads.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull(),
  userName: text('user_name').notNull(),
  type: text('type').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  outcome: text('outcome'),
  duration: text('duration'),
  attachmentName: text('attachment_name'),
  attachmentUrl: text('attachment_url'),
  createdAt: text('created_at').notNull(),
});

// Notifications table
export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull(),
  leadId: text('lead_id'),
  counsellorId: text('counsellor_id'),
  isRead: boolean('is_read').notNull().default(false),
  createdAt: text('created_at').notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  leads: many(leads),
  followUps: many(followUps),
}));

export const leadsRelations = relations(leads, ({ one, many }) => ({
  counsellor: one(users, {
    fields: [leads.assignedCounsellorId],
    references: [users.id],
  }),
  followUps: many(followUps),
  activities: many(activities),
}));

export const followUpsRelations = relations(followUps, ({ one }) => ({
  lead: one(leads, {
    fields: [followUps.leadId],
    references: [leads.id],
  }),
  counsellor: one(users, {
    fields: [followUps.counsellorId],
    references: [users.id],
  }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  lead: one(leads, {
    fields: [activities.leadId],
    references: [leads.id],
  }),
}));
