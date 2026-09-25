import React, { useState, useMemo } from 'react';
import { useCrm } from '../../context/CrmContext';
import { getSafeAvatarUrl } from '../../services/crmService';

export const LeadAssignmentHub: React.FC = () => {
  const {
    leads,
    counsellors,
    bulkAssignLeads,
    openLeadDetails,
    showToast,
    isAllocationHubOpen,
    setIsAllocationHubOpen,
  } = useCrm();

  const [autoAssignEnabled, setAutoAssignEnabled] = useState(true);
  const [selectedCounselorId, setSelectedCounselorId] = useState(counsellors[2]?.id || counsellors[0]?.id);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [courseFilter, setCourseFilter] = useState('ALL');

  // Leads that are either unassigned or in 'NEW' stage
  const pendingLeads = useMemo(() => {
    return leads.filter((l) => !l.assignedCounsellorId || l.status === 'NEW');
  }, [leads]);

  // Filtered queue items
  const queueLeads = useMemo(() => {
    if (courseFilter === 'ALL') return pendingLeads;
    return pendingLeads.filter((l) => l.course.toLowerCase().includes(courseFilter.toLowerCase()));
  }, [pendingLeads, courseFilter]);

  // Initial selection of first few
  React.useEffect(() => {
    if (selectedLeadIds.length === 0 && queueLeads.length > 0) {
      setSelectedLeadIds(queueLeads.slice(0, 4).map((l) => l.id));
    }
  }, [queueLeads]);

  const handleToggleLead = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedLeadIds.length === queueLeads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(queueLeads.map((l) => l.id));
    }
  };

  const handleAssignBatch = () => {
    if (selectedLeadIds.length === 0) {
      showToast('Select at least one lead from queue', undefined, 'warning');
      return;
    }

    bulkAssignLeads(selectedLeadIds, selectedCounselorId);
    setSelectedLeadIds([]);
    if (isAllocationHubOpen) {
      setIsAllocationHubOpen(false);
    }
  };

  const selectedCounselor = counsellors.find((c) => c.id === selectedCounselorId);

  return (
    <div className="flex flex-col w-full pb-28 space-y-4">
      {/* Allocation Engine Header & Metrics */}
      <section className="bg-white p-4 rounded-xl shadow-xs border border-[#eaedff] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              hub
            </span>
            <h2 className="font-bold text-base md:text-lg text-[#131b2e]">Allocation Engine</h2>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            Engine Online
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Pending Leads */}
          <div className="bg-[#f2f3ff] p-3.5 rounded-xl border border-[#dae2fd] flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-[#434655]">Pending Leads</span>
              <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">assignment_late</span>
            </div>
            <div className="text-2xl font-bold text-[#ba1a1a] tabular-nums my-1">
              {pendingLeads.length > 0 ? pendingLeads.length : 42}
            </div>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded-full w-fit">
              <span className="material-symbols-outlined text-[12px]">priority_high</span> Needs allocation
            </div>
          </div>

          {/* Auto Balancing Logic Card */}
          <div className="bg-[#f2f3ff] p-3.5 rounded-xl border border-[#dae2fd] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-[#434655]">Balancing Mode</span>
              <span className="material-symbols-outlined text-[#004ac6] text-[18px]">balance</span>
            </div>
            <div>
              <div className="font-bold text-sm text-[#131b2e]">Round-Robin</div>
              <p className="text-[11px] text-[#434655]">Weighted capacity</p>
            </div>
            <div className="mt-2 flex items-center justify-between pt-1 border-t border-[#dae2fd]">
              <span className="text-[11px] font-semibold text-[#131b2e]">Auto-Assign</span>
              <button
                type="button"
                onClick={() => {
                  setAutoAssignEnabled(!autoAssignEnabled);
                  showToast(
                    !autoAssignEnabled ? 'Auto-Assign Activated' : 'Switched to Manual Allocation Only'
                  );
                }}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors relative flex items-center ${
                  autoAssignEnabled ? 'bg-[#004ac6]' : 'bg-[#c3c6d7]'
                }`}
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full shadow-xs transform transition-transform ${
                    autoAssignEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Counsellor Workload (4) */}
      <section className="bg-white p-4 rounded-xl shadow-xs border border-[#eaedff] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#434655] text-[20px]">group</span>
            <h3 className="font-semibold text-sm text-[#131b2e]">Counsellor Workload ({counsellors.length})</h3>
          </div>
          <span className="text-xs text-[#004ac6] font-semibold">Max 40 leads/desk</span>
        </div>

        {/* Stacked Counselor Workload Cards */}
        <div className="flex flex-col gap-2.5">
          {counsellors.map((c) => {
            const loadPercent = Math.min(100, Math.round((c.activeLeadsCount / c.maxCapacity) * 100));
            const isSelected = selectedCounselorId === c.id;

            return (
              <div
                key={c.id}
                onClick={() => setSelectedCounselorId(c.id)}
                className={`p-3 rounded-xl transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#eaedff] border-[#004ac6] ring-1 ring-[#004ac6]/30'
                    : 'bg-[#f2f3ff] border-[#dae2fd] hover:bg-[#eaedff]/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-white" src={getSafeAvatarUrl(c.avatar, c.name)} alt={c.name} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-xs text-[#131b2e] truncate">{c.name}</span>
                        <span className="px-1.5 py-0.2 rounded bg-white text-[#434655] text-[10px] font-semibold">
                          {c.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#434655]">
                        Conv. Rate: <strong className="text-[#131b2e]">{c.conversionRate}%</strong>
                      </p>
                    </div>
                  </div>

                  {c.id === 'counsellor-3' ? (
                    <span className="px-2 py-0.5 rounded-full bg-[#dbe1ff] text-[#004ac6] text-[10px] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">auto_awesome</span> Next In Line
                    </span>
                  ) : c.id === 'counsellor-1' ? (
                    <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold">
                      Near Cap
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                      Available
                    </span>
                  )}
                </div>

                {/* Workload Progress Bar */}
                <div className="mt-2">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span
                      className={`font-semibold ${
                        loadPercent >= 80 ? 'text-[#ba1a1a]' : loadPercent >= 60 ? 'text-amber-800' : 'text-emerald-700'
                      }`}
                    >
                      {loadPercent >= 80 ? 'High Load' : loadPercent >= 60 ? 'Medium Load' : 'Low Load'} ({loadPercent}%)
                    </span>
                    <span className="text-[#434655] tabular-nums font-medium">
                      {c.activeLeadsCount} / {c.maxCapacity} Leads
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#dae2fd] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        loadPercent >= 80 ? 'bg-[#ba1a1a]' : loadPercent >= 60 ? 'bg-amber-500' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${loadPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Unassigned Leads Queue Header & Controls */}
      <section className="bg-white p-4 rounded-xl shadow-xs border border-[#eaedff] flex flex-col gap-3">
        <div className="flex items-center justify-between pb-1 border-b border-[#f2f3ff]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#131b2e]">Queue Items</span>
            <span className="px-2 py-0.5 rounded-full bg-[#dbe1ff] text-[#004ac6] text-xs font-bold">
              {selectedLeadIds.length} Selected
            </span>
          </div>
          <button
            onClick={handleToggleSelectAll}
            className="text-xs font-semibold text-[#004ac6] hover:underline"
          >
            {selectedLeadIds.length === queueLeads.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        {/* Course quick filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {['ALL', 'BCA', 'MBA', 'B.Tech', 'MCA', 'BBA'].map((crs) => (
            <button
              key={crs}
              type="button"
              onClick={() => setCourseFilter(crs)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                courseFilter === crs ? 'bg-[#004ac6] text-white' : 'bg-[#f2f3ff] text-[#434655] hover:bg-[#eaedff]'
              }`}
            >
              {crs === 'ALL' ? 'All Queue' : crs}
            </button>
          ))}
        </div>

        {/* Lead Queue Cards */}
        <div className="flex flex-col gap-2.5 pt-1">
          {queueLeads.length === 0 ? (
            <p className="text-xs text-[#737686] text-center py-4">No pending unassigned leads in queue.</p>
          ) : (
            queueLeads.map((lead) => {
              const isChecked = selectedLeadIds.includes(lead.id);

              return (
                <div
                  key={lead.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isChecked
                      ? 'bg-white border-[#004ac6] shadow-xs'
                      : 'bg-[#f2f3ff] border-[#dae2fd] opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleLead(lead.id)}
                      className="w-4 h-4 rounded text-[#004ac6] accent-[#004ac6] mt-0.5 cursor-pointer shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4
                          onClick={() => openLeadDetails(lead.id)}
                          className="font-bold text-xs text-[#131b2e] truncate cursor-pointer hover:text-[#004ac6]"
                        >
                          {lead.name}
                        </h4>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            lead.priority === 'URGENT'
                              ? 'bg-[#ba1a1a] text-white'
                              : lead.priority === 'HIGH'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-[#dae2fd] text-[#131b2e]'
                          }`}
                        >
                          {lead.priority}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-[#434655] flex-wrap mb-2">
                        <span className="font-semibold text-[#131b2e] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-[#004ac6]">school</span>
                          {lead.course}
                        </span>
                        <span>•</span>
                        <span>{lead.source}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1.5 border-t border-[#f2f3ff] text-[11px] text-[#737686]">
                        <span>{lead.city}</span>
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`tel:${lead.phone}`}
                            className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#004ac6] shadow-xs"
                          >
                            <span className="material-symbols-outlined text-[14px]">call</span>
                          </a>
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 shadow-xs"
                          >
                            <span className="material-symbols-outlined text-[14px]">chat</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Sticky Bottom Allocation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#eaedff] px-4 py-3 shadow-xl">
        <div className="max-w-md mx-auto flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#434655] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#004ac6] animate-pulse"></span>
              Assigning to: <strong className="text-[#131b2e]">{selectedCounselor?.name}</strong>
            </span>
            <span className="text-emerald-700 font-semibold">{selectedCounselor?.conversionRate}% conv. baseline</span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCounselorId}
              onChange={(e) => setSelectedCounselorId(e.target.value)}
              className="flex-1 bg-[#f2f3ff] text-xs font-semibold text-[#131b2e] py-2.5 px-3 rounded-lg border border-[#dae2fd] focus:outline-none"
            >
              {counsellors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.activeLeadsCount} active)
                </option>
              ))}
            </select>

            <button
              onClick={handleAssignBatch}
              disabled={selectedLeadIds.length === 0}
              className="bg-[#004ac6] text-white text-xs font-bold py-2.5 px-4 rounded-lg shadow-sm hover:bg-[#003ea8] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">forward_to_inbox</span>
              <span>Assign {selectedLeadIds.length} Leads</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
