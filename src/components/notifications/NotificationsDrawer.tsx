import React from 'react';
import { useCrm } from '../../context/CrmContext';

export const NotificationsDrawer: React.FC = () => {
  const {
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    openLeadDetails,
    setActiveTab,
  } = useCrm();

  if (!isNotificationDrawerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#131b2e]/50 backdrop-blur-xs flex justify-end"
      onClick={() => setIsNotificationDrawerOpen(false)}
    >
      <div
        className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#eaedff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[22px]">notifications</span>
            <h3 className="font-bold text-base text-[#131b2e]">Notifications & SLA</h3>
          </div>
          <button
            onClick={() => setIsNotificationDrawerOpen(false)}
            className="w-8 h-8 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#434655]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Clear all action */}
        <div className="px-4 py-2 bg-[#f2f3ff] flex items-center justify-between text-xs">
          <span className="text-[#434655]">
            <strong>{notifications.filter((n) => !n.isRead).length}</strong> unread alerts
          </span>
          <button
            onClick={markAllNotificationsAsRead}
            className="text-[#004ac6] font-semibold hover:underline"
          >
            Mark all as read
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-[#737686] text-xs">
              <span className="material-symbols-outlined text-[36px] text-[#c3c6d7] block mb-1">
                notifications_paused
              </span>
              No notifications at this time.
            </div>
          ) : (
            notifications.map((notif) => {
              const isUrgent = notif.type === 'FOLLOWUP_OVERDUE';
              const isConversion = notif.type === 'LEAD_CONVERTED';

              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    markNotificationAsRead(notif.id);
                    if (notif.leadId) {
                      openLeadDetails(notif.leadId);
                      setIsNotificationDrawerOpen(false);
                    }
                  }}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    !notif.isRead
                      ? isUrgent
                        ? 'bg-[#ffdad6]/40 border-[#ffdad6] shadow-xs'
                        : isConversion
                        ? 'bg-emerald-50/70 border-emerald-200 shadow-xs'
                        : 'bg-[#eaedff]/60 border-[#b4c5ff] shadow-xs'
                      : 'bg-white border-[#f2f3ff] opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span
                      className={`font-bold flex items-center gap-1.5 ${
                        isUrgent ? 'text-[#ba1a1a]' : isConversion ? 'text-emerald-800' : 'text-[#131b2e]'
                      }`}
                    >
                      {!notif.isRead && <span className="w-1.5 h-1.5 rounded-full bg-current"></span>}
                      {notif.title}
                    </span>
                    <span className="text-[10px] text-[#737686]">
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#434655] leading-relaxed">{notif.message}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
