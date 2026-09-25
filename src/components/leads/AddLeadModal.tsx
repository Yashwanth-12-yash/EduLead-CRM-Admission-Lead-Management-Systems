import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { LeadPriority, LeadSource, LeadStatus } from '../../types';

export const AddLeadModal: React.FC = () => {
  const {
    isAddLeadModalOpen,
    setIsAddLeadModalOpen,
    addLead,
    counsellors,
    setActiveTab,
    openLeadDetails,
    showToast,
  } = useCrm();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [createdLeadId, setCreatedLeadId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [hasWhatsapp, setHasWhatsapp] = useState(true);
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [qualification, setQualification] = useState('12th Grade / Intermediate');
  const [passingYear, setPassingYear] = useState(2026);
  const [scorePercentage, setScorePercentage] = useState('86.5%');

  const [course, setCourse] = useState('BCA');
  const [preferredCampus, setPreferredCampus] = useState('Main Campus (North Block)');
  const [preferredIntake, setPreferredIntake] = useState('Fall 2026 (Aug Batch)');
  const [budget, setBudget] = useState('₹2.5L - ₹5L');
  const [source, setSource] = useState<LeadSource>('Website');

  const [priority, setPriority] = useState<LeadPriority>('HIGH');
  const [assignedCounsellorId, setAssignedCounsellorId] = useState('round-robin');
  const [status, setStatus] = useState<LeadStatus>('NEW');
  const [followupDate, setFollowupDate] = useState('2026-09-26');
  const [followupTime, setFollowupTime] = useState('15:00');
  const [remarks, setRemarks] = useState('');

  if (!isAddLeadModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Student name is required', undefined, 'error');
      setStep(1);
      return;
    }
    if (!phone.trim() || phone.length < 8) {
      showToast('Please enter a valid phone number', undefined, 'error');
      setStep(1);
      return;
    }

    const newLead = addLead({
      name,
      phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      hasWhatsapp,
      city: city || 'Bengaluru',
      state: 'Karnataka',
      qualification,
      passingYear: Number(passingYear) || 2026,
      scorePercentage,
      course,
      preferredCampus,
      preferredIntake,
      budget,
      source,
      assignedCounsellorId: assignedCounsellorId === 'round-robin' ? 'round-robin' : assignedCounsellorId,
      status,
      priority,
      lastContactedAt: null,
      nextFollowUpAt: `${followupDate}T${followupTime}:00.000Z`,
      nextFollowUpNote: remarks || `Initial consultation regarding ${course} admission`,
      remarks: remarks || `Inquired for ${course} admission program.`,
    });

    setCreatedLeadId(newLead.id);
    setShowSuccessModal(true);
  };

  const handleResetForm = () => {
    setName('');
    setPhone('');
    setEmail('');
    setCity('');
    setRemarks('');
    setStep(1);
    setShowSuccessModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#131b2e]/60 backdrop-blur-xs flex items-center justify-center p-0 md:p-4">
      <div className="w-full max-w-xl bg-[#faf8ff] min-h-screen md:min-h-0 md:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-[#eaedff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddLeadModalOpen(false)}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-[#434655] hover:bg-[#eaedff] transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <h2 className="font-semibold text-base text-[#131b2e]">Add Lead / Intake Form</h2>
          </div>
          <button
            onClick={() => setIsAddLeadModalOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#434655] hover:bg-[#eaedff]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Stepper Progress */}
        <div className="px-4 pt-3 pb-2 bg-[#faf8ff]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#004ac6] animate-pulse"></span>
              <span className="text-[11px] font-bold text-[#004ac6] uppercase tracking-wider">Admissions Intake</span>
            </div>
            <span className="text-xs font-semibold text-[#434655] bg-[#eaedff] px-2.5 py-0.5 rounded-full">
              Step {step} of 3
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`flex flex-col items-center gap-1 py-1.5 rounded-xl transition-all ${
                step === 1
                  ? 'bg-white shadow-xs text-[#004ac6] font-semibold border border-[#eaedff]'
                  : 'bg-[#eaedff]/60 text-[#434655]'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === 1 ? 'bg-[#004ac6] text-white' : 'bg-[#c3c6d7] text-white'
                }`}
              >
                1
              </div>
              <span className="text-[11px] truncate">Student</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(2)}
              className={`flex flex-col items-center gap-1 py-1.5 rounded-xl transition-all ${
                step === 2
                  ? 'bg-white shadow-xs text-[#004ac6] font-semibold border border-[#eaedff]'
                  : 'bg-[#eaedff]/60 text-[#434655]'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === 2 ? 'bg-[#004ac6] text-white' : 'bg-[#c3c6d7] text-white'
                }`}
              >
                2
              </div>
              <span className="text-[11px] truncate">Course & Campus</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(3)}
              className={`flex flex-col items-center gap-1 py-1.5 rounded-xl transition-all ${
                step === 3
                  ? 'bg-white shadow-xs text-[#004ac6] font-semibold border border-[#eaedff]'
                  : 'bg-[#eaedff]/60 text-[#434655]'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === 3 ? 'bg-[#004ac6] text-white' : 'bg-[#c3c6d7] text-white'
                }`}
              >
                3
              </div>
              <span className="text-[11px] truncate">Assignment</span>
            </button>
          </div>

          <div className="w-full bg-[#eaedff] h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#004ac6] h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 flex-1 overflow-y-auto max-h-[calc(100vh-14rem)]">
          {/* STEP 1: Student Information */}
          {step === 1 && (
            <div className="bg-white rounded-xl p-4 shadow-xs border border-[#eaedff] space-y-3.5 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 pb-1 border-b border-[#f2f3ff]">
                <div className="w-7 h-7 rounded-lg bg-[#eaedff] text-[#004ac6] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[#131b2e]">Personal & Contact Details</h3>
                  <p className="text-[11px] text-[#434655]">Primary contact records and academic history</p>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#131b2e] flex items-center justify-between">
                  <span>Full Name <span className="text-[#ba1a1a]">*</span></span>
                  <span className="text-[10px] text-[#737686]">Required</span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[#737686] text-[18px]">badge</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Ananya Rao"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#f2f3ff] text-xs md:text-sm text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#004ac6] transition-all border border-[#dae2fd]"
                  />
                </div>
              </div>

              {/* Phone with WhatsApp toggle */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-[#131b2e]">
                  <span>Phone Number <span className="text-[#ba1a1a]">*</span></span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[#005d73] select-none text-[11px]">
                    <input
                      type="checkbox"
                      checked={hasWhatsapp}
                      onChange={(e) => setHasWhatsapp(e.target.checked)}
                      className="rounded accent-[#005d73]"
                    />
                    <span>Has WhatsApp</span>
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-2.5 py-2 rounded-lg bg-[#eaedff] text-xs font-semibold text-[#004ac6] shrink-0">
                    +91
                  </div>
                  <div className="relative flex-1 flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-[#737686] text-[18px]">phone</span>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="98765 43210"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#f2f3ff] text-xs md:text-sm text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#004ac6] transition-all border border-[#dae2fd]"
                    />
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#131b2e]">Email Address</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[#737686] text-[18px]">mail</span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="ananya.rao@example.com"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#f2f3ff] text-xs md:text-sm text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#004ac6] transition-all border border-[#dae2fd]"
                  />
                </div>
              </div>

              {/* City & State */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#131b2e]">City & State</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[#737686] text-[18px]">location_on</span>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Bengaluru, Karnataka"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#f2f3ff] text-xs md:text-sm text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#004ac6] transition-all border border-[#dae2fd]"
                  />
                </div>
              </div>

              {/* Highest Qualification */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#131b2e]">Highest Qualification</label>
                <select
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#f2f3ff] text-xs md:text-sm text-[#131b2e] focus:outline-none border border-[#dae2fd]"
                >
                  <option value="12th Grade / Intermediate">12th Grade / Intermediate</option>
                  <option value="Polytechnic Diploma">Polytechnic Diploma</option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Master's Degree">Master's Degree</option>
                </select>
              </div>

              {/* Passing Year & Score */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-[#131b2e] block mb-1">Passing Year</label>
                  <input
                    type="number"
                    value={passingYear}
                    onChange={(e) => setPassingYear(Number(e.target.value))}
                    className="w-full p-2 rounded-lg bg-[#f2f3ff] text-xs md:text-sm text-[#131b2e] focus:outline-none border border-[#dae2fd]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#131b2e] block mb-1">Score (% / CGPA)</label>
                  <input
                    value={scorePercentage}
                    onChange={(e) => setScorePercentage(e.target.value)}
                    placeholder="86.5%"
                    className="w-full p-2 rounded-lg bg-[#f2f3ff] text-xs md:text-sm text-[#131b2e] focus:outline-none border border-[#dae2fd]"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full mt-2 py-2.5 rounded-lg bg-[#004ac6] text-white font-semibold text-xs md:text-sm flex items-center justify-center gap-1.5 shadow-xs hover:bg-[#003ea8]"
              >
                <span>Continue to Course Preferences</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          )}

          {/* STEP 2: Course & Campus */}
          {step === 2 && (
            <div className="bg-white rounded-xl p-4 shadow-xs border border-[#eaedff] space-y-3.5 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 pb-1 border-b border-[#f2f3ff]">
                <div className="w-7 h-7 rounded-lg bg-[#eaedff] text-[#004ac6] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">local_library</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[#131b2e]">Course & Campus Preferences</h3>
                  <p className="text-[11px] text-[#434655]">Programs, location, and intake criteria</p>
                </div>
              </div>

              {/* Interested Course */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#131b2e]">Interested Course *</label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#f2f3ff] text-xs md:text-sm text-[#131b2e] focus:outline-none border border-[#dae2fd]"
                >
                  <option value="BCA">BCA - Bachelor of Computer Applications</option>
                  <option value="BBA">BBA - Business Administration</option>
                  <option value="MBA">MBA - Master of Business Administration</option>
                  <option value="MCA">MCA - Master of Computer Applications</option>
                  <option value="B.Tech">B.Tech - Computer Science & Engineering</option>
                  <option value="M.Tech">M.Tech - Data Science & AI</option>
                </select>
              </div>

              {/* Preferred Campus */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#131b2e]">Preferred Campus *</label>
                <select
                  value={preferredCampus}
                  onChange={(e) => setPreferredCampus(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#f2f3ff] text-xs md:text-sm text-[#131b2e] focus:outline-none border border-[#dae2fd]"
                >
                  <option value="Main Campus (North Block)">Main Campus (North Block)</option>
                  <option value="North City Campus">North City Campus</option>
                  <option value="Tech Park Innovation Campus">Tech Park Innovation Campus</option>
                </select>
              </div>

              {/* Target Intake */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#131b2e]">Target Intake</label>
                <select
                  value={preferredIntake}
                  onChange={(e) => setPreferredIntake(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#f2f3ff] text-xs md:text-sm text-[#131b2e] focus:outline-none border border-[#dae2fd]"
                >
                  <option value="Fall 2026 (Aug Batch)">Fall 2026 (Aug Batch)</option>
                  <option value="Spring 2027 (Jan Batch)">Spring 2027 (Jan Batch)</option>
                </select>
              </div>

              {/* Budget Chips */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#131b2e]">Estimated Budget Range</label>
                <div className="grid grid-cols-2 gap-2">
                  {['< ₹2.5L', '₹2.5L - ₹5L', '₹5L - ₹8L', '₹8L+'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBudget(b)}
                      className={`py-2 px-3 rounded-lg text-xs transition-all ${
                        budget === b
                          ? 'bg-[#004ac6] text-white font-semibold shadow-xs'
                          : 'bg-[#f2f3ff] text-[#434655] hover:bg-[#eaedff]'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lead Source Chips */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#131b2e]">Lead Source *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Website', 'Walk-in', 'WhatsApp', 'Google Ads', 'Education Fair', 'Referral'] as LeadSource[]).map(
                    (src) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => setSource(src)}
                        className={`py-2 px-1 rounded-lg text-xs transition-all flex flex-col items-center gap-1 ${
                          source === src
                            ? 'bg-[#004ac6] text-white font-semibold shadow-xs'
                            : 'bg-[#f2f3ff] text-[#434655] hover:bg-[#eaedff]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {src === 'Website'
                            ? 'language'
                            : src === 'Walk-in'
                            ? 'directions_walk'
                            : src === 'WhatsApp'
                            ? 'chat'
                            : src === 'Google Ads'
                            ? 'ads_click'
                            : src === 'Education Fair'
                            ? 'campaign'
                            : 'diversity_3'}
                        </span>
                        <span className="truncate w-full text-center text-[10px]">{src}</span>
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-2.5 rounded-lg bg-[#eaedff] text-[#131b2e] font-semibold text-xs flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-2.5 rounded-lg bg-[#004ac6] text-white font-semibold text-xs flex items-center justify-center gap-1 shadow-xs hover:bg-[#003ea8]"
                >
                  <span>Continue to Assignment</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Assignment & Follow-up */}
          {step === 3 && (
            <div className="bg-white rounded-xl p-4 shadow-xs border border-[#eaedff] space-y-3.5 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 pb-1 border-b border-[#f2f3ff]">
                <div className="w-7 h-7 rounded-lg bg-[#eaedff] text-[#004ac6] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">support_agent</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[#131b2e]">Counsellor & Follow-up Setup</h3>
                  <p className="text-[11px] text-[#434655]">Round-robin routing and first interaction plan</p>
                </div>
              </div>

              {/* Priority Pills */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#131b2e]">Lead Priority *</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as LeadPriority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        priority === p
                          ? 'bg-[#004ac6] text-white shadow-xs'
                          : 'bg-[#f2f3ff] text-[#434655] hover:bg-[#eaedff]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assign To Counsellor */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#131b2e]">Assign To Counsellor</label>
                  <span className="text-[10px] text-[#004ac6] font-semibold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
                    Auto Balancing
                  </span>
                </div>
                <select
                  value={assignedCounsellorId}
                  onChange={(e) => setAssignedCounsellorId(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#f2f3ff] text-xs md:text-sm text-[#131b2e] focus:outline-none border border-[#dae2fd]"
                >
                  <option value="round-robin">Auto Round-Robin (Weighted Capacity)</option>
                  {counsellors.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.title} • {c.activeLeadsCount} leads)
                    </option>
                  ))}
                </select>
              </div>

              {/* Initial Pipeline Stage */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#131b2e]">Initial Pipeline Stage</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as LeadStatus)}
                  className="w-full p-2 rounded-lg bg-[#f2f3ff] text-xs md:text-sm text-[#131b2e] focus:outline-none border border-[#dae2fd]"
                >
                  <option value="NEW">New Enquiry</option>
                  <option value="CONTACTED">Contacted / Initial Ping</option>
                  <option value="INTERESTED">Interested / Prospect Vetted</option>
                  <option value="APPLICATION_STARTED">Application Started</option>
                </select>
              </div>

              {/* First Follow-up Date & Time */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#131b2e]">Schedule First Follow-up</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={followupDate}
                    onChange={(e) => setFollowupDate(e.target.value)}
                    className="p-2 rounded-lg bg-[#f2f3ff] text-xs md:text-sm text-[#131b2e] focus:outline-none border border-[#dae2fd]"
                  />
                  <input
                    type="time"
                    value={followupTime}
                    onChange={(e) => setFollowupTime(e.target.value)}
                    className="p-2 rounded-lg bg-[#f2f3ff] text-xs md:text-sm text-[#131b2e] focus:outline-none border border-[#dae2fd]"
                  />
                </div>
              </div>

              {/* Initial Remarks */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#131b2e]">Initial Notes / Conversation Brief</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enquired for BCA Cyber Security specialization with hostel facility..."
                  rows={2}
                  className="w-full p-2.5 rounded-lg bg-[#f2f3ff] text-xs md:text-sm text-[#131b2e] focus:outline-none resize-none border border-[#dae2fd]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-2.5 rounded-lg bg-[#eaedff] text-[#131b2e] font-semibold text-xs flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-[#004ac6] text-white font-semibold text-xs md:text-sm flex items-center justify-center gap-1.5 shadow-sm hover:bg-[#003ea8]"
                >
                  <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                  <span>Save & Assign Lead</span>
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Success Modal Overlay */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#131b2e]/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl text-center space-y-4 border border-[#eaedff]">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>

              <div>
                <h3 className="font-bold text-lg text-[#131b2e]">Lead Created Successfully!</h3>
                <p className="text-xs text-[#434655] mt-1 leading-relaxed">
                  <strong>{name}</strong> recorded in pipeline. First callback reminder scheduled for {followupDate} at{' '}
                  {followupTime}.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#004ac6] text-white text-xs font-semibold shadow-xs hover:bg-[#003ea8]"
                >
                  Create Another Lead
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddLeadModalOpen(false);
                    if (createdLeadId) openLeadDetails(createdLeadId);
                    setActiveTab('leads');
                  }}
                  className="w-full py-2 px-4 rounded-xl bg-[#eaedff] text-[#004ac6] text-xs font-semibold hover:bg-[#dae2fd]"
                >
                  View Lead Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
