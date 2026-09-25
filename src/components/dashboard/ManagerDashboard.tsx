import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';

export const ManagerDashboard: React.FC = () => {
  const {
    metrics,
    insights,
    counsellors,
    leads,
    setActiveTab,
    openLeadDetails,
    setIsAddLeadModalOpen,
    setIsAllocationHubOpen,
    showToast,
    updateLead,
  } = useCrm();

  const [timeFilter, setTimeFilter] = useState<'month' | 'week' | 'today'>('month');
  const [selectedSession, setSelectedSession] = useState('AY 2026-27 (Fall Intake)');
  const [isSessionDropdownOpen, setIsSessionDropdownOpen] = useState(false);

  // Dynamic funnel calculation from actual leads data
  const funnelStages = [
    {
      step: 1,
      id: 'NEW',
      name: 'New Enquiry',
      desc: 'Avg. Age: 0.8d',
      count: metrics.newLeads,
      percent: '100% Top',
      color: 'bg-[#004ac6] text-white',
      badgeColor: 'text-emerald-700',
    },
    {
      step: 2,
      id: 'CONTACTED',
      name: 'Contacted',
      desc: 'First call completed',
      count: metrics.contactedLeads,
      percent: '25.0% Vol',
      color: 'bg-[#004ac6] text-white',
      badgeColor: 'text-[#004ac6]',
    },
    {
      step: 3,
      id: 'INTERESTED',
      name: 'Interested',
      desc: 'Prospect vetted',
      count: metrics.interestedLeads,
      percent: '19.2% Vol',
      color: 'bg-[#004ac6] text-white',
      badgeColor: 'text-amber-700',
    },
    {
      step: 4,
      id: 'FOLLOW_UP',
      name: 'Follow-up Slot',
      desc: 'Scheduled visits/demo',
      count: metrics.followupsToday > 0 ? 188 : 120,
      percent: '15.1% Vol',
      color: 'bg-[#004ac6] text-white',
      badgeColor: 'text-amber-800',
    },
    {
      step: 5,
      id: 'APPLICATION_STARTED',
      name: 'Application In-Progress',
      desc: 'Form initiated',
      count: metrics.applications,
      percent: '15.7% Vol',
      color: 'bg-[#004ac6] text-white',
      badgeColor: 'text-[#712ae2]',
    },
    {
      step: 6,
      id: 'ADMISSION_CONFIRMED',
      name: 'Enrolled / Confirmed',
      desc: 'Fees deposited',
      count: metrics.convertedAdmissions,
      percent: `${metrics.conversionRate}% Net`,
      color: 'bg-emerald-600 text-white',
      badgeColor: 'text-emerald-700 font-bold',
      isConfirmed: true,
    },
  ];

  // Critical interventions
  const criticalInterventions = [
    {
      id: 'lead-1',
      name: 'Rahul Kumar',
      initials: 'RK',
      program: 'BCA • 15 days in pipeline',
      issue: '5d No Activity',
      issueBg: 'bg-rose-100 text-rose-800',
      counsellor: 'Unassigned',
      actionLabel: 'Direct Reassign',
      actionType: 'reassign',
    },
    {
      id: 'lead-2',
      name: 'Sneha Sharma',
      initials: 'SS',
      program: 'MBA • 21 days in pipeline',
      issue: 'Stalled App Form',
      issueBg: 'bg-amber-100 text-amber-800',
      counsellor: 'Arun Kumar',
      actionLabel: 'Ping Counselor',
      actionType: 'ping',
    },
    {
      id: 'lead-5',
      name: 'Manoj Kumar',
      initials: 'MK',
      program: 'B.Tech • 32 days in pipeline',
      issue: 'Severely Overdue',
      issueBg: 'bg-[#ba1a1a] text-white',
      counsellor: 'Ravi Raj',
      actionLabel: 'Escalate to HOD',
      actionType: 'escalate',
    },
  ];

  return (
    <div className="flex flex-col w-full pb-24 space-y-4">
      {/* Executive Context Bar */}
      <section className="px-4 md:px-0 pt-2">
        <div className="bg-white p-4 rounded-xl shadow-xs border border-[#eaedff] flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Session Selector */}
            <div className="relative flex-1 min-w-0">
              <button
                onClick={() => setIsSessionDropdownOpen(!isSessionDropdownOpen)}
                className="w-full flex items-center justify-between gap-2 bg-[#eaedff] px-3.5 py-2 rounded-lg text-left transition-colors hover:bg-[#dae2fd]"
                type="button"
                aria-expanded={isSessionDropdownOpen}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-[18px] text-[#004ac6] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                    school
                  </span>
                  <span className="font-semibold text-sm text-[#131b2e] truncate">{selectedSession}</span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-[#434655] shrink-0">
                  {isSessionDropdownOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {isSessionDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsSessionDropdownOpen(false)} />
                  <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-xl shadow-lg border border-[#eaedff] py-1 z-40">
                    {[
                      'AY 2026-27 (Fall Intake)',
                      'AY 2026-27 (Spring Intake)',
                      'AY 2025-26 (Archive & Audit)',
                    ].map((session) => (
                      <button
                        key={session}
                        onClick={() => {
                          setSelectedSession(session);
                          setIsSessionDropdownOpen(false);
                          showToast(`Switched cycle to ${session}`);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs font-medium hover:bg-[#f2f3ff] transition-colors ${
                          selectedSession === session ? 'text-[#004ac6] font-semibold bg-[#eaedff]' : 'text-[#131b2e]'
                        }`}
                      >
                        {session}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Time Filter Segmented Control */}
            <div className="flex items-center gap-1 bg-[#f2f3ff] p-1 rounded-lg border border-[#dae2fd] self-start sm:self-auto">
              <button
                onClick={() => setTimeFilter('month')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  timeFilter === 'month' ? 'bg-[#004ac6] text-white shadow-xs' : 'text-[#434655] hover:text-[#131b2e]'
                }`}
              >
                This Month
              </button>
              <button
                onClick={() => setTimeFilter('week')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  timeFilter === 'week' ? 'bg-[#004ac6] text-white shadow-xs' : 'text-[#434655] hover:text-[#131b2e]'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setTimeFilter('today')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  timeFilter === 'today' ? 'bg-[#004ac6] text-white shadow-xs' : 'text-[#434655] hover:text-[#131b2e]'
                }`}
              >
                Today
              </button>
            </div>
          </div>

          {/* Sync Status & Live Radar */}
          <div className="flex items-center justify-between text-[#434655] text-xs pt-1 border-t border-[#f2f3ff]">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Admissions Radar
            </span>
            <span className="text-[#737686]">Last synced: just now</span>
          </div>
        </div>
      </section>

      {/* Executive KPI Grid (2x2 on Mobile, 4-col on Desktop) */}
      <section className="px-4 md:px-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Total Leads */}
          <div
            onClick={() => setActiveTab('leads')}
            className="bg-white p-4 rounded-xl shadow-xs border border-[#eaedff] hover:border-[#b4c5ff] cursor-pointer transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#434655]">Total Leads</span>
              <div className="w-8 h-8 rounded-lg bg-[#dbe1ff] flex items-center justify-center text-[#004ac6]">
                <span className="material-symbols-outlined text-[18px]">group</span>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl lg:text-3xl font-bold text-[#131b2e] tracking-tight tabular-nums">
                {metrics.totalLeads.toLocaleString()}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>+12.5% mo/mo</span>
            </div>
          </div>

          {/* Leads Contacted */}
          <div
            onClick={() => setActiveTab('leads')}
            className="bg-white p-4 rounded-xl shadow-xs border border-[#eaedff] hover:border-[#b4c5ff] cursor-pointer transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#434655]">Contacted</span>
              <div className="w-8 h-8 rounded-lg bg-[#b7eaff] flex items-center justify-center text-[#005d73]">
                <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl lg:text-3xl font-bold text-[#131b2e] tracking-tight tabular-nums">
                {metrics.contactedLeads.toLocaleString()}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-[#005d73] bg-[#b7eaff]/40 px-2 py-0.5 rounded-full w-fit">
              <span className="material-symbols-outlined text-[14px]">done_all</span>
              <span>86.8% outreach</span>
            </div>
          </div>

          {/* Follow-ups Due Today */}
          <div
            onClick={() => setActiveTab('follow-ups')}
            className="bg-white p-4 rounded-xl shadow-xs border border-[#eaedff] hover:border-[#b4c5ff] cursor-pointer transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#434655]">Due Today</span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
                <span className="material-symbols-outlined text-[18px]">schedule</span>
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
              <span className="text-2xl lg:text-3xl font-bold text-[#131b2e] tracking-tight tabular-nums">
                {metrics.followupsToday}
              </span>
              <span className="text-[10px] font-bold text-[#ba1a1a] bg-[#ffdad6] px-1.5 py-0.5 rounded">
                {metrics.overdueFollowups} Overdue
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full w-fit">
              <span className="material-symbols-outlined text-[14px]">priority_high</span>
              <span>12 High Priority</span>
            </div>
          </div>

          {/* Converted Admissions */}
          <div
            onClick={() => setActiveTab('reports')}
            className="bg-white p-4 rounded-xl shadow-xs border border-[#eaedff] hover:border-[#b4c5ff] cursor-pointer transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#434655]">Admissions</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl lg:text-3xl font-bold text-[#131b2e] tracking-tight tabular-nums">
                {metrics.convertedAdmissions}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full w-fit">
              <span className="material-symbols-outlined text-[14px]">north_east</span>
              <span>{metrics.conversionRate}% (+2.4%)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Admissions Pipeline Funnel (Section 6) */}
      <section className="px-4 md:px-0">
        <div className="bg-white p-4 rounded-xl shadow-xs border border-[#eaedff] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-base text-[#131b2e]">Admissions Funnel</h2>
              <p className="text-xs text-[#434655]">Conversion drop-off & stage load</p>
            </div>
            <span className="text-xs bg-[#eaedff] text-[#004ac6] font-semibold px-2.5 py-1 rounded-md">
              6 Stages Active
            </span>
          </div>

          {/* Funnel Tracks */}
          <div className="flex flex-col space-y-2 pt-1">
            {funnelStages.map((stage) => (
              <div
                key={stage.id}
                onClick={() => {
                  setActiveTab('leads');
                  showToast(`Filtering leads by ${stage.name}`);
                }}
                className={`flex items-center justify-between p-2.5 rounded-lg transition-all cursor-pointer ${
                  stage.isConfirmed
                    ? 'bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200/60'
                    : 'bg-[#f2f3ff] hover:bg-[#eaedff]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${stage.color}`}
                  >
                    {stage.step === 6 ? '✓' : stage.step}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-xs sm:text-sm text-[#131b2e] leading-snug">
                      {stage.name}
                    </span>
                    <span className="text-[11px] text-[#434655]">{stage.desc}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm text-[#131b2e] tabular-nums">{stage.count}</div>
                  <span className={`text-[11px] font-semibold ${stage.badgeColor}`}>{stage.percent}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Critical SLA Interventions & Ageing Alerts (Section 13) */}
      <section className="px-4 md:px-0">
        <div className="bg-white p-4 rounded-xl shadow-xs border border-[#eaedff] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#ba1a1a] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                warning
              </span>
              <h2 className="font-semibold text-base text-[#131b2e]">Ageing & Critical Interventions</h2>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-xs font-bold">
              3 Urgent
            </span>
          </div>
          <p className="text-xs text-[#434655]">
            Leads stagnating beyond threshold SLA guidelines requiring supervisor assignment.
          </p>

          {/* Alert Cards */}
          <div className="space-y-2.5 pt-1">
            {criticalInterventions.map((item) => (
              <div key={item.id} className="bg-[#f2f3ff] p-3 rounded-lg flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <div
                    onClick={() => openLeadDetails(item.id)}
                    className="flex items-center gap-2.5 min-w-0 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-800 text-xs font-bold shrink-0">
                      {item.initials}
                    </div>
                    <div className="truncate min-w-0">
                      <span className="font-semibold text-sm text-[#131b2e] truncate block hover:text-[#004ac6]">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-[#434655]">{item.program}</span>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${item.issueBg}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {item.issue}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-md text-[#434655] text-xs">
                  <span>Counsellor: <strong className="text-[#131b2e]">{item.counsellor}</strong></span>
                  <div>
                    {item.actionType === 'reassign' && (
                      <button
                        onClick={() => setIsAllocationHubOpen(true)}
                        className="text-[#004ac6] font-semibold hover:underline flex items-center gap-0.5"
                      >
                        <span>Direct Reassign</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    )}
                    {item.actionType === 'ping' && (
                      <button
                        onClick={() => showToast(`Pinged Arun Kumar via WhatsApp/SMS to follow up on ${item.name}`)}
                        className="text-[#005d73] font-semibold hover:underline"
                      >
                        Ping Counselor
                      </button>
                    )}
                    {item.actionType === 'escalate' && (
                      <button
                        onClick={() => showToast(`Escalation ticket generated for Admissions HoD regarding ${item.name}`, undefined, 'warning')}
                        className="text-[#ba1a1a] font-bold hover:underline"
                      >
                        Escalate to HOD
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Channel Performance (Section 17 & 18) */}
      <section className="px-4 md:px-0">
        <div className="bg-white p-4 rounded-xl shadow-xs border border-[#eaedff] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-base text-[#131b2e]">Channel Performance</h2>
              <p className="text-xs text-[#434655]">Lead volume & conversion efficiency</p>
            </div>
            <span className="material-symbols-outlined text-[#434655] text-[20px]">hub</span>
          </div>

          <div className="space-y-3 pt-1">
            {/* Website */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#131b2e] font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#004ac6]">language</span>
                  Website Organic & Portal
                </span>
                <span className="text-[#434655]">
                  380 leads • <strong className="text-emerald-700">22% conv</strong>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#dae2fd] overflow-hidden">
                <div className="h-full bg-[#004ac6] rounded-full" style={{ width: '38%' }}></div>
              </div>
            </div>

            {/* Walk-in */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#131b2e] font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#005d73]">storefront</span>
                  Direct Walk-in Campus Visits
                </span>
                <span className="text-[#434655]">
                  195 leads • <strong className="text-emerald-700">34% conv</strong>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#dae2fd] overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: '34%' }}></div>
              </div>
            </div>

            {/* WhatsApp */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#131b2e] font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">chat</span>
                  WhatsApp Business Bot
                </span>
                <span className="text-[#434655]">
                  240 leads • <strong className="text-emerald-700">28% conv</strong>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#dae2fd] overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '28%' }}></div>
              </div>
            </div>

            {/* Google Ads */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#131b2e] font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-amber-600">ads_click</span>
                  Google Search PPC
                </span>
                <span className="text-[#434655]">
                  210 leads • <strong className="text-amber-700">14% conv</strong>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#dae2fd] overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '14%' }}></div>
              </div>
            </div>

            {/* Education Expo */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#131b2e] font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#712ae2]">festival</span>
                  Education Expo & Fairs
                </span>
                <span className="text-[#434655]">
                  145 leads • <strong className="text-emerald-700">19% conv</strong>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#dae2fd] overflow-hidden">
                <div className="h-full bg-[#712ae2] rounded-full" style={{ width: '19%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Leaderboard (Section 14) */}
      <section className="px-4 md:px-0">
        <div className="bg-white p-4 rounded-xl shadow-xs border border-[#eaedff] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-base text-[#131b2e]">Team Leaderboard</h2>
              <p className="text-xs text-[#434655]">Active desk conversion ratio</p>
            </div>
            <button
              onClick={() => setActiveTab('counsellors')}
              className="text-xs text-[#004ac6] font-semibold hover:underline"
            >
              Full Audit
            </button>
          </div>

          <div className="divide-y divide-[#eaedff] space-y-2">
            {counsellors.map((c) => (
              <div key={c.id} className="pt-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-[#eaedff]"
                      src={c.avatar}
                      alt={c.name}
                    />
                    {c.rank === 1 && (
                      <span className="absolute -top-1 -left-1 w-4 h-4 bg-amber-400 text-[#131b2e] text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                        👑
                      </span>
                    )}
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm text-[#131b2e] truncate">{c.name}</span>
                      {c.rank === 1 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                          Top
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#434655]">
                      {c.assignedCount} assigned • {c.dialedCount} dialed
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-sm text-emerald-700 tabular-nums">
                    {c.enrolledCount} Enrolled
                  </div>
                  <span className="text-xs text-[#434655] tabular-nums">{c.conversionRate}% rate</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Operational Insights (Section 19) */}
      <section className="px-4 md:px-0">
        <div className="bg-[#f2f3ff] p-4 rounded-xl border border-[#dae2fd]">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              insights
            </span>
            <h3 className="font-semibold text-sm text-[#131b2e]">Real-Time Operational Insights</h3>
          </div>
          <div className="space-y-1.5">
            {insights.map((ins, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-[#434655]">
                <span className="text-[#004ac6] font-bold mt-0.5">•</span>
                <span>{ins}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky Operational Quick Actions Bar */}
      <div className="sticky bottom-20 z-30 px-4 md:px-0">
        <div className="bg-white/95 backdrop-blur-md p-2 rounded-xl shadow-lg border border-[#eaedff] flex items-center gap-2">
          <button
            onClick={() => setIsAddLeadModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#004ac6] text-white text-sm font-semibold py-2.5 px-3 rounded-lg shadow-sm hover:bg-[#003ea8] active:scale-95 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            <span>New Lead Intake</span>
          </button>
          <button
            onClick={() => setIsAllocationHubOpen(true)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#eaedff] text-[#131b2e] text-sm font-semibold py-2.5 px-3 rounded-lg hover:bg-[#dae2fd] active:scale-95 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px] text-[#004ac6]">assignment_ind</span>
            <span>Bulk Assign</span>
          </button>
        </div>
      </div>
    </div>
  );
};
