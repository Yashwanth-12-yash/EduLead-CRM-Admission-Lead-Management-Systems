import React from 'react';
import { useCrm } from '../../context/CrmContext';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useCrm();

  if (!toast) return null;

  const getBorderColor = () => {
    switch (toast.type) {
      case 'error':
        return 'border-[#ba1a1a] bg-[#ffdad6]/20 text-[#ba1a1a]';
      case 'warning':
        return 'border-amber-500 bg-amber-50 text-amber-800';
      case 'info':
        return 'border-[#004ac6] bg-[#dbe1ff]/30 text-[#004ac6]';
      default:
        return 'border-emerald-500 bg-emerald-50 text-emerald-800';
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'check_circle';
    }
  };

  return (
    <div className="fixed top-20 left-4 right-4 max-w-md mx-auto z-50 animate-in fade-in slide-in-from-top-4 duration-200">
      <div
        className={`bg-white rounded-xl p-3.5 shadow-xl border-l-4 ${getBorderColor()} flex items-start justify-between gap-3`}
      >
        <div className="flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[20px] mt-0.5 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
            {getIcon()}
          </span>
          <div>
            <h4 className="font-semibold text-sm text-[#131b2e] leading-snug">{toast.title}</h4>
            {toast.message && <p className="text-xs text-[#434655] mt-0.5">{toast.message}</p>}
          </div>
        </div>
        <button
          onClick={hideToast}
          className="text-[#737686] hover:text-[#131b2e] p-1 rounded-md hover:bg-black/5"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </div>
  );
};
