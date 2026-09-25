import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { Role } from '../../types';

export const SettingsView: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    currentUser,
    switchUser,
    counsellors,
    resetAllData,
    showToast,
  } = useCrm();

  const [instituteName, setInstituteName] = useState('EduLead Institute of Higher Education');
  const [activeSession, setActiveSession] = useState('AY 2026-27 (Fall Intake)');
  const [slaFreshDays, setSlaFreshDays] = useState(3);
  const [slaAttentionDays, setSlaAttentionDays] = useState(7);
  const [slaCriticalDays, setSlaCriticalDays] = useState(15);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Institutional configuration saved successfully!');
  };

  return (
    <div className="flex flex-col w-full pb-24 space-y-4">
      {/* Header Banner */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-[#eaedff] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[22px]">settings</span>
            <h2 className="font-bold text-base md:text-lg text-[#131b2e]">System Settings & Governance</h2>
          </div>
          <p className="text-xs text-[#434655] mt-0.5">
            Configure institutional parameters, SLA policies, and role-based permissions
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
        {/* Role & User Perspective Switcher */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-[#eaedff] space-y-3">
          <h3 className="font-bold text-sm text-[#131b2e]">Active User & Perspective</h3>
          <p className="text-[#434655]">
            Switch roles to test permissions across Admin, Manager, and Counsellor views.
          </p>

          <div className="grid grid-cols-3 gap-2">
            {(['ADMIN', 'MANAGER', 'COUNSELLOR'] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setCurrentRole(r);
                  showToast(`Switched active view to ${r}`);
                }}
                className={`py-2 px-3 rounded-lg font-semibold text-center transition-all ${
                  currentRole === r
                    ? 'bg-[#004ac6] text-white shadow-xs'
                    : 'bg-[#f2f3ff] text-[#434655] hover:bg-[#eaedff]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-[#f2f3ff]">
            <label className="font-semibold text-[#131b2e] block mb-1.5">Simulate Counselor Identity</label>
            <div className="grid grid-cols-2 gap-2">
              {counsellors.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => switchUser(c.id)}
                  className={`p-2 rounded-lg text-left border flex items-center gap-2 transition-colors ${
                    currentUser.id === c.id
                      ? 'bg-[#eaedff] border-[#004ac6]'
                      : 'bg-[#f2f3ff] border-[#dae2fd]'
                  }`}
                >
                  <img className="w-8 h-8 rounded-full object-cover" src={c.avatar} alt={c.name} />
                  <div className="truncate">
                    <strong className="block text-[#131b2e] truncate">{c.name}</strong>
                    <span className="text-[10px] text-[#737686]">{c.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Institutional Academic Profile */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-[#eaedff] space-y-3">
          <h3 className="font-bold text-sm text-[#131b2e]">Academic Configuration</h3>

          <div>
            <label className="font-semibold text-[#131b2e] block mb-1">Institution Brand Name</label>
            <input
              value={instituteName}
              onChange={(e) => setInstituteName(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-[#f2f3ff] text-[#131b2e] border border-[#dae2fd]"
            />
          </div>

          <div>
            <label className="font-semibold text-[#131b2e] block mb-1">Active Admission Intake</label>
            <input
              value={activeSession}
              onChange={(e) => setActiveSession(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-[#f2f3ff] text-[#131b2e] border border-[#dae2fd]"
            />
          </div>
        </div>

        {/* Lead SLA & Ageing Threshold Rules */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-[#eaedff] space-y-3">
          <h3 className="font-bold text-sm text-[#131b2e]">SLA & Ageing Threshold Policy</h3>
          <p className="text-[#434655]">
            Configure automated escalation guidelines for stagnant enquiries.
          </p>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-semibold text-[#131b2e] block mb-1">Fresh (Days)</label>
              <input
                type="number"
                value={slaFreshDays}
                onChange={(e) => setSlaFreshDays(Number(e.target.value))}
                className="w-full p-2 rounded-lg bg-[#f2f3ff] border border-[#dae2fd]"
              />
            </div>
            <div>
              <label className="font-semibold text-[#131b2e] block mb-1">Attention (Days)</label>
              <input
                type="number"
                value={slaAttentionDays}
                onChange={(e) => setSlaAttentionDays(Number(e.target.value))}
                className="w-full p-2 rounded-lg bg-[#f2f3ff] border border-[#dae2fd]"
              />
            </div>
            <div>
              <label className="font-semibold text-[#131b2e] block mb-1">Critical (Days)</label>
              <input
                type="number"
                value={slaCriticalDays}
                onChange={(e) => setSlaCriticalDays(Number(e.target.value))}
                className="w-full p-2 rounded-lg bg-[#f2f3ff] border border-[#dae2fd]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-[#004ac6] text-white font-bold text-xs md:text-sm shadow-xs hover:bg-[#003ea8]"
        >
          Save Configuration
        </button>

        {/* Reset Database Section */}
        <div className="pt-2">
          <button
            type="button"
            onClick={resetAllData}
            className="w-full py-2.5 rounded-xl bg-rose-50 text-[#ba1a1a] border border-rose-200 font-bold text-xs hover:bg-rose-100 transition-colors flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            <span>Reset Demo Database to Initial Samples</span>
          </button>
        </div>
      </form>
    </div>
  );
};
