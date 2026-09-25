import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { getSafeAvatarUrl } from '../../services/crmService';

export const ReportsView: React.FC = () => {
  const { metrics, counsellors, courses, showToast } = useCrm();

  const [activeReportTab, setActiveReportTab] = useState<'all' | 'roi' | 'ageing' | 'counsellors'>('all');
  const [cycleWindow, setCycleWindow] = useState('Sep 1 - Sep 30, 2026');
  const [isWindowDropdownOpen, setIsWindowDropdownOpen] = useState(false);

  const handleExport = () => {
    showToast('Exporting Institutional Admissions Audit Report (CSV/PDF)...');
    const headers = ['Source', 'Inquiries', 'CPL', 'Enrolled', 'Conversion Rate'];
    const rows = [
      ['WhatsApp Business', '240', '₹45', '67', '27.9%'],
      ['Walk-in Direct', '195', '₹0', '66', '33.8%'],
      ['Website Organic', '380', '₹120', '84', '22.1%'],
      ['Education Fair', '145', '₹620', '28', '19.3%'],
      ['Google Ads', '210', '₹850', '30', '14.3%'],
    ];

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EduLead_Reports_Cycle_${cycleWindow.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col w-full pb-24 space-y-4">
      {/* Sub-Header: Filter Toolbar & Export Quick Action */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl shadow-xs border border-[#eaedff]">
        <div className="relative flex-1 min-w-0">
          <button
            onClick={() => setIsWindowDropdownOpen(!isWindowDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] rounded-lg transition-colors text-left min-w-0 w-full"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-[#004ac6] shrink-0">calendar_today</span>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-[#434655] truncate font-medium">Cycle Window</span>
              <span className="text-xs font-bold text-[#131b2e] truncate">{cycleWindow}</span>
            </div>
            <span className="material-symbols-outlined text-[18px] text-[#737686] ml-auto shrink-0">expand_more</span>
          </button>

          {isWindowDropdownOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setIsWindowDropdownOpen(false)} />
              <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-xl shadow-lg border border-[#eaedff] py-1 z-40">
                {['Sep 1 - Sep 30, 2026', 'Aug 1 - Aug 31, 2026', 'Q3 Comprehensive Audit'].map((win) => (
                  <button
                    key={win}
                    onClick={() => {
                      setCycleWindow(win);
                      setIsWindowDropdownOpen(false);
                      showToast(`Audit window shifted to ${win}`);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-[#f2f3ff] ${
                      cycleWindow === win ? 'text-[#004ac6] font-bold bg-[#eaedff]' : 'text-[#131b2e]'
                    }`}
                  >
                    {win}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#004ac6] hover:bg-[#003ea8] text-white rounded-lg shadow-xs transition-all active:scale-95 shrink-0 text-xs font-bold"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">file_download</span>
          <span>Export CSV</span>
        </button>
      </div>

      {/* Performance Overview: 4 KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Leads Ingested */}
        <div className="bg-white p-3.5 rounded-xl shadow-xs border border-[#eaedff] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#434655] uppercase tracking-wider">Leads Ingested</span>
            <div className="w-7 h-7 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#004ac6]">
              <span className="material-symbols-outlined text-[18px]">group_add</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-[#131b2e] tabular-nums">1,248</div>
            <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-700 font-semibold">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>+14.2% vs last mo</span>
            </div>
          </div>
        </div>

        {/* Admissions */}
        <div className="bg-white p-3.5 rounded-xl shadow-xs border border-[#eaedff] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#434655] uppercase tracking-wider">Admissions</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-[#131b2e] tabular-nums">214</div>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[#dbe1ff] text-[#00174b] text-[10px] font-bold">
              17.1% Conv.
            </span>
          </div>
        </div>

        {/* Tuition Booked */}
        <div className="bg-white p-3.5 rounded-xl shadow-xs border border-[#eaedff] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#434655] uppercase tracking-wider">Tuition Booked</span>
            <div className="w-7 h-7 rounded-lg bg-[#eaddff] flex items-center justify-center text-[#712ae2]">
              <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-[#131b2e] tabular-nums">
              ₹8.42<span className="text-sm font-normal text-[#737686]"> Cr</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-1">● 98.4% target met</span>
          </div>
        </div>

        {/* Avg Turnaround */}
        <div className="bg-white p-3.5 rounded-xl shadow-xs border border-[#eaedff] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#434655] uppercase tracking-wider">Avg Turnaround</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
              <span className="material-symbols-outlined text-[18px]">timer</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-[#131b2e] tabular-nums">
              9.4<span className="text-sm font-normal text-[#737686]"> Days</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-0.5 mt-1">
              <span className="material-symbols-outlined text-[14px]">bolt</span> 1.8d faster SLA
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Tab Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
        {[
          { id: 'all', label: 'All Metrics' },
          { id: 'roi', label: 'Source ROI' },
          { id: 'ageing', label: 'Lead Ageing' },
          { id: 'counsellors', label: 'Counsellors' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReportTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeReportTab === tab.id
                ? 'bg-[#131b2e] text-white shadow-xs'
                : 'bg-white text-[#434655] border border-[#eaedff] hover:bg-[#f2f3ff]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Section 1: Lead Source ROI & Yield */}
      {(activeReportTab === 'all' || activeReportTab === 'roi') && (
        <div className="bg-white rounded-xl p-4 shadow-xs border border-[#eaedff] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm text-[#131b2e]">Lead Source ROI & Yield</h2>
              <p className="text-xs text-[#434655]">Cost efficiency per enrolled scholar</p>
            </div>
            <span className="material-symbols-outlined text-[#737686] text-[20px]">hub</span>
          </div>

          <div className="space-y-2.5">
            {/* WhatsApp */}
            <div className="p-3 bg-[#f2f3ff] rounded-lg space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[14px]">chat</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#131b2e] block">WhatsApp Business</span>
                    <span className="text-[10px] text-[#737686]">240 inquiries · ₹45 CPL</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-700 block">67 Enrolled</span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full">
                    27.9% Conv.
                  </span>
                </div>
              </div>
              <div className="w-full bg-[#dae2fd] rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '27.9%' }}></div>
              </div>
            </div>

            {/* Walk-in */}
            <div className="p-3 bg-[#f2f3ff] rounded-lg space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[14px]">directions_walk</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#131b2e] block">Walk-in Direct</span>
                    <span className="text-[10px] text-[#737686]">195 inquiries · Free Organic</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#131b2e] block">66 Enrolled</span>
                  <span className="text-[10px] font-semibold text-cyan-800 bg-cyan-50 px-1.5 py-0.2 rounded-full">
                    33.8% Conv.
                  </span>
                </div>
              </div>
              <div className="w-full bg-[#dae2fd] rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#007793] h-full rounded-full" style={{ width: '33.8%' }}></div>
              </div>
            </div>

            {/* Website Organic */}
            <div className="p-3 bg-[#f2f3ff] rounded-lg space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-[#004ac6] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[14px]">language</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#131b2e] block">Website Organic</span>
                    <span className="text-[10px] text-[#737686]">380 inquiries · ₹120 CPL</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#131b2e] block">84 Enrolled</span>
                  <span className="text-[10px] font-semibold text-[#004ac6] bg-blue-50 px-1.5 py-0.2 rounded-full">
                    22.1% Conv.
                  </span>
                </div>
              </div>
              <div className="w-full bg-[#dae2fd] rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#004ac6] h-full rounded-full" style={{ width: '22.1%' }}></div>
              </div>
            </div>

            {/* Education Fair */}
            <div className="p-3 bg-[#f2f3ff] rounded-lg space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-[#712ae2] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[14px]">domain_verification</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#131b2e] block">Education Fair</span>
                    <span className="text-[10px] text-[#737686]">145 inquiries · ₹620 CPL</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#131b2e] block">28 Enrolled</span>
                  <span className="text-[10px] font-semibold text-[#712ae2] bg-purple-50 px-1.5 py-0.2 rounded-full">
                    19.3% Conv.
                  </span>
                </div>
              </div>
              <div className="w-full bg-[#dae2fd] rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#712ae2] h-full rounded-full" style={{ width: '19.3%' }}></div>
              </div>
            </div>

            {/* Google Ads */}
            <div className="p-3 bg-[#f2f3ff] rounded-lg space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-rose-100 text-[#ba1a1a] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[14px]">ads_click</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#131b2e] block">Google Ads</span>
                    <span className="text-[10px] text-[#737686]">210 inquiries · ₹850 CPL</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#131b2e] block">30 Enrolled</span>
                  <span className="text-[10px] font-semibold text-[#ba1a1a] bg-rose-50 px-1.5 py-0.2 rounded-full">
                    14.3% Conv.
                  </span>
                </div>
              </div>
              <div className="w-full bg-[#dae2fd] rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#ba1a1a] h-full rounded-full" style={{ width: '14.3%' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Academic Program Demand */}
      {(activeReportTab === 'all' || activeReportTab === 'roi') && (
        <div className="bg-white rounded-xl p-4 shadow-xs border border-[#eaedff] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm text-[#131b2e]">Academic Program Demand</h2>
              <p className="text-xs text-[#434655]">Share of inquiries across faculties</p>
            </div>
            <span className="material-symbols-outlined text-[#737686] text-[20px]">school</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#004ac6]"></span>
                  <span className="font-semibold text-[#131b2e]">MBA Master of Business Admin</span>
                </div>
                <span className="font-bold text-[#131b2e]">410 (32.8%)</span>
              </div>
              <div className="w-full bg-[#f2f3ff] rounded-full h-2 overflow-hidden">
                <div className="bg-[#004ac6] h-full rounded-full" style={{ width: '32.8%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#712ae2]"></span>
                  <span className="font-semibold text-[#131b2e]">BCA Computer Applications</span>
                </div>
                <span className="font-bold text-[#131b2e]">320 (25.6%)</span>
              </div>
              <div className="w-full bg-[#f2f3ff] rounded-full h-2 overflow-hidden">
                <div className="bg-[#712ae2] h-full rounded-full" style={{ width: '25.6%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#005d73]"></span>
                  <span className="font-semibold text-[#131b2e]">B.Tech Engineering & Tech</span>
                </div>
                <span className="font-bold text-[#131b2e]">290 (23.2%)</span>
              </div>
              <div className="w-full bg-[#f2f3ff] rounded-full h-2 overflow-hidden">
                <div className="bg-[#005d73] h-full rounded-full" style={{ width: '23.2%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#b4c5ff]"></span>
                  <span className="font-semibold text-[#131b2e]">BBA Business Analytics</span>
                </div>
                <span className="font-bold text-[#131b2e]">250 (20.0%)</span>
              </div>
              <div className="w-full bg-[#f2f3ff] rounded-full h-2 overflow-hidden">
                <div className="bg-[#b4c5ff] h-full rounded-full" style={{ width: '20.0%' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 3: Lead Ageing & Funnel Hygiene */}
      {(activeReportTab === 'all' || activeReportTab === 'ageing') && (
        <div className="bg-white rounded-xl p-4 shadow-xs border border-[#eaedff] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm text-[#131b2e]">Ageing & Pipeline Drop-off</h2>
              <p className="text-xs text-[#434655]">SLA adherence & re-engagement triage</p>
            </div>
            <span className="material-symbols-outlined text-[#737686] text-[20px]">hourglass_top</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <div>
                  <div className="font-bold text-[#131b2e]">0–3 Days (Fresh)</div>
                  <div className="text-[10px] text-[#434655]">High responsiveness: 92% call rate</div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-[#131b2e]">480 leads</span>
                <span className="text-[10px] text-emerald-700 block font-semibold">Optimal</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f2f3ff]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#004ac6]"></span>
                <div>
                  <div className="font-bold text-[#131b2e]">4–7 Days (Active)</div>
                  <div className="text-[10px] text-[#434655]">Stage SLA compliant</div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-[#131b2e]">340 leads</span>
                <span className="text-[10px] text-[#004ac6] block font-semibold">Healthy</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <div>
                  <div className="font-bold text-[#131b2e]">8–14 Days (Cooling)</div>
                  <div className="text-[10px] text-[#434655]">Requires SMS re-engagement</div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-[#131b2e]">220 leads</span>
                <span className="text-[10px] text-amber-800 block font-semibold">Needs Action</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-rose-50/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <div>
                  <div className="font-bold text-[#131b2e]">15–30 Days (Critical)</div>
                  <div className="text-[10px] text-[#434655]">Escalated to Team Leads</div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-[#131b2e]">130 leads</span>
                <span className="text-[10px] text-[#ba1a1a] block font-bold">Escalated</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#eaedff]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#737686]"></span>
                <div>
                  <div className="font-bold text-[#131b2e]">30+ Days (Stalled)</div>
                  <div className="text-[10px] text-[#434655]">Drop-off / Inactive archive pool</div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-[#131b2e]">78 leads</span>
                <span className="text-[10px] text-[#737686] block font-medium">Cold Archive</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 4: Counsellor Leaderboard */}
      {(activeReportTab === 'all' || activeReportTab === 'counsellors') && (
        <div className="bg-white rounded-xl p-4 shadow-xs border border-[#eaedff] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm text-[#131b2e]">Counsellor Leaderboard</h2>
              <p className="text-xs text-[#434655]">Individual conversion throughput</p>
            </div>
            <span className="material-symbols-outlined text-[#737686] text-[20px]">military_tech</span>
          </div>

          <div className="space-y-2">
            {counsellors.map((c, idx) => (
              <div
                key={c.id}
                className={`flex items-center justify-between p-3 rounded-xl border ${
                  idx === 0
                    ? 'bg-gradient-to-r from-amber-500/10 via-[#f2f3ff] to-[#f2f3ff] border-amber-200'
                    : 'bg-[#f2f3ff] border-[#dae2fd]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative shrink-0">
                    <img className="w-10 h-10 rounded-full object-cover shadow-xs" src={getSafeAvatarUrl(c.avatar, c.name)} alt={c.name} />
                    <span
                      className={`absolute -top-1 -left-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs ${
                        idx === 0
                          ? 'bg-amber-400 text-[#131b2e]'
                          : idx === 1
                          ? 'bg-[#dae2fd] text-[#131b2e]'
                          : 'bg-[#eaedff] text-[#434655]'
                      }`}
                    >
                      {idx + 1}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-[#131b2e]">{c.name}</span>
                      {idx === 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 text-[9px] font-bold uppercase">
                          Top Performer
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#434655]">
                      {c.assignedCount} assigned · {c.enrolledCount} enrolled
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-base text-[#004ac6] tabular-nums block">{c.conversionRate}%</span>
                  <span className="text-[10px] text-emerald-700 font-semibold">+4.2% MoM</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
