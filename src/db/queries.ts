import { db } from './index.ts';
import { users, leads, courses, campaigns, followUps, activities, notifications } from './schema.ts';
import { eq, desc } from 'drizzle-orm';
import {
  INITIAL_COUNSELLORS,
  INITIAL_COURSES,
  INITIAL_CAMPAIGNS,
  INITIAL_LEADS,
  INITIAL_FOLLOWUPS,
  INITIAL_ACTIVITIES,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData.ts';

// User helpers
export async function getOrCreateUser(uid: string, email: string, name?: string) {
  try {
    const existing = await db.select().from(users).where(eq(users.uid, uid));
    if (existing.length > 0) {
      return existing[0];
    }

    // Check if matching email exists among initial counsellors
    const existingByEmail = await db.select().from(users).where(eq(users.email, email));
    if (existingByEmail.length > 0) {
      const updated = await db
        .update(users)
        .set({ uid, updatedAt: new Date() })
        .where(eq(users.id, existingByEmail[0].id))
        .returning();
      return updated[0];
    }

    const userName = name || email.split('@')[0];
    const inserted = await db
      .insert(users)
      .values({
        id: `user-${Date.now()}`,
        uid,
        email,
        name: userName,
        role: 'COUNSELLOR',
        title: 'Officer',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=004ac6&color=fff`,
      })
      .returning();

    return inserted[0];
  } catch (error) {
    console.error('getOrCreateUser error:', error);
    throw new Error('Database operation failed for user', { cause: error });
  }
}

export async function getAllUsers() {
  try {
    return await db.select().from(users);
  } catch (error) {
    console.error('getAllUsers error:', error);
    throw new Error('Failed to retrieve users', { cause: error });
  }
}

// Leads helpers
export async function getAllLeads() {
  try {
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  } catch (error) {
    console.error('getAllLeads error:', error);
    throw new Error('Failed to retrieve leads', { cause: error });
  }
}

export async function getLeadById(id: string) {
  try {
    const result = await db.select().from(leads).where(eq(leads.id, id));
    return result[0];
  } catch (error) {
    console.error('getLeadById error:', error);
    throw new Error('Failed to retrieve lead', { cause: error });
  }
}

export async function insertLead(data: typeof leads.$inferInsert) {
  try {
    const result = await db.insert(leads).values(data).returning();
    return result[0];
  } catch (error) {
    console.error('insertLead error:', error);
    throw new Error('Failed to insert lead', { cause: error });
  }
}

export async function updateLeadById(id: string, updates: Partial<typeof leads.$inferInsert>) {
  try {
    const result = await db.update(leads).set(updates).where(eq(leads.id, id)).returning();
    return result[0];
  } catch (error) {
    console.error('updateLeadById error:', error);
    throw new Error('Failed to update lead', { cause: error });
  }
}

export async function deleteLeadById(id: string) {
  try {
    await db.delete(leads).where(eq(leads.id, id));
    return true;
  } catch (error) {
    console.error('deleteLeadById error:', error);
    throw new Error('Failed to delete lead', { cause: error });
  }
}

// FollowUps helpers
export async function getAllFollowUps() {
  try {
    return await db.select().from(followUps).orderBy(desc(followUps.date));
  } catch (error) {
    console.error('getAllFollowUps error:', error);
    throw new Error('Failed to retrieve follow ups', { cause: error });
  }
}

export async function insertFollowUp(data: typeof followUps.$inferInsert) {
  try {
    const result = await db.insert(followUps).values(data).returning();
    return result[0];
  } catch (error) {
    console.error('insertFollowUp error:', error);
    throw new Error('Failed to create follow up', { cause: error });
  }
}

export async function updateFollowUpById(id: string, updates: Partial<typeof followUps.$inferInsert>) {
  try {
    const result = await db.update(followUps).set(updates).where(eq(followUps.id, id)).returning();
    return result[0];
  } catch (error) {
    console.error('updateFollowUpById error:', error);
    throw new Error('Failed to update follow up', { cause: error });
  }
}

// Activities helpers
export async function getAllActivities() {
  try {
    return await db.select().from(activities).orderBy(desc(activities.createdAt));
  } catch (error) {
    console.error('getAllActivities error:', error);
    throw new Error('Failed to retrieve activities', { cause: error });
  }
}

export async function insertActivity(data: typeof activities.$inferInsert) {
  try {
    const result = await db.insert(activities).values(data).returning();
    return result[0];
  } catch (error) {
    console.error('insertActivity error:', error);
    throw new Error('Failed to insert activity', { cause: error });
  }
}

// Courses helpers
export async function getAllCourses() {
  try {
    return await db.select().from(courses);
  } catch (error) {
    console.error('getAllCourses error:', error);
    throw new Error('Failed to retrieve courses', { cause: error });
  }
}

// Campaigns helpers
export async function getAllCampaigns() {
  try {
    return await db.select().from(campaigns);
  } catch (error) {
    console.error('getAllCampaigns error:', error);
    throw new Error('Failed to retrieve campaigns', { cause: error });
  }
}

// Notifications helpers
export async function getAllNotifications() {
  try {
    return await db.select().from(notifications).orderBy(desc(notifications.createdAt));
  } catch (error) {
    console.error('getAllNotifications error:', error);
    throw new Error('Failed to retrieve notifications', { cause: error });
  }
}

export async function updateNotificationRead(id: string, isRead: boolean) {
  try {
    const result = await db.update(notifications).set({ isRead }).where(eq(notifications.id, id)).returning();
    return result[0];
  } catch (error) {
    console.error('updateNotificationRead error:', error);
    throw new Error('Failed to update notification', { cause: error });
  }
}

export async function markAllNotificationsRead() {
  try {
    await db.update(notifications).set({ isRead: true });
    return true;
  } catch (error) {
    console.error('markAllNotificationsRead error:', error);
    throw new Error('Failed to mark notifications read', { cause: error });
  }
}

// Seed initial data if database is empty
export async function seedInitialDataIfEmpty() {
  try {
    const existingUsers = await db.select().from(users);
    if (existingUsers.length === 0) {
      console.log('Seeding initial Cloud SQL users...');
      for (const c of INITIAL_COUNSELLORS) {
        await db.insert(users).values({
          id: c.id,
          name: c.name,
          email: c.email,
          role: c.role,
          title: c.title,
          avatar: c.avatar,
          activeLeadsCount: c.activeLeadsCount,
          maxCapacity: c.maxCapacity,
          status: c.status,
          conversionRate: c.conversionRate,
          assignedCount: c.assignedCount,
          dialedCount: c.dialedCount,
          enrolledCount: c.enrolledCount,
          todayTarget: c.todayTarget,
          todayAchieved: c.todayAchieved,
          rank: c.rank,
          specialization: c.specialization,
        });
      }
    }

    const existingCourses = await db.select().from(courses);
    if (existingCourses.length === 0) {
      console.log('Seeding initial Cloud SQL courses...');
      for (const cr of INITIAL_COURSES) {
        await db.insert(courses).values({
          id: cr.id,
          name: cr.name,
          code: cr.code,
          department: cr.department,
          duration: cr.duration,
          fees: cr.fees,
          feeAmount: cr.feeAmount,
          availableSeats: cr.availableSeats,
          totalSeats: cr.totalSeats,
          status: cr.status,
          totalLeads: cr.totalLeads,
          applications: cr.applications,
          admissions: cr.admissions,
          conversionRate: cr.conversionRate,
        });
      }
    }

    const existingCampaigns = await db.select().from(campaigns);
    if (existingCampaigns.length === 0) {
      console.log('Seeding initial Cloud SQL campaigns...');
      for (const cp of INITIAL_CAMPAIGNS) {
        await db.insert(campaigns).values({
          id: cp.id,
          name: cp.name,
          source: cp.source,
          startDate: cp.startDate,
          endDate: cp.endDate,
          budget: cp.budget,
          spent: cp.spent,
          leads: cp.leads,
          applications: cp.applications,
          conversions: cp.conversions,
          status: cp.status,
        });
      }
    }

    const existingLeads = await db.select().from(leads);
    if (existingLeads.length === 0) {
      console.log('Seeding initial Cloud SQL leads...');
      for (const l of INITIAL_LEADS) {
        await db.insert(leads).values({
          id: l.id,
          leadId: l.leadId,
          name: l.name,
          phone: l.phone,
          email: l.email,
          hasWhatsapp: l.hasWhatsapp,
          city: l.city,
          state: l.state,
          qualification: l.qualification,
          passingYear: l.passingYear,
          scorePercentage: l.scorePercentage,
          course: l.course,
          preferredCampus: l.preferredCampus,
          preferredIntake: l.preferredIntake,
          budget: l.budget,
          source: l.source,
          campaign: l.campaign,
          assignedCounsellorId: l.assignedCounsellorId,
          assignedCounsellorName: l.assignedCounsellorName,
          status: l.status,
          priority: l.priority,
          createdAt: l.createdAt,
          updatedAt: l.updatedAt,
          lastContactedAt: l.lastContactedAt,
          nextFollowUpAt: l.nextFollowUpAt,
          nextFollowUpNote: l.nextFollowUpNote,
          remarks: l.remarks,
          leadScore: l.leadScore,
          avatar: l.avatar,
        });
      }
    }

    const existingFollowups = await db.select().from(followUps);
    if (existingFollowups.length === 0) {
      console.log('Seeding initial Cloud SQL followups...');
      for (const f of INITIAL_FOLLOWUPS) {
        await db.insert(followUps).values({
          id: f.id,
          leadId: f.leadId,
          leadName: f.leadName,
          leadCourse: f.leadCourse,
          counsellorId: f.counsellorId,
          counsellorName: f.counsellorName,
          date: f.date,
          time: f.time,
          type: f.type,
          status: f.status,
          notes: f.notes,
          priority: f.priority,
          completedAt: f.completedAt,
        });
      }
    }

    const existingActivities = await db.select().from(activities);
    if (existingActivities.length === 0) {
      console.log('Seeding initial Cloud SQL activities...');
      for (const a of INITIAL_ACTIVITIES) {
        await db.insert(activities).values({
          id: a.id,
          leadId: a.leadId,
          userId: a.userId,
          userName: a.userName,
          type: a.type,
          title: a.title,
          description: a.description,
          outcome: a.outcome,
          duration: a.duration,
          attachmentName: a.attachment?.name,
          attachmentUrl: a.attachment?.url,
          createdAt: a.createdAt,
        });
      }
    }

    const existingNotifications = await db.select().from(notifications);
    if (existingNotifications.length === 0) {
      console.log('Seeding initial Cloud SQL notifications...');
      for (const n of INITIAL_NOTIFICATIONS) {
        await db.insert(notifications).values({
          id: n.id,
          title: n.title,
          message: n.message,
          type: n.type,
          leadId: n.leadId,
          counsellorId: n.counsellorId,
          isRead: n.isRead,
          createdAt: n.createdAt,
        });
      }
    }
  } catch (error) {
    console.error('Seed initial data error (non-fatal):', error);
  }
}
