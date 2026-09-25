import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { crmService } from '../../services/crmService';

export const CsvImportExportModal: React.FC = () => {
  const { isCsvModalOpen, setIsCsvModalOpen, leads, showToast } = useCrm();

  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [csvContent, setCsvContent] = useState('');
  const [importResult, setImportResult] = useState<{
    successCount: number;
    errors: string[];
  } | null>(null);

  if (!isCsvModalOpen) return null;

  const sampleTemplate = `Name,Phone,Email,City,Course,Source,Priority
Pooja Hegde,+91 98765 11223,pooja.h@example.com,Bengaluru,BCA,Website,HIGH
Aditya Kashyap,+91 98200 44556,aditya.k@example.com,Mumbai,MBA,Google Ads,URGENT
Rhea Pillai,+91 97410 77889,rhea.p@example.com,Chennai,B.Tech,Walk-in,MEDIUM`;

  const handleDownloadSample = () => {
    const blob = new Blob([sampleTemplate], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EduLead_Sample_Import_Template.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded sample CSV template');
  };

  const handleProcessImport = () => {
    if (!csvContent.trim()) {
      showToast('Please paste or upload CSV text', undefined, 'warning');
      return;
    }

    const res = crmService.parseCsv(csvContent);
    setImportResult({
      successCount: res.successCount,
      errors: res.errors,
    });

    if (res.successCount > 0) {
      showToast(`Successfully imported ${res.successCount} leads!`, undefined, 'success');
    }
  };

  const handleExportAll = () => {
    const csvStr = crmService.exportLeadsCsv();
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EduLead_All_Leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${leads.length} leads to CSV`);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={() => setIsCsvModalOpen(false)}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#eaedff] flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#eaedff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[22px]">swap_vert</span>
            <h3 className="font-bold text-base text-[#131b2e]">CSV Lead Data Management</h3>
          </div>
          <button
            onClick={() => setIsCsvModalOpen(false)}
            className="w-8 h-8 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#434655]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 bg-[#eaedff] m-4 rounded-xl">
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'import' ? 'bg-white text-[#004ac6] shadow-xs' : 'text-[#434655]'
            }`}
          >
            Import Leads CSV
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'export' ? 'bg-white text-[#004ac6] shadow-xs' : 'text-[#434655]'
            }`}
          >
            Export Leads CSV
          </button>
        </div>

        <div className="p-4 pt-0 space-y-3 text-xs">
          {activeTab === 'import' ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-[#434655]">
                  Expected columns: <code className="bg-[#f2f3ff] px-1 rounded text-[#004ac6]">Name, Phone, Course, Source</code>
                </span>
                <button
                  type="button"
                  onClick={handleDownloadSample}
                  className="text-[#004ac6] font-semibold hover:underline flex items-center gap-0.5"
                >
                  <span className="material-symbols-outlined text-[14px]">download</span>
                  <span>Sample</span>
                </button>
              </div>

              <div>
                <textarea
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  placeholder="Paste CSV rows here or click sample..."
                  rows={5}
                  className="w-full p-2.5 rounded-xl bg-[#f2f3ff] font-mono text-[11px] text-[#131b2e] border border-[#dae2fd] focus:outline-none focus:bg-white resize-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCsvContent(sampleTemplate)}
                  className="px-3 py-2 rounded-lg bg-[#eaedff] text-[#004ac6] font-semibold"
                >
                  Load Sample Data
                </button>
                <button
                  type="button"
                  onClick={handleProcessImport}
                  className="flex-1 py-2 rounded-lg bg-[#004ac6] text-white font-bold hover:bg-[#003ea8]"
                >
                  Validate & Import Leads
                </button>
              </div>

              {/* Validation Summary */}
              {importResult && (
                <div className="p-3 bg-[#f2f3ff] rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-[#131b2e]">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
                    <span>Imported {importResult.successCount} valid lead records</span>
                  </div>
                  {importResult.errors.length > 0 && (
                    <div className="pt-1 text-[#ba1a1a] space-y-0.5">
                      <span className="font-semibold block">Validation Issues ({importResult.errors.length}):</span>
                      {importResult.errors.map((err, i) => (
                        <p key={i} className="text-[11px]">• {err}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="py-4 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-[#dbe1ff] text-[#004ac6] flex items-center justify-center mx-auto shadow-xs">
                <span className="material-symbols-outlined text-[28px]">file_download</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#131b2e]">Export Entire Admissions Database</h4>
                <p className="text-[#434655] mt-1 text-xs">
                  Download complete spreadsheet containing all {leads.length} student leads, enquiry sources, and assignments.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportAll}
                className="w-full py-2.5 rounded-xl bg-[#004ac6] text-white font-bold shadow-xs hover:bg-[#003ea8]"
              >
                Download CSV Spreadsheet
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
