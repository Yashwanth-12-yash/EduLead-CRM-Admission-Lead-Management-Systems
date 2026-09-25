import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { ActivityType, LeadStatus, LeadPriority } from '../../types';
import { calculateLeadAge, getAgeingCategory } from '../../services/crmService';

export const LeadDetailsModal: React.FC = () => {
  const {
    selectedLead,
    closeLeadDetails,
    counsellors,
    updateLead,
    activities,
    addActivity,
    addFollowUp,
    setIsScheduleFollowUpModalOpen,
    showToast,
  } = useCrm();

  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'documents' | 'academic'>('overview');
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [isReassignOpen, setIsReassignOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  // Quick Log form state
  const [logChannel, setLogChannel] = useState<ActivityType>('CALL');
  const [callOutcome, setCallOutcome] = useState('Connected • Positive');
  const [logNotes, setLogNotes] = useState('');

  if (!selectedLead) return null;

  const leadActivities = activities.filter((a) => a.leadId === selectedLead.id);
  const leadAge = calculateLeadAge(selectedLead.createdAt);
  const ageCategory = getAgeingCategory(leadAge);

  // Stage mapping
  const stages: { id: LeadStatus; label: string; index: number }[] = [
    { id: 'NEW', label: 'Inquiry', index: 1 },
    { id: 'CONTACTED', label: 'Contacted', index: 2 },
    { id: 'APPLICATION_SUBMITTED', label: 'App Submitted', index: 3 },
    { id: 'INTERESTED', label: 'Interview', index: 4 },
    { id: 'ADMISSION_CONFIRMED', label: 'Enrolled', index: 5 },
  ];

  const currentStageIndex =
    selectedLead.status === 'ADMISSION_CONFIRMED' || selectedLead.status === 'CONVERTED'
      ? 5
      : selectedLead.status === 'APPLICATION_SUBMITTED' || selectedLead.status === 'APPLICATION_STARTED'
      ? 3
      : selectedLead.status === 'INTERESTED'
      ? 4
      : selectedLead.status === 'CONTACTED'
      ? 2
      : 1;

  const handleStageSelect = (newStatus: LeadStatus) => {
    updateLead(selectedLead.id, { status: newStatus });
    showToast(`Admissions Stage updated to ${newStatus}`);
  };

  const handleSaveInteraction = () => {
    if (!logNotes.trim()) {
      showToast('Please enter interaction notes', undefined, 'warning');
      return;
    }

    addActivity({
      leadId: selectedLead.id,
      userId: 'current-user',
      userName: selectedLead.assignedCounsellorName || 'Officer',
      type: logChannel,
      title: `${logChannel} Logged: ${callOutcome}`,
      description: logNotes,
      outcome: callOutcome,
      createdAt: new Date().toISOString(),
    });

    setLogNotes('');
    setIsQuickLogOpen(false);
    showToast('Interaction logged to timeline');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#131b2e]/60 backdrop-blur-xs flex items-center justify-center p-0 md:p-4">
      <div className="w-full max-w-2xl bg-[#faf8ff] min-h-screen md:min-h-0 md:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Top Header Bar */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-[#eaedff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={closeLeadDetails}
              aria-label="Back to leads"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-[#434655] hover:bg-[#eaedff] transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <span className="font-semibold text-base text-[#131b2e]">Lead Details</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                showToast('Link copied to clipboard');
              }}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-[#434655] hover:bg-[#eaedff]"
              title="Share profile"
            >
              <span className="material-symbols-outlined text-[20px]">share</span>
            </button>
            <button
              onClick={closeLeadDetails}
              aria-label="Close"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-[#434655] hover:bg-[#eaedff]"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 space-y-4 pb-28 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {/* Top Hero Student Identification Block */}
          <div className="bg-white rounded-xl p-4 shadow-xs border border-[#eaedff] relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-[#dbe1ff] opacity-30 pointer-events-none blur-2xl"></div>

            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <img
                    className="w-14 h-14 rounded-full object-cover shadow-sm ring-2 ring-white"
                    src={selectedLead.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3RFbOM7C28E28lI4APUFP8aeAwKkDxW-DySMN4xf9PAMtL4A3K1rx2GPLQHpG-1u5HlZ929_JCCdRpRlbcjMCx77JxlQoIM1-uBEkyXVwGv8tFCapsbf66o8t1N8FsDPp0Ehe1Sfiqnp7HbktoRgE6F0yGCRY_0W3Ks40HvWy1rfDBbXBZxv7eR0_2eyvf0vwgSjPGah2VQgcF5r2CDTKydPrwH0rqjmcLrhp9qIdkdUFuw25uM7RvA'}
                    alt={selectedLead.name}
                  />
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-xs">
                    <span className="material-symbols-outlined text-[16px] text-[#007793] block" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified
                    </span>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-bold text-lg text-[#131b2e] truncate">{selectedLead.name}</h2>
                    <span className="bg-[#eaedff] px-2 py-0.5 rounded-full text-xs font-mono text-[#434655]">
                      {selectedLead.leadId}
                    </span>
                  </div>
                  <p className="text-xs text-[#434655] flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">school</span>
                    <span>{selectedLead.course} Applicant • {selectedLead.preferredIntake}</span>
                  </p>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  {selectedLead.status}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[11px] font-semibold">
                  <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    local_fire_department
                  </span>
                  {selectedLead.priority}
                </span>
              </div>
            </div>

            {/* Counselor Ownership Tag */}
            <div className="mt-3 pt-2 flex items-center justify-between bg-[#f2f3ff] rounded-lg p-2.5 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-[#004ac6] text-white text-[10px] font-bold flex items-center justify-center">
                  PS
                </div>
                <span className="text-[#434655] truncate">
                  Assigned: <strong className="text-[#131b2e] font-semibold">{selectedLead.assignedCounsellorName || 'Unassigned'}</strong>
                </span>
              </div>
              <button
                onClick={() => setIsReassignOpen(!isReassignOpen)}
                className="text-[11px] text-[#004ac6] font-semibold hover:underline cursor-pointer shrink-0"
              >
                Reassign
              </button>
            </div>

            {/* Reassign dropdown */}
            {isReassignOpen && (
              <div className="mt-2 p-2.5 bg-white rounded-lg border border-[#dae2fd] shadow-md space-y-2 animate-in fade-in duration-100">
                <span className="text-xs font-semibold text-[#131b2e] block">Select New Counsellor:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {counsellors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        updateLead(selectedLead.id, {
                          assignedCounsellorId: c.id,
                          assignedCounsellorName: c.name,
                        });
                        setIsReassignOpen(false);
                      }}
                      className="text-left text-xs p-2 rounded-md hover:bg-[#eaedff] transition-colors border border-[#f2f3ff]"
                    >
                      <strong className="block text-[#131b2e]">{c.name}</strong>
                      <span className="text-[10px] text-[#737686]">{c.title} • {c.activeLeadsCount} leads</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* High-Frequency Action Grid (Thumb-friendly) */}
            <div className="grid grid-cols-4 gap-2 mt-3 pt-1">
              <a
                href={`tel:${selectedLead.phone}`}
                onClick={() => showToast(`Calling ${selectedLead.name}...`)}
                className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] transition-all active:scale-95 group text-center"
              >
                <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#004ac6] group-hover:bg-[#004ac6] group-hover:text-white transition-colors shadow-xs mb-1">
                  <span className="material-symbols-outlined text-[18px]">call</span>
                </span>
                <span className="text-[11px] text-[#131b2e] font-semibold">Call</span>
              </a>

              <a
                href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-all active:scale-95 group text-center"
              >
                <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-xs mb-1">
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                </span>
                <span className="text-[11px] text-emerald-950 font-semibold">WhatsApp</span>
              </a>

              <a
                href={`mailto:${selectedLead.email}`}
                className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] transition-all active:scale-95 group text-center"
              >
                <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#005d73] group-hover:bg-[#005d73] group-hover:text-white transition-colors shadow-xs mb-1">
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                </span>
                <span className="text-[11px] text-[#131b2e] font-semibold">Email</span>
              </a>

              <button
                onClick={() => setIsScheduleFollowUpModalOpen(true)}
                className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-[#dbe1ff] hover:bg-[#b4c5ff] transition-all active:scale-95 group text-center"
              >
                <span className="w-8 h-8 rounded-full bg-[#004ac6] flex items-center justify-center text-white transition-colors shadow-xs mb-1">
                  <span className="material-symbols-outlined text-[18px]">event_repeat</span>
                </span>
                <span className="text-[11px] text-[#00174b] font-semibold">Follow-up</span>
              </button>
            </div>
          </div>

          {/* Segmented Tab Navigation */}
          <div className="flex items-center gap-1.5 p-1 bg-[#eaedff] rounded-xl overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'overview' ? 'bg-white text-[#004ac6] shadow-xs' : 'text-[#434655] hover:text-[#131b2e]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'timeline' ? 'bg-white text-[#004ac6] shadow-xs' : 'text-[#434655] hover:text-[#131b2e]'
              }`}
            >
              <span>Timeline</span>
              <span className="w-4 h-4 rounded-full bg-[#eaedff] text-[#131b2e] text-[10px] flex items-center justify-center font-bold">
                {leadActivities.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'documents' ? 'bg-white text-[#004ac6] shadow-xs' : 'text-[#434655] hover:text-[#131b2e]'
              }`}
            >
              Documents & Notes
            </button>
            <button
              onClick={() => setActiveTab('academic')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'academic' ? 'bg-white text-[#004ac6] shadow-xs' : 'text-[#434655] hover:text-[#131b2e]'
              }`}
            >
              Academic Profile
            </button>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              {/* Intent Score & Lead Age Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl p-3.5 shadow-xs border border-[#eaedff] flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#434655]">Intent Score</span>
                    <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">speed</span>
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-[#131b2e] tabular-nums">{selectedLead.leadScore}</span>
                    <span className="text-xs text-[#737686]">/100</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-[11px] font-semibold text-emerald-800">High Conversion Likelihood</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-3.5 shadow-xs border border-[#eaedff] flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#434655]">Lead Age</span>
                    <span className="w-7 h-7 rounded-lg bg-[#dbe1ff] text-[#004ac6] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-[#131b2e] tabular-nums">{leadAge}</span>
                    <span className="text-sm font-semibold text-[#131b2e]">Days</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    <span className="text-[11px] text-[#004ac6] font-medium">{ageCategory} Stage</span>
                  </div>
                </div>
              </div>

              {/* Scheduled Action Banner */}
              {selectedLead.nextFollowUpNote && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3.5 border border-amber-200/60 shadow-xs flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[20px]">notification_important</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Upcoming Action</span>
                      <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded-full text-[10px] font-semibold">
                        Scheduled
                      </span>
                    </div>
                    <p className="font-semibold text-xs sm:text-sm text-[#131b2e] mt-0.5">{selectedLead.nextFollowUpNote}</p>
                  </div>
                </div>
              )}

              {/* Target Admission Details Card */}
              <div className="bg-white rounded-xl p-4 shadow-xs border border-[#eaedff] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#004ac6] text-[20px]">assignment_turned_in</span>
                    <h3 className="font-semibold text-sm text-[#131b2e]">Target Admission Details</h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                  <div>
                    <span className="text-[#737686] block text-[11px]">Interested Program</span>
                    <strong className="text-[#131b2e] block mt-0.5 text-xs sm:text-sm">{selectedLead.course}</strong>
                  </div>
                  <div>
                    <span className="text-[#737686] block text-[11px]">Academic Intake</span>
                    <strong className="text-[#131b2e] block mt-0.5 text-xs sm:text-sm">{selectedLead.preferredIntake}</strong>
                  </div>
                  <div>
                    <span className="text-[#737686] block text-[11px]">Preferred Campus</span>
                    <span className="text-[#131b2e] font-medium block mt-0.5">{selectedLead.preferredCampus}</span>
                  </div>
                  <div>
                    <span className="text-[#737686] block text-[11px]">Estimated Budget</span>
                    <span className="text-[#131b2e] font-medium block mt-0.5">{selectedLead.budget}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-[#f2f3ff]">
                    <span className="text-[#737686] block text-[11px]">Attribution & Source</span>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#eaedff] text-[#131b2e] text-xs">
                        <span className="material-symbols-outlined text-[15px] text-[#005d73]">language</span>
                        <span>{selectedLead.source}</span>
                      </span>
                      {selectedLead.campaign && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#f2f3ff] text-[#434655] text-xs">
                          {selectedLead.campaign}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Candidate Contact & Background Card */}
              <div className="bg-white rounded-xl p-4 shadow-xs border border-[#eaedff] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#712ae2] text-[20px]">badge</span>
                    <h3 className="font-semibold text-sm text-[#131b2e]">Candidate Contact & Background</h3>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1 bg-[#f2f3ff] rounded-lg px-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="material-symbols-outlined text-[#434655] text-[18px]">smartphone</span>
                      <div className="min-w-0">
                        <span className="font-semibold text-xs text-[#131b2e] block truncate">{selectedLead.phone}</span>
                        <span className="text-[10px] text-emerald-700 flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[12px]">check_circle</span> Verified WhatsApp
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedLead.phone);
                        showToast('Phone number copied');
                      }}
                      className="w-7 h-7 rounded-lg bg-white text-[#004ac6] flex items-center justify-center shadow-xs"
                      title="Copy"
                    >
                      <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-1 bg-[#f2f3ff] rounded-lg px-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="material-symbols-outlined text-[#434655] text-[18px]">mail</span>
                      <div className="min-w-0">
                        <span className="font-semibold text-xs text-[#131b2e] block truncate">{selectedLead.email}</span>
                        <span className="text-[10px] text-[#737686]">Primary Personal Email</span>
                      </div>
                    </div>
                    <a
                      href={`mailto:${selectedLead.email}`}
                      className="w-7 h-7 rounded-lg bg-white text-[#004ac6] flex items-center justify-center shadow-xs"
                      title="Send email"
                    >
                      <span className="material-symbols-outlined text-[16px]">send</span>
                    </a>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2.5 rounded-lg bg-[#f2f3ff]">
                      <span className="text-[10px] text-[#737686] block">Highest Qualification</span>
                      <div className="font-bold text-sm text-[#004ac6] mt-0.5">{selectedLead.scorePercentage || '85%'}</div>
                      <span className="text-[10px] text-[#434655] mt-0.5 block">{selectedLead.qualification}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#f2f3ff]">
                      <span className="text-[10px] text-[#737686] block">Current Location</span>
                      <div className="font-bold text-sm text-[#131b2e] mt-0.5">{selectedLead.city}</div>
                      <span className="text-[10px] text-[#434655] block">{selectedLead.state}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admissions Journey Stage (Interactive 5-segment track) */}
              <div className="bg-white rounded-xl p-4 shadow-xs border border-[#eaedff]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-xs text-[#131b2e]">Admissions Journey Stage</h4>
                  <span className="text-xs font-semibold text-[#004ac6]">
                    Stage {currentStageIndex} of 5
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1.5 h-2 rounded-full overflow-hidden">
                  {[1, 2, 3, 4, 5].map((idx) => (
                    <div
                      key={idx}
                      className={`rounded-full transition-all ${
                        idx <= currentStageIndex ? 'bg-[#004ac6]' : 'bg-[#dae2fd]'
                      }`}
                    ></div>
                  ))}
                </div>

                {/* Stage chips selector */}
                <div className="grid grid-cols-5 gap-1 text-center mt-2.5">
                  {stages.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => handleStageSelect(st.id)}
                      className={`text-[10px] font-semibold py-1 rounded transition-colors ${
                        st.index <= currentStageIndex ? 'text-[#004ac6] font-bold' : 'text-[#737686] hover:bg-[#eaedff]'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Engagement Timeline */}
          {activeTab === 'timeline' && (
            <div className="bg-white rounded-xl p-4 shadow-xs border border-[#eaedff] space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#004ac6] text-[20px]">history</span>
                  <h3 className="font-semibold text-sm text-[#131b2e]">Engagement Timeline</h3>
                </div>
                <button
                  onClick={() => setIsQuickLogOpen(true)}
                  className="text-xs text-[#004ac6] font-semibold hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">add_task</span>
                  <span>+ Log Interaction</span>
                </button>
              </div>

              {/* Chronological Stem */}
              <div className="relative pl-6 flex flex-col gap-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#eaedff]">
                {leadActivities.length === 0 ? (
                  <p className="text-xs text-[#737686] py-3">No activity records logged yet.</p>
                ) : (
                  leadActivities.map((act) => (
                    <div key={act.id} className="relative flex flex-col gap-1 text-xs">
                      {/* Node Marker */}
                      <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-[#eaedff] text-[#004ac6] flex items-center justify-center shadow-xs">
                        <span className="material-symbols-outlined text-[12px]">
                          {act.type === 'CALL'
                            ? 'call'
                            : act.type === 'WHATSAPP'
                            ? 'chat'
                            : act.type === 'EMAIL'
                            ? 'mail'
                            : act.type === 'ASSIGNMENT'
                            ? 'auto_mode'
                            : 'edit_note'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-[#131b2e]">{act.title}</span>
                        <span className="text-[10px] text-[#737686]">{new Date(act.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="p-2.5 bg-[#f2f3ff] rounded-lg mt-0.5">
                        <p className="text-xs text-[#131b2e] leading-relaxed">{act.description}</p>
                        {act.attachment && (
                          <div className="mt-2 flex items-center gap-1 text-[11px] text-[#004ac6] bg-white px-2 py-1 rounded w-fit shadow-xs">
                            <span className="material-symbols-outlined text-[14px]">attach_file</span>
                            <span>{act.attachment.name}</span>
                          </div>
                        )}
                        <div className="mt-1 flex items-center justify-between text-[10px] text-[#737686]">
                          <span>Logged by: {act.userName}</span>
                          {act.outcome && <span className="font-semibold text-emerald-700">{act.outcome}</span>}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Documents & Notes */}
          {activeTab === 'documents' && (
            <div className="bg-white rounded-xl p-4 shadow-xs border border-[#eaedff] space-y-3 text-xs animate-in fade-in duration-150">
              <h3 className="font-semibold text-sm text-[#131b2e]">Remarks & Official Notes</h3>
              <div className="p-3 bg-[#f2f3ff] rounded-lg">
                <p className="text-[#131b2e] leading-relaxed">{selectedLead.remarks || 'No remarks recorded.'}</p>
              </div>

              <h3 className="font-semibold text-sm text-[#131b2e] pt-2">Submitted Academic Documents</h3>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between p-2.5 bg-[#f2f3ff] rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#004ac6] text-[18px]">description</span>
                    <span>12th Class Marksheet_CBSE.pdf</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Verified</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-[#f2f3ff] rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#712ae2] text-[18px]">badge</span>
                    <span>Aadhaar_Government_ID.pdf</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Verified</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-[#f2f3ff] rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-700 text-[18px]">receipt_long</span>
                    <span>Fee_Token_Receipt_2026.pdf</span>
                  </div>
                  <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Under Audit</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Academic Profile */}
          {activeTab === 'academic' && (
            <div className="bg-white rounded-xl p-4 shadow-xs border border-[#eaedff] space-y-3 text-xs animate-in fade-in duration-150">
              <h3 className="font-semibold text-sm text-[#131b2e]">Academic Eligibility Breakdown</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-[#f2f3ff] rounded-lg">
                  <span className="text-[10px] text-[#737686] block">Passing Year</span>
                  <strong className="text-sm text-[#131b2e]">{selectedLead.passingYear}</strong>
                </div>
                <div className="p-3 bg-[#f2f3ff] rounded-lg">
                  <span className="text-[10px] text-[#737686] block">Percentage Score</span>
                  <strong className="text-sm text-emerald-700">{selectedLead.scorePercentage || '88.4%'}</strong>
                </div>
                <div className="p-3 bg-[#f2f3ff] rounded-lg col-span-2">
                  <span className="text-[10px] text-[#737686] block">Eligibility Status</span>
                  <span className="text-xs font-semibold text-[#004ac6]">
                    ✓ Eligible for Merit Scholarship Slab S-1 (25% tuition fee waiver)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Persistent Floating Quick Action Bar (Bottom Screen Anchored) */}
        <div className="fixed md:absolute bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#eaedff] p-3 shadow-lg">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsQuickLogOpen(true)}
              className="flex-1 h-11 bg-[#004ac6] text-white rounded-xl font-semibold text-xs md:text-sm shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 hover:bg-[#003ea8]"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">add_task</span>
              <span>Log Interaction / Note</span>
            </button>
            <button
              onClick={() => {
                showToast(`Quick WhatsApp dispatch triggered for ${selectedLead.name}`);
                window.open(`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`, '_blank');
              }}
              className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center shrink-0 active:scale-95 transition-all shadow-xs"
              title="Instant WhatsApp"
            >
              <span className="material-symbols-outlined text-[20px]">chat</span>
            </button>
          </div>
        </div>

        {/* Quick Log Interaction Bottom Sheet Modal */}
        {isQuickLogOpen && (
          <div
            className="fixed inset-0 z-50 bg-[#131b2e]/50 backdrop-blur-xs flex items-end justify-center"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsQuickLogOpen(false);
            }}
          >
            <div className="w-full max-w-lg bg-white rounded-t-2xl p-4 md:p-6 shadow-2xl flex flex-col gap-3 animate-in slide-in-from-bottom duration-200">
              <div className="flex flex-col items-center">
                <div className="w-10 h-1 rounded-full bg-[#c3c6d7] mb-2"></div>
                <div className="w-full flex items-center justify-between">
                  <h3 className="font-bold text-base text-[#131b2e]">Log Interaction for {selectedLead.name}</h3>
                  <button
                    onClick={() => setIsQuickLogOpen(false)}
                    className="w-8 h-8 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#434655]"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              </div>

              {/* Channel Selector */}
              <div>
                <label className="text-xs font-semibold text-[#434655] block mb-1">Communication Channel</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['CALL', 'WHATSAPP', 'EMAIL', 'WALK_IN'] as ActivityType[]).map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setLogChannel(ch)}
                      className={`py-2 px-1 rounded-lg text-xs font-semibold text-center flex flex-col items-center gap-1 transition-all ${
                        logChannel === ch ? 'bg-[#004ac6] text-white shadow-xs' : 'bg-[#f2f3ff] text-[#434655] hover:bg-[#eaedff]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {ch === 'CALL' ? 'call' : ch === 'WHATSAPP' ? 'chat' : ch === 'EMAIL' ? 'mail' : 'directions_walk'}
                      </span>
                      <span>{ch === 'CALL' ? 'Phone' : ch === 'WHATSAPP' ? 'WhatsApp' : ch === 'EMAIL' ? 'Email' : 'Walk-in'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Outcome Radio Pills */}
              <div>
                <label className="text-xs font-semibold text-[#434655] block mb-1">Call Outcome</label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    'Connected • Positive',
                    'Ringing No Answer',
                    'Callback Requested',
                    'Fee Query Pending',
                  ].map((oc) => (
                    <button
                      key={oc}
                      type="button"
                      onClick={() => setCallOutcome(oc)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        callOutcome === oc
                          ? 'bg-[#004ac6] text-white shadow-xs font-semibold'
                          : 'bg-[#f2f3ff] text-[#434655] hover:bg-[#eaedff]'
                      }`}
                    >
                      {oc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note Textarea */}
              <div>
                <label className="text-xs font-semibold text-[#434655] block mb-1">Interaction Notes & Action Item</label>
                <textarea
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  className="w-full rounded-xl bg-[#f2f3ff] p-3 text-xs md:text-sm text-[#131b2e] placeholder:text-[#737686] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#004ac6] transition-all resize-none border border-[#dae2fd]"
                  placeholder="Enter key conversation points, parent questions, scholarship details..."
                  rows={3}
                />
              </div>

              <button
                onClick={handleSaveInteraction}
                className="w-full h-11 bg-[#004ac6] text-white rounded-xl text-xs md:text-sm font-semibold shadow-sm hover:bg-[#003ea8] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                <span>Save Note & Update Lead</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
