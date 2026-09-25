import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { FollowUpType, LeadPriority } from '../../types';

export const FollowUpsView: React.FC = () => {
  const {
    followUps,
    leads,
    counsellors,
    openLeadDetails,
    completeFollowUp,
    rescheduleFollowUp,
    addFollowUp,
    showToast,
  } = useCrm();

  const [activeTab, setActiveTab] = useState<'today' | 'overdue' | 'upcoming' | 'completed'>('today');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // New follow up form state
  const [leadId, setLeadId] = useState(leads[0]?.id || '');
  const [fuDate, setFuDate] = useState('2026-09-26');
  const [fuTime, setFuTime] = useState('14:30');
  const [fuType, setFuType] = useState<FollowUpType>('CALL');
  const [fuPriority, setFuPriority] = useState<LeadPriority>('HIGH');
  const [fuNotes, setFuNotes] = useState('');

  // Reschedule state
  const [rescheduleTargetId, setRescheduleTargetId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('2026-09-27');
  const [rescheduleTime, setRescheduleTime] = useState('11:00');

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    addFollowUp({
      leadId: lead.id,
      leadName: lead.name,
      leadCourse: lead.course,
      counsellorId: lead.assignedCounsellorId || counsellors[0].id,
      counsellorName: lead.assignedCounsellorName || counsellors[0].name,
      date: fuDate,
      time: fuTime,
      type: fuType,
      status: 'PENDING',
      notes: fuNotes || 'Scheduled milestone outreach',
      priority: fuPriority,
    });

    setIsScheduleModalOpen(false);
    setFuNotes('');
  };

  const handleApplyReschedule = (fuId: string) => {
    rescheduleFollowUp(fuId, rescheduleDate, rescheduleTime, 'Rescheduled by officer request');
    setRescheduleTargetId(null);
  };

  return (
    <div className="flex flex-col w-full pb-24 space-y-4">
      {/* Top Command & Action Bar */}
      <div className="px-4 md:px-0 pt-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-lg md:text-xl text-[#131b2e]">Queue</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#dbe1ff] text-[#00174b] text-xs font-semibold">
            38 Pending
          </span>
        </div>
        <button
          onClick={() => setIsScheduleModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#004ac6] text-white rounded-lg text-xs font-semibold shadow-xs hover:bg-[#003ea8] active:scale-95 transition-all"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Schedule</span>
        </button>
      </div>

      {/* Interactive Filter Tabs */}
      <div className="px-4 md:px-0 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          <button
            onClick={() => setActiveTab('today')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'today'
                ? 'bg-[#131b2e] text-white shadow-xs'
                : 'bg-white text-[#434655] border border-[#eaedff] hover:bg-[#f2f3ff]'
            }`}
          >
            <span>Today</span>
            <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-white text-[10px]">18</span>
          </button>
          <button
            onClick={() => setActiveTab('overdue')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'overdue'
                ? 'bg-[#ba1a1a] text-white shadow-xs'
                : 'bg-white text-[#434655] border border-[#eaedff] hover:bg-[#f2f3ff]'
            }`}
          >
            <span>Overdue</span>
            <span className="px-1.5 py-0.5 rounded-full bg-[#ba1a1a] text-white text-[10px]">6</span>
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'upcoming'
                ? 'bg-[#004ac6] text-white shadow-xs'
                : 'bg-white text-[#434655] border border-[#eaedff] hover:bg-[#f2f3ff]'
            }`}
          >
            <span>Upcoming</span>
            <span className="px-1.5 py-0.5 rounded-full bg-[#eaedff] text-[#004ac6] text-[10px]">14</span>
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'completed'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-[#434655] border border-[#eaedff] hover:bg-[#f2f3ff]'
            }`}
          >
            <span>Completed</span>
            <span className="px-1.5 py-0.5 rounded-full bg-[#f2f3ff] text-[#434655] text-[10px]">24</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Overview Cards */}
      <div className="px-4 md:px-0 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Overdue Alert Stat */}
        <div className="bg-[#ffdad6]/40 rounded-xl p-3.5 border border-[#ffdad6] flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#ba1a1a] uppercase tracking-wider">Overdue</span>
            <span className="w-7 h-7 rounded-lg bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a]">
              <span className="material-symbols-outlined text-[18px]">warning</span>
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#ba1a1a] tabular-nums">6</span>
            <span className="text-xs text-[#ba1a1a] font-medium">Needs immediate action</span>
          </div>
        </div>

        {/* Due Today Stat */}
        <div className="bg-white rounded-xl p-3.5 border border-[#eaedff] flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#434655] uppercase tracking-wider">Due Today</span>
            <span className="w-7 h-7 rounded-lg bg-[#dbe1ff] flex items-center justify-center text-[#004ac6]">
              <span className="material-symbols-outlined text-[18px]">today</span>
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#131b2e] tabular-nums">18</span>
              <span className="text-xs text-[#004ac6] font-semibold">Scheduled</span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-[#737686] text-xs">
              <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">call</span>10
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">chat</span>5
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">apartment</span>3
              </span>
            </div>
          </div>
        </div>

        {/* Completed Today Stat */}
        <div className="bg-white rounded-xl p-3.5 border border-[#eaedff] flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#434655] uppercase tracking-wider">Completed Today</span>
            <span className="w-7 h-7 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#005d73]">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#131b2e] tabular-nums">24</span>
            <span className="text-xs text-[#005d73] font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">trending_up</span> Good progress
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 1: Overdue Interventions */}
      {(activeTab === 'today' || activeTab === 'overdue') && (
        <section className="px-4 md:px-0 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] animate-pulse"></span>
              <h3 className="font-bold text-sm text-[#ba1a1a]">Overdue Interventions (6)</h3>
            </div>
            <span className="text-xs text-[#ba1a1a] font-medium">Critical SLA breached</span>
          </div>

          {/* Urgent Overdue Lead Card */}
          <div className="bg-white rounded-xl p-4 shadow-xs border border-[#eaedff] flex flex-col gap-3 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#ba1a1a]"></div>
            <div className="pl-1.5 flex items-start justify-between gap-2">
              <div
                onClick={() => openLeadDetails('lead-4')}
                className="flex items-center gap-2.5 min-w-0 cursor-pointer"
              >
                <img
                  className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-[#eaedff]"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZ7baTCX7nWEnrfrYSdgZ2OsOdsdKPYXPnQBNsL_xHNCnrIgn6WneG4OKebTvV6Iyiv0EK_RlCXN5K7rmvp2a8Tyr26yWW5zdrcYqT8zFIn7UKbclcmsBn_rQiATt7nrWl_qlM7W1AD2l29RaPHdO4Ajeb1th4JF8S8GnUMv7UwBB4mNGdbgRcJm3INgFGg3cfVtmGJ0mfwpHtYRlGE8BP3A-Ea5MnVC5BeP-Jr2bzmYIBKUho89uMYQ"
                  alt="Aishwarya S"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-sm text-[#131b2e] hover:text-[#004ac6]">Aishwarya S</h4>
                    <span className="px-2 py-0.5 rounded-full bg-[#eaedff] text-[#004ac6] text-[10px] font-semibold">
                      MCA
                    </span>
                  </div>
                  <p className="text-xs text-[#434655] mt-0.5">
                    Counsellor: <strong className="text-[#131b2e]">Priya Sharma</strong>
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[11px] font-bold shrink-0">
                <span className="material-symbols-outlined text-[13px]">crisis_alert</span>
                URGENT
              </span>
            </div>

            <div className="pl-1.5 flex items-center gap-2 text-xs text-[#ba1a1a] bg-[#ffdad6]/40 p-2 rounded-lg font-medium">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              <span>Scheduled: Yesterday, 4:00 PM (18 hrs overdue)</span>
            </div>

            <div className="pl-1.5 text-xs text-[#131b2e] bg-[#f2f3ff] p-2.5 rounded-lg flex items-start gap-2">
              <span className="material-symbols-outlined text-[#004ac6] text-[16px] shrink-0 mt-0.5">assignment</span>
              <p>"Review Scholarship Application and Fee concession request"</p>
            </div>

            {/* Triggers */}
            <div className="pl-1.5 pt-1 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <a
                  href="tel:+919700123456"
                  onClick={() => showToast('Calling Aishwarya S...')}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#ba1a1a] text-white rounded-lg text-xs font-semibold active:scale-95 transition-transform shadow-xs hover:bg-[#93000a]"
                >
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  <span>Call Immediately</span>
                </a>
                <button
                  onClick={() => setRescheduleTargetId('fu-1')}
                  className="w-9 h-9 rounded-lg bg-[#f2f3ff] text-[#131b2e] flex items-center justify-center hover:bg-[#eaedff] transition-colors"
                  title="Reschedule"
                >
                  <span className="material-symbols-outlined text-[18px]">event_repeat</span>
                </button>
              </div>

              <button
                onClick={() => completeFollowUp('fu-1', 'Scholarship concession finalized. Fee link shared.')}
                className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-[#eaedff] text-[#004ac6] text-xs font-semibold active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Mark Done</span>
              </button>
            </div>

            {/* Inline Reschedule Dialog */}
            {rescheduleTargetId === 'fu-1' && (
              <div className="mt-2 p-3 bg-[#f2f3ff] rounded-lg border border-[#dae2fd] space-y-2">
                <span className="text-xs font-semibold text-[#131b2e] block">Select New Callback Slot:</span>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="p-1.5 rounded bg-white text-xs border border-[#dae2fd]"
                  />
                  <input
                    type="time"
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="p-1.5 rounded bg-white text-xs border border-[#dae2fd]"
                  />
                  <button
                    onClick={() => handleApplyReschedule('fu-1')}
                    className="px-3 py-1.5 rounded bg-[#004ac6] text-white text-xs font-bold"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* SECTION 2: Today's Schedule */}
      {(activeTab === 'today' || activeTab === 'upcoming') && (
        <section className="px-4 md:px-0 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#004ac6]"></span>
              <h3 className="font-bold text-sm text-[#131b2e]">Today's Schedule</h3>
            </div>
            <span className="text-xs text-[#434655]">Chronological Flow</span>
          </div>

          {/* Card 2: 02:30 PM Due in 45 mins */}
          <div className="bg-white rounded-xl p-4 shadow-xs border border-[#eaedff] flex flex-col gap-3 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500"></div>
            <div className="pl-1.5 flex items-start justify-between gap-2">
              <div
                onClick={() => openLeadDetails('lead-1')}
                className="flex items-center gap-2.5 min-w-0 cursor-pointer"
              >
                <img
                  className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-[#eaedff]"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQmJezxgK-3PFHtj3xns9zKE9qho8xeJ5RW4uhtLl7BvKYY1TueBc9XvBTcin_1J4RaQa_MyM1rDCdUgfy1d36xDH9oyzYXwgjNa8i8s3SrvSI7IhDlqLxA6DlfTJDYIKfV-d6dN4ByJYRsUKsUqHrKcCPCr6E6qhQVh_Wai8F5dO3RDQLDMmLhGlGW7On8apmVpgYJTOvaathS77fne7D_j62OaOBN6EF9f5uP6ao6AgRaqCqk1NW8w"
                  alt="Rahul Kumar"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-[#131b2e] hover:text-[#004ac6]">Rahul Kumar</h4>
                    <span className="px-2 py-0.5 rounded-full bg-[#eaedff] text-[#004ac6] text-[10px] font-semibold">
                      BCA
                    </span>
                  </div>
                  <p className="text-xs text-[#434655] mt-0.5">
                    Counsellor: <strong className="text-[#131b2e]">Priya Sharma</strong>
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <span className="font-bold text-xs text-[#131b2e]">02:30 PM</span>
                <span className="inline-flex items-center gap-1 text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full mt-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                  In 45 mins
                </span>
              </div>
            </div>

            <div className="pl-1.5 text-xs text-[#131b2e] bg-[#f2f3ff] p-2.5 rounded-lg flex items-start gap-2">
              <span className="material-symbols-outlined text-[#004ac6] text-[16px] shrink-0 mt-0.5">phone_callback</span>
              <p>"Follow up on hostel seat reservation and parent consultation"</p>
            </div>

            <div className="pl-1.5 pt-1 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <a
                  href="tel:+919876543210"
                  onClick={() => showToast('Starting call with Rahul Kumar...')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#004ac6] text-white text-xs font-semibold shadow-xs hover:bg-[#003ea8]"
                >
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  <span>Call</span>
                </a>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>WhatsApp</span>
                </a>
              </div>
              <button
                onClick={() => completeFollowUp('fu-2', 'Hostel seat confirmed.')}
                className="w-8 h-8 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#004ac6] hover:bg-[#dae2fd]"
                title="Mark Completed"
              >
                <span className="material-symbols-outlined text-[18px]">done</span>
              </button>
            </div>
          </div>

          {/* Card 3: 03:15 PM Sneha Sharma */}
          <div className="bg-white rounded-xl p-4 shadow-xs border border-[#eaedff] flex flex-col gap-3 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#005d73]"></div>
            <div className="pl-1.5 flex items-start justify-between gap-2">
              <div
                onClick={() => openLeadDetails('lead-2')}
                className="flex items-center gap-2.5 min-w-0 cursor-pointer"
              >
                <img
                  className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-[#eaedff]"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNCksQPw4KM4GN_OSFuCrrElKrk_iJnbh1V36ucSMcnLQv9GCMfSXT6qns50AlQt9yEc0z0E5Gstrld6jZ44-HXquI4riWZCiieVfcIAe6flvzBdowQnP3SV5O7Bofbafc1eGiGq2cmH1LZ3yY3px54isOygervbhXVy0cCVtTVg7ySeCJFcAsHQPyvOp77eIHE46dOZW5UpjA4-g0bcosCadVzbPkHv8jJMB0rcA2kV0Fz0MparBAhQ"
                  alt="Sneha Sharma"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-[#131b2e] hover:text-[#004ac6]">Sneha Sharma</h4>
                    <span className="px-2 py-0.5 rounded-full bg-[#eaedff] text-[#004ac6] text-[10px] font-semibold">
                      MBA
                    </span>
                  </div>
                  <p className="text-xs text-[#434655] mt-0.5">
                    Counsellor: <strong className="text-[#131b2e]">Arun Kumar</strong>
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <span className="font-bold text-xs text-[#131b2e]">03:15 PM</span>
                <span className="text-[10px] text-[#434655] bg-[#eaedff] px-2 py-0.5 rounded-full mt-1">Due Today</span>
              </div>
            </div>

            <div className="pl-1.5 text-xs text-[#131b2e] bg-[#f2f3ff] p-2.5 rounded-lg flex items-start gap-2">
              <span className="material-symbols-outlined text-[#005d73] text-[16px] shrink-0 mt-0.5">mark_chat_unread</span>
              <p>"Send GD/PI interview schedule and prep guidelines"</p>
            </div>

            <div className="pl-1.5 pt-1 flex items-center justify-between gap-2">
              <a
                href="https://wa.me/919811234567"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#005d73] text-white text-xs font-semibold shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>WhatsApp Message</span>
              </a>
              <button
                onClick={() => completeFollowUp('fu-3', 'Interview guidelines shared via PDF')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#eaedff] text-[#004ac6] text-xs font-semibold"
              >
                <span className="material-symbols-outlined text-[16px]">check</span>
                <span>Mark Done</span>
              </button>
            </div>
          </div>

          {/* Card 4: 04:30 PM Campus Walk-in Manoj Kumar */}
          <div className="bg-white rounded-xl p-4 shadow-xs border border-[#eaedff] flex flex-col gap-3 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#712ae2]"></div>
            <div className="pl-1.5 flex items-start justify-between gap-2">
              <div
                onClick={() => openLeadDetails('lead-5')}
                className="flex items-center gap-2.5 min-w-0 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#eaddff] flex items-center justify-center text-[#712ae2] font-bold text-sm shrink-0">
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-[#131b2e] hover:text-[#004ac6]">Manoj Kumar</h4>
                    <span className="px-2 py-0.5 rounded-full bg-[#eaddff] text-[#25005a] text-[10px] font-semibold">
                      B.Tech CS
                    </span>
                  </div>
                  <p className="text-xs text-[#434655] mt-0.5">
                    Counsellor: <strong className="text-[#131b2e]">Ravi Raj</strong>
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <span className="font-bold text-xs text-[#131b2e]">04:30 PM</span>
                <span className="text-[10px] text-[#712ae2] bg-[#eaddff] px-2 py-0.5 rounded-full mt-1 font-semibold">
                  Walk-in
                </span>
              </div>
            </div>

            <div className="pl-1.5 text-xs text-[#131b2e] bg-[#f2f3ff] p-2.5 rounded-lg flex items-start gap-2">
              <span className="material-symbols-outlined text-[#712ae2] text-[16px] shrink-0 mt-0.5">directions_walk</span>
              <p>"Campus tour with parents, meeting with HoD"</p>
            </div>

            <div className="pl-1.5 pt-1 flex items-center justify-between gap-2">
              <button
                onClick={() => showToast('Visitor Campus Pass #VP-408 generated for Manoj Kumar and parents')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f2f3ff] text-[#131b2e] text-xs font-semibold hover:bg-[#eaedff]"
              >
                <span className="material-symbols-outlined text-[16px]">qr_code</span>
                <span>Campus Pass</span>
              </button>
              <button
                onClick={() => completeFollowUp('fu-4', 'Campus tour completed. Highly interested in CS lab.')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#712ae2] text-white text-xs font-semibold shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                <span>Check-in</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 3: Recently Completed Stream Preview */}
      {(activeTab === 'today' || activeTab === 'completed') && (
        <section className="px-4 md:px-0 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <h3 className="font-bold text-sm text-[#131b2e]">Recently Completed</h3>
            </div>
            <span className="text-xs text-[#004ac6] font-semibold">View all 24</span>
          </div>

          <div className="bg-white rounded-xl p-3.5 border border-[#eaedff] flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">check</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-semibold text-xs text-[#131b2e] truncate">Kiran Raj</h4>
                  <span className="text-[11px] text-[#737686]">(BBA)</span>
                </div>
                <p className="text-[11px] text-[#434655] truncate mt-0.5">
                  "Application form link shared & fee paid."
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0 text-right">
              <span className="text-[11px] text-[#737686]">11:30 AM</span>
              <span className="text-[11px] text-emerald-700 font-semibold">by Priya S</span>
            </div>
          </div>
        </section>
      )}

      {/* Schedule Follow-up Modal */}
      {isScheduleModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsScheduleModalOpen(false);
          }}
        >
          <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl space-y-3 border border-[#eaedff] animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#f2f3ff]">
              <h3 className="font-bold text-base text-[#131b2e]">Schedule New Follow-up</h3>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#434655]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#131b2e] block mb-1">Select Student Lead</label>
                <select
                  value={leadId}
                  onChange={(e) => setLeadId(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#f2f3ff] text-xs font-medium text-[#131b2e] border border-[#dae2fd] focus:outline-none"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.leadId} • {l.course})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-[#131b2e] block mb-1">Follow-up Date</label>
                  <input
                    type="date"
                    value={fuDate}
                    onChange={(e) => setFuDate(e.target.value)}
                    required
                    className="w-full p-2 rounded-lg bg-[#f2f3ff] text-xs text-[#131b2e] border border-[#dae2fd]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#131b2e] block mb-1">Time</label>
                  <input
                    type="time"
                    value={fuTime}
                    onChange={(e) => setFuTime(e.target.value)}
                    required
                    className="w-full p-2 rounded-lg bg-[#f2f3ff] text-xs text-[#131b2e] border border-[#dae2fd]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#131b2e] block mb-1">Channel Type</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['CALL', 'WHATSAPP', 'VISIT', 'EMAIL'] as FollowUpType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFuType(t)}
                      className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        fuType === t ? 'bg-[#004ac6] text-white' : 'bg-[#f2f3ff] text-[#434655]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#131b2e] block mb-1">Notes / Action Plan</label>
                <textarea
                  value={fuNotes}
                  onChange={(e) => setFuNotes(e.target.value)}
                  placeholder="Review BCA hostel fees & scholarship slabs with parents..."
                  rows={2}
                  className="w-full p-2.5 rounded-lg bg-[#f2f3ff] text-xs text-[#131b2e] border border-[#dae2fd] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#004ac6] text-white text-xs font-bold shadow-sm hover:bg-[#003ea8]"
              >
                Schedule & Add to Queue
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
