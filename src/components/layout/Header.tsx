import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';
import { getSafeAvatarUrl } from '../../services/crmService';

interface HeaderProps {
  title?: string;
  onBack?: () => void;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, onBack, showBack = false }) => {
  const {
    activeTab,
    unreadNotificationCount,
    setIsSearchModalOpen,
    setIsNotificationDrawerOpen,
    currentUser,
    currentRole,
    setCurrentRole,
    counsellors,
    switchUser,
    resetAllData,
    showToast,
  } = useCrm();

  const { user: authUser, signInWithGoogle, signOut } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const getDisplayTitle = () => {
    if (title) return title;
    switch (activeTab) {
      case 'dashboard':
        return currentRole === 'COUNSELLOR' ? 'Counsellor Dashboard' : 'Dashboard';
      case 'leads':
        return 'Leads';
      case 'follow-ups':
        return 'Follow Ups';
      case 'pipeline-reports':
      case 'reports':
        return 'Reports & Analytics';
      case 'counsellors':
        return 'Counsellor Workload';
      case 'courses':
        return 'Academic Courses';
      case 'campaigns':
        return 'Campaign Management';
      case 'settings':
        return 'System Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-white/90 backdrop-blur-xl border-b border-[#eaedff] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 px-4 md:px-6 flex items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Left Section: Back / Brand Logo & Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          {showBack ? (
            <button
              aria-label="Go Back"
              className="w-10 h-10 flex items-center justify-center rounded-lg text-[#434655] hover:text-[#131b2e] hover:bg-[#eaedff] transition-colors"
              onClick={onBack}
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
          ) : null}

          {/* EduLead Brand Emblem */}
          <div
            className="flex items-center gap-2 shrink-0 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-8 h-8 rounded-lg bg-[#004ac6] flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                school
              </span>
            </div>
            <div className="flex flex-col truncate">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-xs tracking-wider text-[#004ac6] uppercase leading-none">
                  EduLead
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#eaedff] text-[#004ac6]">
                  CRM
                </span>
              </div>
              <h1 className="font-semibold text-base md:text-lg text-[#131b2e] truncate leading-tight">
                {getDisplayTitle()}
              </h1>
            </div>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
          {/* Role Indicator & Fast Switcher */}
          <div className="hidden sm:flex items-center gap-1 bg-[#f2f3ff] p-1 rounded-lg border border-[#dae2fd]">
            <span className="text-[11px] font-semibold text-[#434655] px-2 uppercase tracking-wide">Role:</span>
            {(['ADMIN', 'MANAGER', 'COUNSELLOR'] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => {
                  setCurrentRole(r);
                  showToast(`Switched view to ${r} mode`, undefined, 'info');
                }}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  currentRole === r
                    ? 'bg-[#004ac6] text-white shadow-xs'
                    : 'text-[#434655] hover:text-[#131b2e] hover:bg-white/60'
                }`}
              >
                {r === 'COUNSELLOR' ? 'Counsellor' : r === 'MANAGER' ? 'Manager' : 'Admin'}
              </button>
            ))}
          </div>

          {/* Google Sign-in / Signed In indicator */}
          {!authUser ? (
            <button
              onClick={() => signInWithGoogle().catch(() => {})}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#004ac6] text-white text-xs font-semibold hover:bg-[#003da8] transition-colors shadow-xs"
              title="Sign in with Google"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="hidden sm:inline">Sign In</span>
            </button>
          ) : null}

          {/* Global Search Button */}
          <button
            aria-label="Global Search"
            onClick={() => setIsSearchModalOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-[#434655] hover:text-[#004ac6] hover:bg-[#eaedff] transition-colors relative group"
            type="button"
            title="Search leads, courses, counselors (Press '/')"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
            <span className="hidden lg:inline-block absolute -bottom-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-[#131b2e] text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Press /
            </span>
          </button>

          {/* Notifications Button */}
          <button
            aria-label="Notifications"
            onClick={() => setIsNotificationDrawerOpen(true)}
            className="relative w-10 h-10 flex items-center justify-center rounded-lg text-[#434655] hover:text-[#004ac6] hover:bg-[#eaedff] transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-[#ba1a1a] text-white text-[10px] font-bold rounded-full animate-pulse shadow-sm">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* User Profile Avatar with dropdown */}
          <div className="relative ml-1">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="relative flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-[#b4c5ff] transition-all focus:outline-none"
              type="button"
              aria-expanded={isProfileMenuOpen}
            >
              <img
                alt={authUser?.displayName || currentUser.name}
                className="w-8 h-8 rounded-full object-cover shadow-sm ring-1 ring-white"
                src={getSafeAvatarUrl(authUser?.photoURL || currentUser.avatar, authUser?.displayName || currentUser.name)}
              />
              <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_2px_#ffffff]"></span>
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#eaedff] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-3 border-b border-[#f2f3ff]">
                    <div className="flex items-center gap-2.5">
                      <img
                        alt={authUser?.displayName || currentUser.name}
                        className="w-10 h-10 rounded-full object-cover"
                        src={getSafeAvatarUrl(authUser?.photoURL || currentUser.avatar, authUser?.displayName || currentUser.name)}
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-[#131b2e] truncate">
                          {authUser?.displayName || currentUser.name}
                        </p>
                        <p className="text-xs text-[#434655] truncate">
                          {authUser?.email || currentUser.email}
                        </p>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#dbe1ff] text-[#003ea8]">
                          {currentUser.title} ({currentRole})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Switch Active Counselor profile */}
                  <div className="px-3 py-2 border-b border-[#f2f3ff]">
                    <span className="text-[11px] font-semibold text-[#434655] uppercase tracking-wider block mb-1 px-1">
                      Switch Counselor Profile
                    </span>
                    <div className="space-y-1">
                      {counsellors.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            switchUser(c.id);
                            setIsProfileMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                            currentUser.id === c.id
                              ? 'bg-[#eaedff] font-semibold text-[#004ac6]'
                              : 'text-[#434655] hover:bg-[#f2f3ff]'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span className="truncate">{c.name}</span>
                          </div>
                          <span className="text-[10px] text-[#737686]">{c.enrolledCount} Confirmed</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Role Switcher in dropdown for mobile */}
                  <div className="sm:hidden px-3 py-2 border-b border-[#f2f3ff]">
                    <span className="text-[11px] font-semibold text-[#434655] uppercase tracking-wider block mb-1 px-1">
                      Current Perspective
                    </span>
                    <div className="grid grid-cols-3 gap-1">
                      {(['ADMIN', 'MANAGER', 'COUNSELLOR'] as Role[]).map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            setCurrentRole(r);
                            setIsProfileMenuOpen(false);
                            showToast(`Switched to ${r} mode`);
                          }}
                          className={`py-1 rounded text-center text-xs font-semibold ${
                            currentRole === r ? 'bg-[#004ac6] text-white' : 'bg-[#f2f3ff] text-[#434655]'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {authUser && (
                    <div className="px-3 py-2 border-b border-[#f2f3ff]">
                      <button
                        onClick={() => {
                          signOut();
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-lg transition-colors font-medium text-left"
                      >
                        <span className="material-symbols-outlined text-[16px]">logout</span>
                        <span>Sign Out of Google</span>
                      </button>
                    </div>
                  )}

                  {/* Operational Settings / Reset Demo State */}
                  <div className="px-2 pt-1">
                    <button
                      onClick={() => {
                        resetAllData();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-lg transition-colors font-medium text-left"
                    >
                      <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                      <span>Reset Sample Institutional Data</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
