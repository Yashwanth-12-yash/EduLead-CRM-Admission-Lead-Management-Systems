import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentRole, setIsAddLeadModalOpen, setIsAllocationHubOpen, unreadNotificationCount, setIsNotificationDrawerOpen } = useCrm();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Drawer Menu for extra items */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#131b2e]/40 backdrop-blur-xs flex items-end justify-center" onClick={() => setIsMenuOpen(false)}>
          <div
            className="w-full max-w-md bg-white rounded-t-2xl p-4 shadow-2xl flex flex-col gap-3 animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-[#c3c6d7] rounded-full mx-auto mb-1"></div>
            <div className="flex items-center justify-between pb-2 border-b border-[#f2f3ff]">
              <span className="font-semibold text-base text-[#131b2e]">Operations & Modules</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#434655]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  setActiveTab('counsellors');
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#f2f3ff] text-left hover:bg-[#eaedff] transition-colors"
              >
                <span className="material-symbols-outlined text-[20px] text-[#004ac6]">hub</span>
                <div>
                  <span className="font-semibold text-xs text-[#131b2e] block">Counsellor Workload</span>
                  <span className="text-[10px] text-[#434655]">4 desks active</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('courses');
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#f2f3ff] text-left hover:bg-[#eaedff] transition-colors"
              >
                <span className="material-symbols-outlined text-[20px] text-[#712ae2]">school</span>
                <div>
                  <span className="font-semibold text-xs text-[#131b2e] block">Academic Courses</span>
                  <span className="text-[10px] text-[#434655]">6 programs</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('campaigns');
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#f2f3ff] text-left hover:bg-[#eaedff] transition-colors"
              >
                <span className="material-symbols-outlined text-[20px] text-[#005d73]">campaign</span>
                <div>
                  <span className="font-semibold text-xs text-[#131b2e] block">Admissions Campaigns</span>
                  <span className="text-[10px] text-[#434655]">5 active ROI</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsNotificationDrawerOpen(true);
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#f2f3ff] text-left hover:bg-[#eaedff] transition-colors relative"
              >
                <span className="material-symbols-outlined text-[20px] text-[#ba1a1a]">notifications</span>
                <div>
                  <span className="font-semibold text-xs text-[#131b2e] block">Alerts & Sla</span>
                  <span className="text-[10px] text-[#434655]">{unreadNotificationCount} unread</span>
                </div>
              </button>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  setIsAddLeadModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#004ac6] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                <span>+ New Lead</span>
              </button>
              <button
                onClick={() => {
                  setIsAllocationHubOpen(true);
                  setIsMenuOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#eaedff] text-[#004ac6] font-semibold text-xs flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">assignment_ind</span>
                <span>Bulk Allocation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Nav Bar matching Stitch design */}
      <nav className="lg:hidden fixed bottom-0 w-full z-40 pb-safe bg-white/95 backdrop-blur-xl border-t border-[#eaedff] shadow-[0_-2px_12px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around h-16 px-1 max-w-lg mx-auto">
          {/* Dashboard */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] transition-colors ${
              activeTab === 'dashboard'
                ? 'text-[#004ac6] font-semibold'
                : 'text-[#434655] hover:text-[#131b2e]'
            }`}
            type="button"
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={activeTab === 'dashboard' ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              dashboard
            </span>
            <span className="text-[11px] mt-0.5 truncate">Dashboard</span>
          </button>

          {/* Leads */}
          <button
            onClick={() => setActiveTab('leads')}
            className={`flex-1 flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] transition-colors ${
              activeTab === 'leads'
                ? 'text-[#004ac6] font-semibold'
                : 'text-[#434655] hover:text-[#131b2e]'
            }`}
            type="button"
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={activeTab === 'leads' ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              group
            </span>
            <span className="text-[11px] mt-0.5 truncate">Leads</span>
          </button>

          {/* Follow-ups */}
          <button
            onClick={() => setActiveTab('follow-ups')}
            className={`flex-1 flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] transition-colors relative ${
              activeTab === 'follow-ups'
                ? 'text-[#004ac6] font-semibold'
                : 'text-[#434655] hover:text-[#131b2e]'
            }`}
            type="button"
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={activeTab === 'follow-ups' ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              event_upcoming
            </span>
            <span className="text-[11px] mt-0.5 truncate">Follow-ups</span>
          </button>

          {/* Pipeline & Reports */}
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] transition-colors ${
              activeTab === 'reports' || activeTab === 'pipeline-reports'
                ? 'text-[#004ac6] font-semibold'
                : 'text-[#434655] hover:text-[#131b2e]'
            }`}
            type="button"
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={activeTab === 'reports' || activeTab === 'pipeline-reports' ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              filter_alt
            </span>
            <span className="text-[11px] mt-0.5 truncate">Pipeline</span>
          </button>

          {/* Menu Drawer toggle */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex-1 flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] text-[#434655] hover:text-[#131b2e] transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
            <span className="text-[11px] mt-0.5 truncate">Menu</span>
          </button>
        </div>
      </nav>
    </>
  );
};
