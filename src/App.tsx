import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { CrmProvider, useCrm } from './context/CrmContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { ManagerDashboard } from './components/dashboard/ManagerDashboard';
import { CounsellorDashboard } from './components/dashboard/CounsellorDashboard';
import { LeadsList } from './components/leads/LeadsList';
import { LeadDetailsModal } from './components/leads/LeadDetailsModal';
import { AddLeadModal } from './components/leads/AddLeadModal';
import { FollowUpsView } from './components/followups/FollowUpsView';
import { LeadAssignmentHub } from './components/assignment/LeadAssignmentHub';
import { ReportsView } from './components/reports/ReportsView';
import { CoursesView } from './components/courses/CoursesView';
import { CampaignsView } from './components/campaigns/CampaignsView';
import { SettingsView } from './components/settings/SettingsView';
import { NotificationsDrawer } from './components/notifications/NotificationsDrawer';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { CsvImportExportModal } from './components/csv/CsvImportExportModal';
import { Toast } from './components/common/Toast';

const MainContent: React.FC = () => {
  const {
    activeTab,
    currentRole,
    isAllocationHubOpen,
    setIsAllocationHubOpen,
  } = useCrm();

  const renderActiveView = () => {
    // If the Allocation Hub modal overlay was triggered
    if (isAllocationHubOpen) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#eaedff]">
            <button
              onClick={() => setIsAllocationHubOpen(false)}
              className="text-xs font-semibold text-[#004ac6] flex items-center gap-1 hover:underline"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Back to Previous View</span>
            </button>
          </div>
          <LeadAssignmentHub />
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return currentRole === 'COUNSELLOR' ? <CounsellorDashboard /> : <ManagerDashboard />;
      case 'leads':
        return <LeadsList />;
      case 'follow-ups':
        return <FollowUpsView />;
      case 'reports':
      case 'pipeline-reports':
        return <ReportsView />;
      case 'counsellors':
        return <LeadAssignmentHub />;
      case 'courses':
        return <CoursesView />;
      case 'campaigns':
        return <CampaignsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return currentRole === 'COUNSELLOR' ? <CounsellorDashboard /> : <ManagerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] flex flex-col">
      <Header />
      <Toast />

      <div className="flex-1 flex max-w-7xl w-full mx-auto pt-16">
        <Sidebar />

        <main className="flex-1 flex flex-col p-4 md:p-6 max-w-4xl mx-auto w-full min-w-0">
          {renderActiveView()}
        </main>
      </div>

      <BottomNav />

      {/* Global Modals & Drawers */}
      <LeadDetailsModal />
      <AddLeadModal />
      <GlobalSearchModal />
      <NotificationsDrawer />
      <CsvImportExportModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CrmProvider>
        <MainContent />
      </CrmProvider>
    </AuthProvider>
  );
}
