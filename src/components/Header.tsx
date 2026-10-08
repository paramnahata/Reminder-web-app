import React, { useState, useRef, useEffect } from 'react';
import { NotificationItem } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { requestNotificationPermission } from '../utils/notifications';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenMobileMenu: () => void;
  notifications: NotificationItem[];
  onMarkNotificationsRead: () => void;
  onOpenAndroidModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenMobileMenu,
  notifications,
  onMarkNotificationsRead,
  onOpenAndroidModal,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationPermissionState, setNotificationPermissionState] = useState<NotificationPermission>('default');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isInstallable, install } = usePWAInstall();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermissionState(Notification.permission);
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRequestPush = async () => {
    const res = await requestNotificationPermission();
    setNotificationPermissionState(res);
  };

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)] border-b border-outline-variant/20 z-40">
      <div className="h-16 w-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle & Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors"
            aria-label="Open navigation menu"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>

          {/* Quick Search trigger */}
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between bg-surface-container-lowest rounded-xl px-3.5 py-2 shadow-[0_1px_8px_rgba(0,0,0,0.02)] border border-outline-variant/30 text-on-surface-variant hover:border-secondary/40 transition-all text-left group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-secondary transition-colors">
                search
              </span>
              <span className="text-[13px] text-outline truncate group-hover:text-on-surface transition-colors">
                Search agenda, vault, or notes...
              </span>
            </div>
            <kbd className="hidden sm:inline-block text-[11px] font-mono bg-surface-container-high text-on-surface-variant px-1.5 py-0.5 rounded border border-outline-variant/40">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* PWA In-App Install Prompt */}
          {isInstallable && (
            <button
              onClick={install}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-high text-on-surface text-[12px] font-medium border border-outline-variant/30 hover:bg-surface-container-highest transition-all"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">install_mobile</span>
              <span>Install PWA</span>
            </button>
          )}

          {/* Android Companion Shortcut */}
          <button
            onClick={onOpenAndroidModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary/10 text-secondary text-[12px] font-medium hover:bg-secondary/15 transition-all border border-secondary/20"
            title="Inspect Android Alarm Configuration & Synchronization"
          >
            <span className="material-symbols-outlined text-[16px]">android</span>
            <span className="hidden md:inline">Android Alarms</span>
          </button>

          {/* Notification Bell with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (unreadCount > 0) {
                  onMarkNotificationsRead();
                }
              }}
              className="relative p-2 rounded-xl hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
              aria-label="View notifications"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              {unreadCount > 0 ? (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full animate-pulse" />
              ) : (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-outline-variant rounded-full opacity-60" />
              )}
            </button>

            {/* Notification Drawer Popover */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 sm:w-96 bg-surface-container-lowest rounded-2xl shadow-[0_12px_40px_-6px_rgba(26,25,24,0.12)] border border-outline-variant/40 p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-secondary">
                      notifications_active
                    </span>
                    <h3 className="text-[14px] font-semibold text-on-surface">Dispatch Alerts</h3>
                  </div>
                  {notificationPermissionState !== 'granted' && (
                    <button
                      onClick={handleRequestPush}
                      className="text-[11px] font-semibold text-secondary hover:underline uppercase tracking-wide"
                    >
                      Enable Push
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-outline-variant/20 py-2">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-outline text-[13px]">
                      No active alert dispatches.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif.id} className="py-2.5 px-1 hover:bg-surface-container-low rounded-lg transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[12px] font-medium text-on-surface">{notif.title}</span>
                          <span className="text-[10px] text-outline font-mono">
                            {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[12px] text-on-surface-variant leading-relaxed">{notif.body}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 text-center border-t border-outline-variant/20">
                  <button
                    onClick={onOpenAndroidModal}
                    className="text-[11px] font-medium text-secondary hover:underline"
                  >
                    View Android Exact Alarm Diagnostics →
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-outline-variant/40" />

          {/* User Profile Chip */}
          <div className="flex items-center gap-3 py-1 px-1.5 sm:px-2 rounded-xl hover:bg-surface-container transition-colors cursor-pointer">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[12px] font-medium text-on-surface leading-tight">
                Julian Vance
              </span>
              <span className="text-[11px] text-secondary font-medium tracking-normal leading-tight">
                Executive Horology Sync
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-xs">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
