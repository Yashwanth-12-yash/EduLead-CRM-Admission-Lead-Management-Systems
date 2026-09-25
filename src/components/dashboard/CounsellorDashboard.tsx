import React from 'react';
import { useCrm } from '../../context/CrmContext';

export const CounsellorDashboard: React.FC = () => {
  const {
    currentUser,
    leads,
    followUps,
    openLeadDetails,
    setIsAddLeadModalOpen,
    setIsQuickLogModalOpen,
    completeFollowUp,
    rescheduleFollowUp,
    showToast,
  } = useCrm();

  // Filter leads assigned specifically to this counsellor
  const myLeads = leads.filter((l) => l.assignedCounsellorId === currentUser.id);
  const myFollowUps = followUps.filter((f) => f.counsellorId === currentUser.id);

  const newCount = myLeads.filter((l) => l.status === 'NEW').length || 4;
  const contactedCount = myLeads.filter((l) => l.status === 'CONTACTED').length || 10;
  const interestedCount = myLeads.filter((l) => l.status === 'INTERESTED').length || 8;
  const appsCount = myLeads.filter((l) => l.status === 'APPLICATION_STARTED' || l.status === 'APPLICATION_SUBMITTED').length || 6;
  const enrolledCount = myLeads.filter((l) => l.status === 'ADMISSION_CONFIRMED' || l.status === 'CONVERTED').length || 8;

  const targetProgress = Math.round((currentUser.todayAchieved / currentUser.todayTarget) * 100);

  return (
    <div className="flex flex-col w-full pb-24 space-y-4">
      {/* Welcome Greeting & Daily Target Motivation Card */}
      <div className="relative overflow-hidden bg-[#004ac6] text-white rounded-xl shadow-md p-4">
        <div className="absolute -right-6 -bottom-8 w-32 h-32 bg-[#2563eb]/30 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/15 text-white text-[11px] font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> {currentUser.title} Active
            </span>
            <h2 className="text-xl md:text-2xl font-bold mt-1 text-white">
              Welcome back, {currentUser.name.split(' ')[0]}! 👋
            </h2>
            <p className="text-xs text-[#dbe1ff] opacity-90 mt-0.5">
              You're just {currentUser.todayTarget - currentUser.todayAchieved} admissions away from daily star badge.
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[28px] text-[#dbe1ff]">auto_awesome</span>
          </div>
        </div>

        {/* Target Progress Indicator */}
        <div className="mt-4 pt-2 bg-white/10 rounded-lg p-2.5 relative z-10">
          <div className="flex justify-between items-center text-white mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#b7eaff]">flag</span>
              <span className="text-xs font-semibold">Today's Target</span>
            </div>
            <div className="text-xs text-right">
              <span className="text-white font-bold">{currentUser.todayAchieved}</span>
              <span className="text-white/70"> / {currentUser.todayTarget} Admissions</span>
              <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                {targetProgress}%
              </span>
            </div>
          </div>
          <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-[#b7eaff] h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${Math.min(targetProgress, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Key Personal Counselor Metrics (2x2 Grid) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card 1: Active Leads */}
        <div className="bg-white rounded-xl p-4 shadow-xs border border-[#eaedff] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#434655]">Active Leads</span>
            <div className="w-7 h-7 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#004ac6]">
              <span className="material-symbols-outlined text-[18px]">contacts</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-[#131b2e] tabular-nums">{currentUser.activeLeadsCount}</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#dbe1ff] text-[#003ea8] text-[11px] font-semibold">
                4 Fresh Today
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Follow-ups Today */}
        <div className="bg-white rounded-xl p-4 shadow-xs border border-[#eaedff] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#434655]">Follow-ups</span>
            <div className="w-7 h-7 rounded-lg bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a]">
              <span className="material-symbols-outlined text-[18px]">notification_important</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-[#131b2e] tabular-nums">12</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] text-[11px] font-bold">
                2 Overdue
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Calls Logged */}
        <div className="bg-white rounded-xl p-4 shadow-xs border border-[#eaedff] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#434655]">Calls Logged</span>
            <div className="w-7 h-7 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#005d73]">
              <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#131b2e] tabular-nums">{currentUser.dialedCount}</span>
              <span className="text-xs text-[#737686]">/ 25 daily</span>
            </div>
            <div className="w-full bg-[#eaedff] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#005d73] h-full rounded-full"
                style={{ width: `${Math.round((currentUser.dialedCount / 25) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card 4: Month Conversions */}
        <div className="bg-white rounded-xl p-4 shadow-xs border border-[#eaedff] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#434655]">Conversions</span>
            <div className="w-7 h-7 rounded-lg bg-[#eaddff] flex items-center justify-center text-[#712ae2]">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-[#131b2e] tabular-nums">
              {currentUser.enrolledCount} <span className="text-xs font-normal text-[#737686]">Paid</span>
            </div>
            <div className="mt-1 truncate">
              <span className="text-[11px] text-[#004ac6] font-bold">₹28.4L collected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Action: Next Callback Banner */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-[#eaedff]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ba1a1a] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ba1a1a]"></span>
            </span>
            <span className="text-[11px] font-bold text-[#ba1a1a] uppercase tracking-wider">
              Priority Callback in 25 mins
            </span>
          </div>
          <span className="text-[11px] text-[#434655] bg-[#eaedff] px-2 py-0.5 rounded font-medium">
            2:30 PM Today
          </span>
        </div>

        <div
          onClick={() => openLeadDetails('lead-1')}
          className="flex items-center justify-between mt-3 gap-3 cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#dbe1ff] flex items-center justify-center text-[#004ac6] font-bold text-sm shrink-0">
              RK
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm text-[#131b2e] truncate hover:text-[#004ac6]">Rahul Kumar</h3>
              <p className="text-xs text-[#434655] truncate">BCA (Hons.) • Delhi Central</p>
            </div>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 shrink-0">
            Hot Lead 🔥
          </span>
        </div>

        <div className="bg-[#f2f3ff] rounded-lg p-2.5 mt-3">
          <p className="text-xs text-[#434655] flex items-start gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#004ac6] shrink-0 mt-0.5">forum</span>
            <span>Parent consultation call for curriculum, hostel safety & placement stats.</span>
          </p>
        </div>

        {/* Quick Action Engagement Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <a
            href="tel:+919876543210"
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff] transition-colors font-semibold text-xs shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px] text-[#004ac6]">call</span>
            <span>Instant Call</span>
          </a>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* In-Progress Funnel Pipeline Indicator */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-[#eaedff]">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-sm text-[#131b2e]">{currentUser.name.split(' ')[0]}'s Pipeline Stages</span>
          <span className="text-xs text-[#004ac6] font-semibold">36 Candidates Total</span>
        </div>

        {/* Stage Segment Bar */}
        <div className="flex w-full h-3 rounded-full overflow-hidden bg-[#eaedff] gap-0.5 p-0.5">
          <div className="bg-[#737686] h-full rounded-l-full" style={{ width: '11%' }} title="New (4)"></div>
          <div className="bg-[#b4c5ff] h-full" style={{ width: '28%' }} title="Contacted (10)"></div>
          <div className="bg-[#d2bbff] h-full" style={{ width: '22%' }} title="Interested (8)"></div>
          <div className="bg-[#007793] h-full" style={{ width: '17%' }} title="App Started (6)"></div>
          <div className="bg-[#004ac6] h-full rounded-r-full" style={{ width: '22%' }} title="Enrolled (8)"></div>
        </div>

        {/* Segment tags */}
        <div className="grid grid-cols-5 gap-1 text-center mt-3">
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-[#434655]">New</span>
            <span className="text-xs font-bold text-[#131b2e]">{newCount}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-[#434655]">Contacted</span>
            <span className="text-xs font-bold text-[#131b2e]">{contactedCount}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-[#434655]">Interested</span>
            <span className="text-xs font-bold text-[#131b2e]">{interestedCount}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-[#434655]">Apps</span>
            <span className="text-xs font-bold text-[#131b2e]">{appsCount}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-[#004ac6] font-semibold">Enrolled</span>
            <span className="text-xs font-bold text-[#004ac6]">{enrolledCount}</span>
          </div>
        </div>
      </div>

      {/* Today's Follow-up Schedule (Timeline Checklist) */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-[#eaedff]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-sm text-[#131b2e]">Today's Schedule</h3>
            <p className="text-xs text-[#434655]">5 interactive student milestones</p>
          </div>
          <span className="text-xs text-[#004ac6] font-semibold">Chronological</span>
        </div>

        <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#eaedff]">
          {/* Milestone 1: 09:30 AM Completed */}
          <div className="relative group">
            <span className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <span className="material-symbols-outlined text-[13px] font-bold">check</span>
            </span>
            <div className="bg-[#f2f3ff] rounded-lg p-2.5 opacity-80">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#434655] font-medium">09:30 AM</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">
                  Completed
                </span>
              </div>
              <h4 className="font-semibold text-xs text-[#131b2e] mt-1 line-through text-[#737686]">
                Sneha Sharma (MBA)
              </h4>
              <p className="text-[11px] text-[#434655] mt-0.5">Fee concession query & scholarship slab discussion.</p>
            </div>
          </div>

          {/* Milestone 2: 11:15 AM Completed */}
          <div className="relative group">
            <span className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <span className="material-symbols-outlined text-[13px] font-bold">check</span>
            </span>
            <div className="bg-[#f2f3ff] rounded-lg p-2.5 opacity-80">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#434655] font-medium">11:15 AM</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">
                  Completed
                </span>
              </div>
              <h4 className="font-semibold text-xs text-[#131b2e] mt-1 line-through text-[#737686]">
                Arjun R (B.Tech CS)
              </h4>
              <p className="text-[11px] text-[#434655] mt-0.5">Review class 12 marksheet & hostel accommodation requirements.</p>
            </div>
          </div>

          {/* Milestone 3: 02:30 PM (Next Action Due) */}
          <div className="relative group">
            <span className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-[#004ac6] flex items-center justify-center text-white shadow-sm ring-4 ring-[#dbe1ff]">
              <span className="material-symbols-outlined text-[12px]">schedule</span>
            </span>
            <div className="bg-[#eaedff] rounded-lg p-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#004ac6] font-bold">02:30 PM (Next)</span>
                <span className="text-[10px] text-white bg-[#ba1a1a] px-2 py-0.5 rounded-full font-bold">
                  Action Due
                </span>
              </div>
              <h4 className="font-bold text-xs text-[#131b2e] mt-1">Rahul Kumar (BCA)</h4>
              <p className="text-xs text-[#131b2e] mt-0.5">Parent consultation call for curriculum & placements.</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    completeFollowUp('fu-2', 'Parent call completed. Positive interest for BCA.');
                  }}
                  className="py-1 px-2.5 rounded bg-[#004ac6] text-white text-[11px] font-semibold flex items-center gap-1 active:scale-95 transition-transform"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[14px]">call</span> Start Call
                </button>
                <button
                  onClick={() => {
                    rescheduleFollowUp('fu-2', '2026-09-26', '16:00', 'Requested Saturday callback');
                  }}
                  className="py-1 px-2.5 rounded bg-white text-[#131b2e] text-[11px] font-semibold flex items-center gap-1 hover:bg-[#f2f3ff] transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[14px]">edit_calendar</span> Reschedule
                </button>
              </div>
            </div>
          </div>

          {/* Milestone 4: 04:15 PM Pending */}
          <div className="relative group">
            <span className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-[#eaedff] flex items-center justify-center text-[#434655]">
              <span className="w-2 h-2 rounded-full bg-[#737686]"></span>
            </span>
            <div className="bg-white rounded-lg p-2.5 border border-[#eaedff]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#434655]">04:15 PM</span>
                <span className="text-[10px] text-[#434655] bg-[#eaedff] px-1.5 py-0.5 rounded">Pending</span>
              </div>
              <h4 className="font-semibold text-xs text-[#131b2e] mt-1">Aishwarya S (MCA)</h4>
              <p className="text-[11px] text-[#434655] mt-0.5">Application fee payment link reminder.</p>
            </div>
          </div>

          {/* Milestone 5: 05:30 PM Scheduled */}
          <div className="relative group">
            <span className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-[#eaedff] flex items-center justify-center text-[#434655]">
              <span className="w-2 h-2 rounded-full bg-[#737686]"></span>
            </span>
            <div className="bg-white rounded-lg p-2.5 border border-[#eaedff]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#434655]">05:30 PM</span>
                <span className="text-[10px] text-[#434655] bg-[#eaedff] px-1.5 py-0.5 rounded">Scheduled</span>
              </div>
              <h4 className="font-semibold text-xs text-[#131b2e] mt-1">Manoj Kumar (B.Tech)</h4>
              <p className="text-[11px] text-[#434655] mt-0.5">Campus walk-in tour coordination with lab dean.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Counselor Rank Tip */}
      <div className="flex items-center gap-3 p-4 bg-[#eaddff]/60 text-[#25005a] rounded-xl border border-[#d2bbff]">
        <div className="w-10 h-10 rounded-full bg-[#8a4cfc] text-white flex items-center justify-center shrink-0 shadow-xs">
          <span className="material-symbols-outlined text-[20px]">emoji_events</span>
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-xs leading-tight">
            {currentUser.name.split(' ')[0]}, you're Ranked #{currentUser.rank || 1} this week!
          </h4>
          <p className="text-[11px] opacity-90 mt-0.5 truncate">
            Only 1 more admission to overtake Northern Campus leader.
          </p>
        </div>
      </div>

      {/* Sticky Mobile Action Strip */}
      <div className="sticky bottom-20 z-30 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#eaedff] p-2 flex items-center justify-between gap-2">
        <button
          onClick={() => setIsQuickLogModalOpen(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff] transition-colors font-semibold text-xs"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px] text-[#434655]">post_add</span>
          <span>Quick Note</span>
        </button>
        <button
          onClick={() => {
            showToast('Opening rapid call dispatch logging...');
            setIsQuickLogModalOpen(true);
          }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff] transition-colors font-semibold text-xs"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px] text-[#005d73]">call_log</span>
          <span>Log Call</span>
        </button>
        <button
          onClick={() => setIsAddLeadModalOpen(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#004ac6] text-white hover:bg-[#003ea8] transition-colors font-semibold text-xs shadow-sm"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>+ Add Lead</span>
        </button>
      </div>
    </div>
  );
};
