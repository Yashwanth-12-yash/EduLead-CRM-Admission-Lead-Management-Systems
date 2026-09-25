import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import {
  seedInitialDataIfEmpty,
  getAllUsers,
  getOrCreateUser,
  getAllLeads,
  getLeadById,
  insertLead,
  updateLeadById,
  deleteLeadById,
  getAllFollowUps,
  insertFollowUp,
  updateFollowUpById,
  getAllActivities,
  insertActivity,
  getAllCourses,
  getAllCampaigns,
  getAllNotifications,
  updateNotificationRead,
  markAllNotificationsRead,
} from './src/db/queries.ts';
import { optionalAuth, requireAuth, AuthRequest } from './src/middleware/auth.ts';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Routes
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// User sync & authentication
app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = req.user!;
    const dbUser = await getOrCreateUser(user.uid, user.email || '', user.name);
    res.json(dbUser);
  } catch (error: any) {
    console.error('User sync error:', error);
    res.status(500).json({ error: error.message || 'Failed to sync user' });
  }
});

// Counsellors / Users
app.get('/api/users', optionalAuth, async (_req, res) => {
  try {
    const data = await getAllUsers();
    res.json(data);
  } catch (error: any) {
    console.error('Get users error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch users' });
  }
});

// Leads
app.get('/api/leads', optionalAuth, async (_req, res) => {
  try {
    const data = await getAllLeads();
    res.json(data);
  } catch (error: any) {
    console.error('Get leads error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch leads' });
  }
});

app.post('/api/leads', optionalAuth, async (req, res) => {
  try {
    const lead = await insertLead(req.body);
    res.status(201).json(lead);
  } catch (error: any) {
    console.error('Create lead error:', error);
    res.status(500).json({ error: error.message || 'Failed to create lead' });
  }
});

app.put('/api/leads/:id', optionalAuth, async (req, res) => {
  try {
    const lead = await updateLeadById(req.params.id, req.body);
    res.json(lead);
  } catch (error: any) {
    console.error('Update lead error:', error);
    res.status(500).json({ error: error.message || 'Failed to update lead' });
  }
});

app.delete('/api/leads/:id', optionalAuth, async (req, res) => {
  try {
    await deleteLeadById(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    console.error('Delete lead error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete lead' });
  }
});

// Follow-ups
app.get('/api/followups', optionalAuth, async (_req, res) => {
  try {
    const data = await getAllFollowUps();
    res.json(data);
  } catch (error: any) {
    console.error('Get followups error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch followups' });
  }
});

app.post('/api/followups', optionalAuth, async (req, res) => {
  try {
    const followup = await insertFollowUp(req.body);
    res.status(201).json(followup);
  } catch (error: any) {
    console.error('Create followup error:', error);
    res.status(500).json({ error: error.message || 'Failed to create followup' });
  }
});

app.put('/api/followups/:id', optionalAuth, async (req, res) => {
  try {
    const followup = await updateFollowUpById(req.params.id, req.body);
    res.json(followup);
  } catch (error: any) {
    console.error('Update followup error:', error);
    res.status(500).json({ error: error.message || 'Failed to update followup' });
  }
});

// Activities
app.get('/api/activities', optionalAuth, async (_req, res) => {
  try {
    const data = await getAllActivities();
    res.json(data);
  } catch (error: any) {
    console.error('Get activities error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch activities' });
  }
});

app.post('/api/activities', optionalAuth, async (req, res) => {
  try {
    const activity = await insertActivity(req.body);
    res.status(201).json(activity);
  } catch (error: any) {
    console.error('Create activity error:', error);
    res.status(500).json({ error: error.message || 'Failed to create activity' });
  }
});

// Courses
app.get('/api/courses', optionalAuth, async (_req, res) => {
  try {
    const data = await getAllCourses();
    res.json(data);
  } catch (error: any) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch courses' });
  }
});

// Campaigns
app.get('/api/campaigns', optionalAuth, async (_req, res) => {
  try {
    const data = await getAllCampaigns();
    res.json(data);
  } catch (error: any) {
    console.error('Get campaigns error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch campaigns' });
  }
});

// Notifications
app.get('/api/notifications', optionalAuth, async (_req, res) => {
  try {
    const data = await getAllNotifications();
    res.json(data);
  } catch (error: any) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch notifications' });
  }
});

app.put('/api/notifications/:id/read', optionalAuth, async (req, res) => {
  try {
    const notification = await updateNotificationRead(req.params.id, true);
    res.json(notification);
  } catch (error: any) {
    console.error('Update notification error:', error);
    res.status(500).json({ error: error.message || 'Failed to update notification' });
  }
});

app.post('/api/notifications/read-all', optionalAuth, async (_req, res) => {
  try {
    await markAllNotificationsRead();
    res.json({ success: true });
  } catch (error: any) {
    console.error('Mark all read error:', error);
    res.status(500).json({ error: error.message || 'Failed to mark notifications read' });
  }
});

async function startServer() {
  // Attempt initial database seeding lazily on startup without blocking
  seedInitialDataIfEmpty().catch((err) => {
    console.warn('Initial seeding encountered an issue:', err.message);
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduLead CRM Server running on port ${PORT}`);
  });
}

startServer();
