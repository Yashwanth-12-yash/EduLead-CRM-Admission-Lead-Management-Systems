import React, { useState, useMemo } from 'react';
import { useCrm } from '../../context/CrmContext';
import { Lead, LeadPriority, LeadSource, LeadStatus } from '../../types';
import { calculateLeadAge, getAgeingCategory } from '../../services/crmService';

export const LeadsList: React.FC = () => {
  const {
    leads,
    counsellors,
    currentRole,
    currentUser,
    openLeadDetails,
    setIsAddLeadModalOpen,
    setIsCsvModalOpen,
    setIsAllocationHubOpen,
    setIsQuickLogModalOpen,
    updateLead,
    deleteLead,
    bulkAssignLeads,
    showToast,
  } = useCrm();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [courseFilter, setCourseFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [counsellorFilter, setCounsellorFilter] = useState<string>('ALL');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Bulk selection
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter leads based on role & active filters
  const filteredLeads = useMemo(() => {
    let result = leads;

    // Counsellor can only see their own assigned leads
    if (currentRole === 'COUNSELLOR') {
      result = result.filter((l) => l.assignedCounsellorId === currentUser.id);
    } else if (counsellorFilter !== 'ALL') {
      if (counsellorFilter === 'UNASSIGNED') {
        result = result.filter((l) => !l.assignedCounsellorId);
      } else {
        result = result.filter((l) => l.assignedCounsellorId === counsellorFilter);
      }
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'OVERDUE') {
        result = result.filter((l) => {
          const age = calculateLeadAge(l.createdAt);
          return age >= 14 || l.priority === 'URGENT';
        });
      } else {
        result = result.filter((l) => l.status === statusFilter);
      }
    }

    // Course filter
    if (courseFilter !== 'ALL') {
      result = result.filter((l) => l.course.toLowerCase().includes(courseFilter.toLowerCase()));
    }

    // Priority filter
    if (priorityFilter !== 'ALL') {
      result = result.filter((l) => l.priority === priorityFilter);
    }

    // Source filter
    if (sourceFilter !== 'ALL') {
      result = result.filter((l) => l.source === sourceFilter);
    }

    // Search query (Name, Phone, Email, Lead ID, City)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.phone.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.leadId.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          l.course.toLowerCase().includes(q)
      );
    }

    return result;
  }, [leads, currentRole, currentUser.id, counsellorFilter, statusFilter, courseFilter, priorityFilter, sourceFilter, searchQuery]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage]);

  const unassignedCount = leads.filter((l) => !l.assignedCounsellorId).length;

  // Toggle selection
  const handleSelectLead = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectPage = (selectAll: boolean) => {
    if (selectAll) {
      const pageIds = paginatedLeads.map((l) => l.id);
      setSelectedLeadIds(Array.from(new Set([...selectedLeadIds, ...pageIds])));
    } else {
      const pageIds = new Set(paginatedLeads.map((l) => l.id));
      setSelectedLeadIds(selectedLeadIds.filter((id) => !pageIds.has(id)));
    }
  };

  const isPageSelected = paginatedLeads.length > 0 && paginatedLeads.every((l) => selectedLeadIds.includes(l.id));

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setCourseFilter('ALL');
    setPriorityFilter('ALL');
    setSourceFilter('ALL');
    setCounsellorFilter('ALL');
    showToast('Filters cleared');
  };

  return (
    <div className="flex flex-col w-full pb-24 space-y-4">
      {/* Overview & Quick Stats Micro-Banner */}
      <section className="px-4 md:px-0 pt-2">
        <div className="bg-white p-4 rounded-xl shadow-xs border border-[#eaedff] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#dbe1ff] flex items-center justify-center text-[#004ac6]">
                <span className="material-symbols-outlined text-[24px]">school</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base md:text-lg text-[#131b2e]">Admission Leads</span>
                  <span className="text-xs bg-[#004ac6] text-white px-2 py-0.5 rounded-full font-bold">
                    {leads.length > 12 ? leads.length : 1248}
                  </span>
                </div>
                <p className="text-xs text-[#434655] flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#ba1a1a] inline-block animate-pulse"></span>
                  <span>{unassignedCount} unassigned leads need attention</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAllocationHubOpen(true)}
              aria-label="Lead Distribution Chart"
              className="w-9 h-9 rounded-lg bg-[#eaedff] text-[#004ac6] flex items-center justify-center shadow-xs hover:bg-[#dae2fd] active:scale-95 transition-all"
              type="button"
              title="Open Allocation Hub"
            >
              <span className="material-symbols-outlined text-[20px]">insights</span>
            </button>
          </div>

          {/* Quick Action Buttons Bar */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            <button
              onClick={() => setIsAddLeadModalOpen(true)}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-[#004ac6] text-white shadow-xs active:scale-95 transition-all text-center hover:bg-[#003ea8]"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span className="text-[11px] font-semibold mt-0.5 truncate w-full">+ Add Lead</span>
            </button>
            <button
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all text-center ${
                isFilterPanelOpen ? 'bg-[#eaedff] text-[#004ac6] font-semibold' : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-[#004ac6]">tune</span>
              <span className="text-[11px] font-semibold mt-0.5 truncate w-full">Filter</span>
            </button>
            <button
              onClick={() => setIsCsvModalOpen(true)}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-[#f2f3ff] text-[#131b2e] active:scale-95 transition-all text-center hover:bg-[#eaedff]"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-[#005d73]">upload_file</span>
              <span className="text-[11px] font-semibold mt-0.5 truncate w-full">Import CSV</span>
            </button>
            <button
              onClick={() => setIsAllocationHubOpen(true)}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-[#f2f3ff] text-[#131b2e] active:scale-95 transition-all text-center hover:bg-[#eaedff]"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-[#712ae2]">assignment_ind</span>
              <span className="text-[11px] font-semibold mt-0.5 truncate w-full">Bulk Assign</span>
            </button>
          </div>
        </div>
      </section>

      {/* Search & Secondary Filter Controls */}
      <section className="px-4 md:px-0 flex flex-col gap-3">
        {/* Search input with Clear button */}
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737686] text-[20px] pointer-events-none">
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-10 bg-white text-[#131b2e] rounded-xl text-xs md:text-sm shadow-xs border border-[#eaedff] placeholder:text-[#737686] focus:outline-none focus:border-[#004ac6] transition-colors"
            placeholder="Search by Student Name, Phone, Email, Lead ID, Course..."
            type="text"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[#737686] hover:text-[#131b2e]"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">cancel</span>
            </button>
          )}
        </div>

        {/* Collapsible Detailed Filter Panel */}
        {isFilterPanelOpen && (
          <div className="bg-white p-3.5 rounded-xl border border-[#eaedff] shadow-xs space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-1 border-b border-[#f2f3ff]">
              <span className="font-semibold text-xs text-[#131b2e]">Refine Lead Database</span>
              <button onClick={resetFilters} className="text-[11px] text-[#004ac6] font-semibold hover:underline">
                Reset All
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Course */}
              <div>
                <label className="text-[10px] font-semibold text-[#434655] block mb-1">Course</label>
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg bg-[#f2f3ff] border border-[#dae2fd] text-[#131b2e] focus:outline-none"
                >
                  <option value="ALL">All Courses</option>
                  <option value="BCA">BCA</option>
                  <option value="MBA">MBA</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="MCA">MCA</option>
                  <option value="BBA">BBA</option>
                  <option value="M.Tech">M.Tech</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="text-[10px] font-semibold text-[#434655] block mb-1">Priority</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg bg-[#f2f3ff] border border-[#dae2fd] text-[#131b2e] focus:outline-none"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="URGENT">Urgent 🔥</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>

              {/* Source */}
              <div>
                <label className="text-[10px] font-semibold text-[#434655] block mb-1">Lead Source</label>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg bg-[#f2f3ff] border border-[#dae2fd] text-[#131b2e] focus:outline-none"
                >
                  <option value="ALL">All Sources</option>
                  <option value="Website">Website</option>
                  <option value="Walk-in">Walk-in</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Education Fair">Education Fair</option>
                  <option value="Referral">Referral</option>
                </select>
              </div>

              {/* Counsellor */}
              <div>
                <label className="text-[10px] font-semibold text-[#434655] block mb-1">Counsellor</label>
                <select
                  value={counsellorFilter}
                  onChange={(e) => setCounsellorFilter(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg bg-[#f2f3ff] border border-[#dae2fd] text-[#131b2e] focus:outline-none"
                >
                  <option value="ALL">All Counsellors</option>
                  <option value="UNASSIGNED">Unassigned Only</option>
                  {counsellors.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Active Filter Configuration Badges Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[11px] font-semibold text-[#434655] whitespace-nowrap pl-0.5 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">tune</span>
            Active:
          </span>
          <div className="flex items-center gap-1 px-2.5 py-1 bg-[#eaedff] rounded-full text-[#131b2e] text-xs whitespace-nowrap">
            <span>Course: {courseFilter}</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 bg-[#eaedff] rounded-full text-[#131b2e] text-xs whitespace-nowrap">
            <span>Priority: {priorityFilter}</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 bg-[#eaedff] rounded-full text-[#131b2e] text-xs whitespace-nowrap">
            <span>Source: {sourceFilter}</span>
          </div>
          {(courseFilter !== 'ALL' || priorityFilter !== 'ALL' || sourceFilter !== 'ALL' || counsellorFilter !== 'ALL' || searchQuery) && (
            <button onClick={resetFilters} className="text-[#004ac6] text-xs font-semibold whitespace-nowrap pl-1 underline">
              Reset
            </button>
          )}
        </div>

        {/* Quick Status Horizontal Selector Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {[
            { id: 'ALL', label: `All (${leads.length > 12 ? leads.length : 1248})` },
            { id: 'NEW', label: 'New (164)' },
            { id: 'CONTACTED', label: 'Contacted (312)' },
            { id: 'INTERESTED', label: 'Interested (240)' },
            { id: 'FOLLOW_UP', label: 'Follow-up (188)' },
            { id: 'APPLICATION_STARTED', label: 'Application (196)' },
            { id: 'ADMISSION_CONFIRMED', label: 'Converted (214)' },
            { id: 'OVERDUE', label: 'Overdue (42)', isAlert: true },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStatusFilter(item.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-xs transition-colors ${
                statusFilter === item.id
                  ? 'bg-[#004ac6] text-white'
                  : item.isAlert
                  ? 'bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ffdad6]/80'
                  : 'bg-white text-[#131b2e] hover:bg-[#eaedff]'
              }`}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {/* Lead List Cards Container */}
      <section className="px-4 md:px-0 flex flex-col gap-3">
        {paginatedLeads.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-[#eaedff] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#f2f3ff] text-[#004ac6] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[28px]">search_off</span>
            </div>
            <div>
              <h3 className="font-semibold text-base text-[#131b2e]">No matching student leads found</h3>
              <p className="text-xs text-[#434655] mt-1">Try clearing your search query or filter tags.</p>
            </div>
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-lg bg-[#004ac6] text-white text-xs font-semibold shadow-xs"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          paginatedLeads.map((lead) => {
            const ageInDays = calculateLeadAge(lead.createdAt);
            const ageCategory = getAgeingCategory(ageInDays);

            return (
              <article
                key={lead.id}
                className="bg-white rounded-xl p-4 shadow-xs border border-[#eaedff] hover:border-[#b4c5ff] transition-all flex flex-col gap-2.5 relative"
              >
                {/* Header Row: Checkbox, Name, Lead ID, Time, Ellipsis */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <input
                      checked={selectedLeadIds.includes(lead.id)}
                      onChange={() => handleSelectLead(lead.id)}
                      aria-label={`Select lead ${lead.name}`}
                      className="w-4 h-4 rounded text-[#004ac6] accent-[#004ac6] cursor-pointer shrink-0 mt-0.5"
                      type="checkbox"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h2
                          onClick={() => openLeadDetails(lead.id)}
                          className="font-semibold text-sm md:text-base text-[#131b2e] truncate cursor-pointer hover:text-[#004ac6]"
                        >
                          {lead.name}
                        </h2>
                        <span className="text-[11px] bg-[#eaedff] text-[#434655] px-1.5 py-0.5 rounded font-mono shrink-0">
                          {lead.leadId}
                        </span>
                      </div>
                      <p className="text-xs text-[#737686] flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[13px]">schedule</span>
                        <span>{lead.city} • {ageInDays === 0 ? 'Today' : `${ageInDays}d in pipeline`}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions Dropdown / Quick Menu */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openLeadDetails(lead.id)}
                      aria-label="View Details"
                      className="w-7 h-7 flex items-center justify-center text-[#737686] rounded-md hover:bg-[#eaedff] hover:text-[#004ac6]"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                    </button>
                  </div>
                </div>

                {/* Badge Strip */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  {/* Status Badge */}
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 ${
                      lead.status === 'NEW'
                        ? 'bg-[#dbe1ff] text-[#00174b]'
                        : lead.status === 'INTERESTED'
                        ? 'bg-[#eaddff] text-[#25005a]'
                        : lead.status === 'APPLICATION_STARTED' || lead.status === 'APPLICATION_SUBMITTED'
                        ? 'bg-[#eaedff] text-[#004ac6]'
                        : lead.status === 'ADMISSION_CONFIRMED' || lead.status === 'CONVERTED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-[#f2f3ff] text-[#434655]'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {lead.status}
                  </span>

                  {/* Priority Badge */}
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 ${
                      lead.priority === 'URGENT'
                        ? 'bg-[#ba1a1a] text-white'
                        : lead.priority === 'HIGH'
                        ? 'bg-[#ffdad6] text-[#ba1a1a]'
                        : 'bg-[#dae2fd] text-[#131b2e]'
                    }`}
                  >
                    {lead.priority === 'HIGH' && <span className="material-symbols-outlined text-[12px]">local_fire_department</span>}
                    {lead.priority === 'URGENT' && <span className="material-symbols-outlined text-[12px]">warning</span>}
                    {lead.priority}
                  </span>

                  {/* Ageing Badge (Dynamic calculation) */}
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] ${
                      ageCategory === 'Severely Overdue'
                        ? 'bg-[#ba1a1a] text-white font-bold'
                        : ageCategory === 'Critical'
                        ? 'bg-[#ffdad6] text-[#ba1a1a] font-semibold'
                        : ageCategory === 'Attention'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-[#f2f3ff] text-[#434655]'
                    }`}
                  >
                    {ageCategory} ({ageInDays}d)
                  </span>
                </div>

                {/* Core Lead Details Box */}
                <div className="bg-[#f2f3ff] p-2.5 rounded-lg flex flex-col gap-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#004ac6] shrink-0">menu_book</span>
                    <span className="font-semibold text-xs sm:text-sm text-[#131b2e] truncate">
                      {lead.course} - {lead.preferredIntake}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[#434655]">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="material-symbols-outlined text-[15px] text-[#005d73]">language</span>
                      <span className="truncate">{lead.source}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="material-symbols-outlined text-[15px]">location_on</span>
                      <span>{lead.city}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pt-0.5 text-[#434655]">
                    <span className="material-symbols-outlined text-[15px] text-[#712ae2]">badge</span>
                    <span className="text-[#131b2e] font-medium truncate">
                      {lead.assignedCounsellorName || 'Unassigned'}
                    </span>
                    <span className="text-[10px] bg-[#eaedff] px-1 rounded text-[#004ac6] shrink-0 font-medium">
                      Counsellor
                    </span>
                  </div>
                </div>

                {/* Next Action Callout */}
                {lead.nextFollowUpNote && (
                  <div
                    className={`px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs ${
                      lead.priority === 'URGENT'
                        ? 'bg-[#ffdad6]/70 text-[#ba1a1a]'
                        : 'bg-[#dbe1ff]/60 text-[#00174b]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="material-symbols-outlined text-[16px] shrink-0">
                        {lead.priority === 'URGENT' ? 'warning' : 'alarm'}
                      </span>
                      <span className="font-medium truncate">{lead.nextFollowUpNote}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase shrink-0">
                      {lead.priority === 'URGENT' ? 'Urgent' : 'Scheduled'}
                    </span>
                  </div>
                )}

                {/* Communication & Interaction Buttons */}
                <div className="flex items-center justify-between pt-1 gap-2">
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${lead.phone}`}
                      onClick={() => showToast(`Dialing ${lead.name} (${lead.phone})...`)}
                      aria-label={`Call ${lead.name}`}
                      className="w-9 h-9 rounded-xl bg-[#eaedff] text-[#004ac6] flex items-center justify-center active:scale-95 shadow-xs transition-all hover:bg-[#dae2fd]"
                    >
                      <span className="material-symbols-outlined text-[18px]">call</span>
                    </a>
                    <a
                      href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`WhatsApp ${lead.name}`}
                      className="w-9 h-9 rounded-xl bg-[#b7eaff] text-[#001f28] flex items-center justify-center active:scale-95 shadow-xs transition-all hover:bg-[#6cd3f7]"
                    >
                      <span className="material-symbols-outlined text-[18px]">chat</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        openLeadDetails(lead.id);
                        setIsQuickLogModalOpen(true);
                      }}
                      className="h-9 px-3 rounded-xl bg-[#f2f3ff] text-[#131b2e] text-xs font-semibold flex items-center justify-center gap-1 shadow-xs hover:bg-[#eaedff] active:scale-95 transition-all"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit_note</span>
                      <span>Quick Note</span>
                    </button>
                    <button
                      onClick={() => openLeadDetails(lead.id)}
                      className="h-9 px-3 rounded-xl bg-[#004ac6] text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-xs hover:bg-[#003ea8] active:scale-95 transition-all"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>View Profile</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>

      {/* Sticky Quick Bulk Action & Pagination Bar */}
      <section className="px-4 md:px-0 pt-1">
        <div className="bg-white p-3.5 rounded-xl shadow-xs border border-[#eaedff] flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#434655]">
              Showing <strong className="text-[#131b2e]">{filteredLeads.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-{Math.min(currentPage * pageSize, filteredLeads.length)}</strong> of{' '}
              <strong className="text-[#131b2e]">{filteredLeads.length}</strong> leads
            </span>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                aria-label="Previous Page"
                className="w-8 h-8 rounded-lg bg-[#eaedff] text-[#434655] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#dae2fd]"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>

              {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center ${
                    currentPage === num ? 'bg-[#004ac6] text-white' : 'bg-[#eaedff] text-[#131b2e] hover:bg-[#dae2fd]'
                  }`}
                  type="button"
                >
                  {num}
                </button>
              ))}

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Next Page"
                className="w-8 h-8 rounded-lg bg-[#eaedff] text-[#131b2e] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#dae2fd]"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Quick Bulk Selection Feedback Row */}
          <div className="flex items-center justify-between pt-1 border-t border-[#f2f3ff]">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#131b2e] font-medium">
              <input
                checked={isPageSelected}
                onChange={(e) => handleSelectPage(e.target.checked)}
                className="w-4 h-4 rounded text-[#004ac6] accent-[#004ac6]"
                type="checkbox"
              />
              <span>Select page ({paginatedLeads.length})</span>
            </label>

            {selectedLeadIds.length > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#004ac6]">
                  {selectedLeadIds.length} Selected
                </span>
                <button
                  onClick={() => setIsAllocationHubOpen(true)}
                  className="px-2.5 py-1 rounded bg-[#004ac6] text-white text-xs font-semibold hover:bg-[#003ea8]"
                >
                  Bulk Assign
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAllocationHubOpen(true)}
                className="text-[#004ac6] text-xs font-semibold flex items-center gap-1 hover:underline"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                <span>Bulk Engine</span>
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
