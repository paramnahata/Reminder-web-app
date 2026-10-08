import React from 'react';
import { TabType } from '../types';

interface SidebarProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  syncLatencyMs: number;
  isSynchronized: boolean;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  syncLatencyMs,
  isSynchronized,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems: { id: TabType; label: string; icon: string; badge?: string }[] = [
    { id: 'today', label: 'Today', icon: 'wb_sunny' },
    { id: 'upcoming', label: 'Upcoming', icon: 'upcoming' },
    { id: 'all-reminders', label: 'All Reminders', icon: 'format_list_bulleted' },
    { id: 'completed', label: 'Completed', icon: 'check_circle' },
    { id: 'calendar', label: 'Calendar', icon: 'calendar_today' },
    { id: 'android', label: 'Android & Alarms', icon: 'smartphone', badge: 'SDK 34' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-surface-container-low shadow-[0_1px_8px_rgba(0,0,0,0.03)] z-50 flex flex-col justify-between p-6 transition-transform duration-300 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-8">
          {/* Logo & Brand Header */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-[19px] font-semibold tracking-wider text-on-surface">
                KALLOS
              </span>
              <span className="text-outline-variant text-[13px] font-normal">/</span>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-secondary">
                Chronology
              </span>
            </div>
            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    onCloseMobile();
                  }}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all text-left w-full ${
                    isActive
                      ? 'bg-surface-container-highest text-on-surface font-medium shadow-[0_1px_3px_rgba(0,0,0,0.02)]'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`material-symbols-outlined text-[20px] transition-colors ${
                        isActive ? 'text-secondary' : 'text-outline'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="text-[14px]">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className="text-[9px] font-mono tracking-wider font-semibold uppercase px-1.5 py-0.5 rounded bg-secondary-container/60 text-on-secondary-container">
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Encrypted Vault & Synchronized Indicator */}
        <div className="flex flex-col gap-4 pt-4 border-t border-outline-variant/30">
          {/* Encrypted Vault Card */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-[0_1px_8px_rgba(0,0,0,0.02)] flex flex-col gap-1 border border-outline-variant/20">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-outline">
                Encrypted Vault
              </span>
              <span className="material-symbols-outlined text-[16px] text-secondary">
                lock
              </span>
            </div>
            <p className="text-[13px] text-on-surface font-medium">142 KB / 2.0 GB</p>
            <div className="w-full h-1 bg-surface-container-high rounded-full overflow-hidden mt-1">
              <div className="h-full bg-secondary rounded-full w-[7%]" />
            </div>
          </div>

          {/* Synchronized Status Pill */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isSynchronized ? 'bg-[#54906e]' : 'bg-error animate-ping'
                }`}
              />
              <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                {isSynchronized ? 'Synchronized' : 'Offline Mode'}
              </span>
            </div>
            <span className="text-[11px] text-outline font-mono">
              {(syncLatencyMs / 1000).toFixed(1)}s
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
