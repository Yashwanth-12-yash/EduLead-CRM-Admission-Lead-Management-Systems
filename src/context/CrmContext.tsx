import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  Lead,
  FollowUp,
  Activity,
  Counsellor,
  Course,
  Campaign,
  NotificationItem,
  Role,
  DashboardMetrics,
} from '../types';
import { crmService, calculateLeadAge, getAgeingCategory } from '../services/crmService';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

interface CrmContextType {
  // Current user & role
  currentUser: Counsellor;
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  switchUser: (counsellorId: string) => void;

  // Active navigation view
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Data collections
  leads: Lead[];
  followUps: FollowUp[];
  activities: Activity[];
  counsellors: Counsellor[];
  courses: Course[];
  campaigns: Campaign[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;

  // Metrics
  metrics: DashboardMetrics;
  insights: string[];

  // Lead Details Modal
  selectedLead: Lead | null;
  setSelectedLead: (lead: Lead | null) => void;
  openLeadDetails: (leadId: string) => void;
  closeLeadDetails: () => void;

  // Modals & Drawers
  isAddLeadModalOpen: boolean;
  setIsAddLeadModalOpen: (open: boolean) => void;
  isQuickLogModalOpen: boolean;
  setIsQuickLogModalOpen: (open: boolean) => void;
  isScheduleFollowUpModalOpen: boolean;
  setIsScheduleFollowUpModalOpen: (open: boolean) => void;
  isCsvModalOpen: boolean;
  setIsCsvModalOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  isAllocationHubOpen: boolean;
  setIsAllocationHubOpen: (open: boolean) => void;

  // Search & Global filtering
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;

  // Toast notifications
  toast: ToastMessage | null;
  showToast: (title: string, message?: string, type?: ToastMessage['type']) => void;
  hideToast: () => void;

  // CRM Operations
  addLead: (leadData: Parameters<typeof crmService.addLead>[0]) => Lead;
  updateLead: (id: string, updates: Partial<Lead>) => Lead | undefined;
  deleteLead: (id: string) => boolean;
  bulkAssignLeads: (leadIds: string[], counsellorId: string) => void;
  completeFollowUp: (id: string, outcome?: string) => void;
  rescheduleFollowUp: (id: string, date: string, time: string, notes?: string) => void;
  addFollowUp: (data: Parameters<typeof crmService.addFollowUp>[0]) => FollowUp;
  addActivity: (data: Parameters<typeof crmService.addActivity>[0]) => Activity;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  resetAllData: () => void;
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

export const CrmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [version, setVersion] = useState(0);

  // Default user is Priya Sharma (Senior Officer)
  const [currentCounsellorId, setCurrentCounsellorId] = useState<string>('counsellor-1');
  const [currentRole, setCurrentRole] = useState<Role>('MANAGER'); // Default Manager view with quick toggle

  // Active navigation view
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Selected Lead for details view
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Modal visibility states
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [isQuickLogModalOpen, setIsQuickLogModalOpen] = useState(false);
  const [isScheduleFollowUpModalOpen, setIsScheduleFollowUpModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isAllocationHubOpen, setIsAllocationHubOpen] = useState(false);

  // Search
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Toast
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    const unsubscribe = crmService.subscribe(() => {
      setVersion((v) => v + 1);
    });
    return unsubscribe;
  }, []);

  const counsellors = useMemo(() => crmService.getCounsellors(), [version]);
  const leads = useMemo(() => crmService.getLeads(), [version]);
  const followUps = useMemo(() => crmService.getFollowUps(), [version]);
  const activities = useMemo(() => crmService.getActivities(), [version]);
  const courses = useMemo(() => crmService.getCourses(), [version]);
  const campaigns = useMemo(() => crmService.getCampaigns(), [version]);
  const notifications = useMemo(() => crmService.getNotifications(), [version]);

  const currentUser = useMemo(() => {
    return counsellors.find((c) => c.id === currentCounsellorId) || counsellors[0];
  }, [counsellors, currentCounsellorId]);

  const metrics = useMemo(() => {
    // If role is COUNSELLOR, show their personal metrics
    return crmService.getDashboardMetrics(currentRole === 'COUNSELLOR' ? currentUser.id : undefined);
  }, [leads, followUps, currentRole, currentUser.id, version]);

  const insights = useMemo(() => crmService.generateInsights(), [version]);

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  // Keep selectedLead in sync when leads change
  useEffect(() => {
    if (selectedLead) {
      const refreshed = leads.find((l) => l.id === selectedLead.id);
      if (refreshed) {
        setSelectedLead(refreshed);
      }
    }
  }, [leads]);

  const openLeadDetails = (leadId: string) => {
    const l = crmService.getLeadById(leadId);
    if (l) {
      setSelectedLead(l);
    }
  };

  const closeLeadDetails = () => {
    setSelectedLead(null);
  };

  const showToast = (title: string, message?: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}`;
    setToast({ id, title, message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4000);
  };

  const hideToast = () => {
    setToast(null);
  };

  const switchUser = (counsellorId: string) => {
    setCurrentCounsellorId(counsellorId);
    const c = counsellors.find((item) => item.id === counsellorId);
    if (c) {
      showToast(`Switched user to ${c.name}`, `Role: ${c.title}`, 'info');
    }
  };

  // Keyboard shortcut listener for Global Search (e.g. '/')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsSearchModalOpen(true);
      } else if (e.key === 'Escape') {
        setIsSearchModalOpen(false);
        setIsNotificationDrawerOpen(false);
        setIsAddLeadModalOpen(false);
        setIsQuickLogModalOpen(false);
        setIsScheduleFollowUpModalOpen(false);
        setIsCsvModalOpen(false);
        setIsAllocationHubOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const value = {
    currentUser,
    currentRole,
    setCurrentRole,
    switchUser,
    activeTab,
    setActiveTab,
    leads,
    followUps,
    activities,
    counsellors,
    courses,
    campaigns,
    notifications,
    unreadNotificationCount,
    metrics,
    insights,
    selectedLead,
    setSelectedLead,
    openLeadDetails,
    closeLeadDetails,
    isAddLeadModalOpen,
    setIsAddLeadModalOpen,
    isQuickLogModalOpen,
    setIsQuickLogModalOpen,
    isScheduleFollowUpModalOpen,
    setIsScheduleFollowUpModalOpen,
    isCsvModalOpen,
    setIsCsvModalOpen,
    isSearchModalOpen,
    setIsSearchModalOpen,
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    isAllocationHubOpen,
    setIsAllocationHubOpen,
    globalSearchQuery,
    setGlobalSearchQuery,
    toast,
    showToast,
    hideToast,
    addLead: (data: Parameters<typeof crmService.addLead>[0]) => {
      const lead = crmService.addLead(data);
      showToast('Lead Created Successfully', `${lead.name} (${lead.leadId}) recorded.`, 'success');
      return lead;
    },
    updateLead: (id: string, updates: Partial<Lead>) => {
      const res = crmService.updateLead(id, updates, currentUser.name);
      if (res) {
        showToast('Lead Updated', `${res.name} details saved.`, 'info');
      }
      return res;
    },
    deleteLead: (id: string) => {
      const success = crmService.deleteLead(id);
      if (success) {
        showToast('Lead Removed', 'Lead record removed from CRM.', 'warning');
      }
      return success;
    },
    bulkAssignLeads: (leadIds: string[], counsellorId: string) => {
      crmService.bulkAssignLeads(leadIds, counsellorId, currentUser.name);
      const c = crmService.getCounsellorById(counsellorId);
      showToast('Batch Allocated!', `${leadIds.length} leads assigned to ${c?.name || 'Counselor'}.`, 'success');
    },
    completeFollowUp: (id: string, outcome?: string) => {
      crmService.completeFollowUp(id, outcome, currentUser.name);
      showToast('Follow-up Marked Complete', 'Logged to student engagement timeline.', 'success');
    },
    rescheduleFollowUp: (id: string, date: string, time: string, notes?: string) => {
      crmService.rescheduleFollowUp(id, date, time, notes);
      showToast('Follow-up Rescheduled', `Updated to ${date} at ${time}.`, 'info');
    },
    addFollowUp: (data: Parameters<typeof crmService.addFollowUp>[0]) => {
      const fu = crmService.addFollowUp(data);
      showToast('Follow-up Scheduled', `Reminder set for ${fu.date} at ${fu.time}.`, 'success');
      return fu;
    },
    addActivity: (data: Parameters<typeof crmService.addActivity>[0]) => {
      const act = crmService.addActivity(data);
      showToast('Interaction Recorded', act.title, 'success');
      return act;
    },
    markNotificationAsRead: (id: string) => {
      crmService.markNotificationAsRead(id);
    },
    markAllNotificationsAsRead: () => {
      crmService.markAllNotificationsAsRead();
      showToast('All Notifications Cleared', undefined, 'info');
    },
    resetAllData: () => {
      crmService.resetToDefaults();
      showToast('Database Reset', 'Sample institution data refreshed.', 'info');
    },
  };

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
};

export const useCrm = () => {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error('useCrm must be used within a CrmProvider');
  }
  return context;
};
