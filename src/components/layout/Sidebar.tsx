import React from 'react';
import { useCrm } from '../../context/CrmContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, currentRole, unreadNotificationCount, setIsAddLeadModalOpen, setIsNotificationDrawerOpen } = useCrm();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      roles: ['ADMIN', 'MANAGER', 'COUNSELLOR'],
    },
    {
      id: 'leads',
      label: 'Leads',
      icon: 'group',
      roles: ['ADMIN', 'MANAGER', 'COUNSELLOR'],
    },
    {
      id: 'follow-ups',
      label: 'Follow-ups',
      icon: 'event_upcoming',
      roles: ['ADMIN', 'MANAGER', 'COUNSELLOR'],
    },
    {
      id: 'reports',
      label: 'Pipeline & Reports',
      icon: 'bar_chart',
      roles: ['ADMIN', 'MANAGER'],
    },
    {
      id: 'counsellors',
      label: 'Counsellors & Allocation',
      icon: 'hub',
      roles: ['ADMIN', 'MANAGER'],
    },
    {
      id: 'courses',
      label: 'Courses',
      icon: 'school',
      roles: ['ADMIN', 'MANAGER'],
    },
    {
      id: 'campaigns',
      label: 'Campaigns',
      icon: 'campaign',
      roles: ['ADMIN', 'MANAGER'],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'settings',
      roles: ['ADMIN'],
    },
  ];

  const visibleNav = navItems.filter((item) => item.roles.includes(currentRole));

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#eaedff] shrink-0 sticky top-16 h-[calc(100vh-4rem)] p-4 select-none">
      {/* Quick Ingestion CTA */}
      <div className="mb-4">
        <button
          onClick={() => setIsAddLeadModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-[#004ac6] text-white py-2.5 px-4 rounded-xl font-semibold text-sm shadow-sm hover:bg-[#003ea8] active:scale-[0.99] transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          <span>New Lead Intake</span>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
        {visibleNav.map((item) => {
          const isActive = activeTab === item.id || (item.id === 'reports' && activeTab === 'pipeline-reports');
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all text-left ${
                isActive
                  ? 'bg-[#eaedff] text-[#004ac6] font-semibold shadow-xs'
                  : 'text-[#434655] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.id === 'notifications' && unreadNotificationCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ba1a1a] text-white">
                  {unreadNotificationCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Quick Help & Live Status */}
      <div className="pt-3 border-t border-[#f2f3ff] space-y-2">
        <button
          onClick={() => setIsNotificationDrawerOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-[#434655] hover:bg-[#f2f3ff] transition-colors"
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">notifications</span>
            <span>Alerts & Notifications</span>
          </span>
          {unreadNotificationCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#ba1a1a] text-white text-[10px] font-bold flex items-center justify-center">
              {unreadNotificationCount}
            </span>
          )}
        </button>

        <div className="bg-[#f2f3ff] p-2.5 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs text-[#004ac6] font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>AY 2026-27 Active</span>
          </div>
          <p className="text-[11px] text-[#434655] leading-relaxed">
            Fall Intake Admissions Radar synced across all 10 channels.
          </p>
        </div>
      </div>
    </aside>
  );
};
