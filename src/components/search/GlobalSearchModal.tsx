import React, { useState, useMemo } from 'react';
import { useCrm } from '../../context/CrmContext';
import { getSafeAvatarUrl } from '../../services/crmService';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    leads,
    courses,
    counsellors,
    campaigns,
    openLeadDetails,
    setActiveTab,
  } = useCrm();

  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        matchedLeads: leads.slice(0, 4),
        matchedCourses: courses.slice(0, 2),
        matchedCounsellors: counsellors.slice(0, 2),
        matchedCampaigns: campaigns.slice(0, 2),
      };
    }

    return {
      matchedLeads: leads.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.phone.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.leadId.toLowerCase().includes(q) ||
          l.course.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q)
      ),
      matchedCourses: courses.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.department.toLowerCase().includes(q)
      ),
      matchedCounsellors: counsellors.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.specialization && c.specialization.toLowerCase().includes(q))
      ),
      matchedCampaigns: campaigns.filter(
        (cam) =>
          cam.name.toLowerCase().includes(q) ||
          cam.source.toLowerCase().includes(q)
      ),
    };
  }, [query, leads, courses, counsellors, campaigns]);

  if (!isSearchModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-xs flex items-start justify-center p-4 pt-16 sm:pt-20"
      onClick={() => setIsSearchModalOpen(false)}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#eaedff] flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-[#eaedff] flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[#004ac6] text-[22px]">search</span>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leads, courses, counselors, campaigns..."
            className="flex-1 bg-transparent text-sm text-[#131b2e] placeholder:text-[#737686] focus:outline-none"
          />
          {query ? (
            <button onClick={() => setQuery('')} className="text-[#737686] hover:text-[#131b2e]">
              <span className="material-symbols-outlined text-[18px]">cancel</span>
            </button>
          ) : (
            <span className="text-[10px] bg-[#eaedff] text-[#434655] px-1.5 py-0.5 rounded font-mono">
              ESC
            </span>
          )}
        </div>

        {/* Categorized Search Results */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-3.5">
          {/* Section: Leads */}
          {searchResults.matchedLeads.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-[#737686] uppercase tracking-wider px-2 block mb-1">
                Student Leads ({searchResults.matchedLeads.length})
              </span>
              <div className="space-y-1">
                {searchResults.matchedLeads.slice(0, 5).map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      openLeadDetails(l.id);
                      setIsSearchModalOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-[#eaedff] transition-colors flex items-center justify-between text-xs group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="material-symbols-outlined text-[#004ac6] text-[18px]">person</span>
                      <div className="truncate">
                        <strong className="text-[#131b2e] block truncate group-hover:text-[#004ac6]">{l.name}</strong>
                        <span className="text-[11px] text-[#737686]">{l.leadId} • {l.course} • {l.city}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-[#004ac6] bg-[#dbe1ff] px-2 py-0.5 rounded-full shrink-0">
                      {l.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section: Courses */}
          {searchResults.matchedCourses.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-[#737686] uppercase tracking-wider px-2 block mb-1">
                Academic Programs ({searchResults.matchedCourses.length})
              </span>
              <div className="space-y-1">
                {searchResults.matchedCourses.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveTab('courses');
                      setIsSearchModalOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-[#eaedff] transition-colors flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#712ae2] text-[18px]">school</span>
                      <div>
                        <strong className="text-[#131b2e] block">{c.name}</strong>
                        <span className="text-[11px] text-[#737686]">{c.code} • {c.duration}</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#737686]">{c.fees}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section: Counselors */}
          {searchResults.matchedCounsellors.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-[#737686] uppercase tracking-wider px-2 block mb-1">
                Counselors ({searchResults.matchedCounsellors.length})
              </span>
              <div className="space-y-1">
                {searchResults.matchedCounsellors.map((cn) => (
                  <button
                    key={cn.id}
                    onClick={() => {
                      setActiveTab('counsellors');
                      setIsSearchModalOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-[#eaedff] transition-colors flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <img className="w-6 h-6 rounded-full object-cover" src={getSafeAvatarUrl(cn.avatar, cn.name)} alt={cn.name} />
                      <div>
                        <strong className="text-[#131b2e] block">{cn.name}</strong>
                        <span className="text-[11px] text-[#737686]">{cn.title} • {cn.activeLeadsCount} active</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700">{cn.conversionRate}%</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section: Campaigns */}
          {searchResults.matchedCampaigns.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-[#737686] uppercase tracking-wider px-2 block mb-1">
                Campaigns ({searchResults.matchedCampaigns.length})
              </span>
              <div className="space-y-1">
                {searchResults.matchedCampaigns.map((cam) => (
                  <button
                    key={cam.id}
                    onClick={() => {
                      setActiveTab('campaigns');
                      setIsSearchModalOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-[#eaedff] transition-colors flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#005d73] text-[18px]">campaign</span>
                      <div>
                        <strong className="text-[#131b2e] block">{cam.name}</strong>
                        <span className="text-[11px] text-[#737686]">{cam.source}</span>
                      </div>
                    </div>
                    <span className="text-xs text-[#004ac6] font-semibold">{cam.leads} leads</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
