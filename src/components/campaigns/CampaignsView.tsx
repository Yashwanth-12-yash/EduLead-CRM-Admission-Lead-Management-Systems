import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { Campaign, LeadSource } from '../../types';

export const CampaignsView: React.FC = () => {
  const { campaigns, showToast } = useCrm();

  const [campaignList, setCampaignList] = useState<Campaign[]>(campaigns);
  const [isAddCampaignOpen, setIsAddCampaignOpen] = useState(false);

  // New campaign state
  const [name, setName] = useState('');
  const [source, setSource] = useState<LeadSource>('Google Ads');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-12-31');
  const [budget, setBudget] = useState(200000);

  const handleAddCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCamp: Campaign = {
      id: `camp-${Date.now()}`,
      name,
      source,
      startDate,
      endDate,
      budget: Number(budget),
      spent: 0,
      leads: 0,
      applications: 0,
      conversions: 0,
      status: 'ACTIVE',
    };

    setCampaignList([newCamp, ...campaignList]);
    setIsAddCampaignOpen(false);
    showToast(`Campaign ${name} created successfully!`);
    setName('');
  };

  return (
    <div className="flex flex-col w-full pb-24 space-y-4">
      {/* Header Banner */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-[#eaedff] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#712ae2] text-[22px]">campaign</span>
            <h2 className="font-bold text-base md:text-lg text-[#131b2e]">Admissions Campaigns</h2>
          </div>
          <p className="text-xs text-[#434655] mt-0.5">
            Track multi-channel acquisition ROI, Cost Per Lead (CPL), and conversion yield
          </p>
        </div>
        <button
          onClick={() => setIsAddCampaignOpen(true)}
          className="px-3 py-2 bg-[#004ac6] text-white rounded-lg text-xs font-bold shadow-xs hover:bg-[#003ea8] active:scale-95 transition-all flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>New Campaign</span>
        </button>
      </div>

      {/* Campaigns List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {campaignList.map((camp) => {
          const cpl = camp.leads > 0 ? Math.round(camp.spent / camp.leads) : 0;
          const convRate = camp.leads > 0 ? ((camp.conversions / camp.leads) * 100).toFixed(1) : '0';
          const costPerConv = camp.conversions > 0 ? Math.round(camp.spent / camp.conversions) : 0;

          return (
            <div
              key={camp.id}
              className="bg-white p-4 rounded-xl shadow-xs border border-[#eaedff] flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#f2f3ff] text-[#005d73]">
                      {camp.source}
                    </span>
                    <h3 className="font-bold text-sm text-[#131b2e] mt-1">{camp.name}</h3>
                    <p className="text-[11px] text-[#737686]">
                      {camp.startDate} to {camp.endDate}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {camp.status}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-[#434655]">
                  <span>Budget: ₹{(camp.budget / 1000).toFixed(0)}k</span>
                  <span>Spent: <strong className="text-[#131b2e]">₹{(camp.spent / 1000).toFixed(1)}k</strong></span>
                </div>
              </div>

              {/* Budget consumption bar */}
              <div className="w-full h-1.5 rounded-full bg-[#dae2fd] overflow-hidden">
                <div
                  className="bg-[#004ac6] h-full rounded-full"
                  style={{ width: `${Math.min(100, Math.round((camp.spent / camp.budget) * 100))}%` }}
                ></div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-4 gap-1 p-2 bg-[#f2f3ff] rounded-lg text-center text-xs">
                <div>
                  <span className="text-[10px] text-[#737686] block">Leads</span>
                  <strong className="text-[#131b2e]">{camp.leads}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#737686] block">CPL</span>
                  <strong className="text-[#005d73]">₹{cpl}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#737686] block">Enrolled</span>
                  <strong className="text-emerald-700">{camp.conversions}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#737686] block">Conv.</span>
                  <strong className="text-[#004ac6]">{convRate}%</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Campaign Modal */}
      {isAddCampaignOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddCampaignOpen(false);
          }}
        >
          <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl space-y-3 border border-[#eaedff]">
            <div className="flex items-center justify-between pb-2 border-b border-[#f2f3ff]">
              <h3 className="font-bold text-base text-[#131b2e]">Launch Admissions Campaign</h3>
              <button
                onClick={() => setIsAddCampaignOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#434655]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddCampaign} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#131b2e] block mb-1">Campaign Title *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Winter 2026 Admissions Drive"
                  className="w-full p-2.5 rounded-lg bg-[#f2f3ff] text-xs text-[#131b2e] border border-[#dae2fd]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#131b2e] block mb-1">Source Channel</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as LeadSource)}
                  className="w-full p-2 rounded-lg bg-[#f2f3ff] text-xs text-[#131b2e] border border-[#dae2fd]"
                >
                  <option value="Google Ads">Google Ads</option>
                  <option value="Facebook">Facebook Ads</option>
                  <option value="Instagram">Instagram Lead Gen</option>
                  <option value="Education Fair">Education Fair</option>
                  <option value="WhatsApp">WhatsApp Business</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-[#131b2e] block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 rounded-lg bg-[#f2f3ff] text-xs text-[#131b2e] border border-[#dae2fd]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#131b2e] block mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 rounded-lg bg-[#f2f3ff] text-xs text-[#131b2e] border border-[#dae2fd]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#131b2e] block mb-1">Budget (INR)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg bg-[#f2f3ff] text-xs text-[#131b2e] border border-[#dae2fd]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#004ac6] text-white text-xs font-bold shadow-xs hover:bg-[#003ea8]"
              >
                Create Campaign
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
