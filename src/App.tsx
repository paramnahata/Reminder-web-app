import React, { useState, useEffect } from 'react';
import { TabType, ViewMode, Commitment } from './types';
import { useChronologySync } from './hooks/useChronologySync';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HeroReminder } from './components/HeroReminder';
import { TimelineSection } from './components/TimelineSection';
import { RightSidebar } from './components/RightSidebar';
import { AndroidSyncModal } from './components/AndroidSyncModal';
import { NewCommitmentModal } from './components/NewCommitmentModal';
import { FilterModal } from './components/FilterModal';
import { EscalationLadderModal } from './components/EscalationLadderModal';
import { SearchDialog } from './components/SearchDialog';
import { UpcomingModal } from './components/UpcomingModal';
import { chimeSynthesizer } from './utils/audio';
import { triggerTaskNotification } from './utils/notifications';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('today');
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  // Modals state
  const [isNewCommitmentOpen, setIsNewCommitmentOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isEscalationOpen, setIsEscalationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUpcomingModalOpen, setIsUpcomingModalOpen] = useState(false);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);

  const {
    commitments,
    isSynchronized,
    syncLatencyMs,
    deviceCount,
    notifications,
    toggleCommitment,
    snoozeCommitment,
    addCommitment,
    markAllNotificationsRead,
  } = useChronologySync();

  // Keyboard shortcut for ⌘K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered commitments
  const filteredCommitments = commitments.filter((item) => {
    if (activeFilter === 'pending') return item.status !== 'completed';
    if (activeFilter === 'priority') return item.tagType === 'priority';
    if (activeFilter === 'completed') return item.status === 'completed';
    return true;
  });

  // Next reminder hero is either the first pending upcoming item or default
  const heroCommitment =
    commitments.find((c) => c.tagType === 'upcoming') ||
    commitments[1] ||
    commitments[0];

  const pendingCount = commitments.filter((c) => c.status !== 'completed').length;

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface antialiased selection:bg-secondary-container selection:text-on-secondary-container flex">
      {/* Left Fixed Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        syncLatencyMs={syncLatencyMs}
        isSynchronized={isSynchronized}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
      />

      {/* Main App Container */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen w-full min-w-0">
        {/* Top Header */}
        <Header
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenMobileMenu={() => setIsOpenMobile(true)}
          notifications={notifications}
          onMarkNotificationsRead={markAllNotificationsRead}
          onOpenAndroidModal={() => setIsAndroidModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="w-full pt-16 bg-surface flex-1">
          <div className="w-full max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-8">
            {/* Tab: TODAY */}
            {currentTab === 'today' && (
              <>
                {/* Top Greeting Area */}
                <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                  <div className="flex flex-col gap-1">
                    <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-surface-container-high text-secondary border border-outline-variant/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                      <span className="text-[11px] font-semibold tracking-wider uppercase">
                        CHRONICLED DISPATCH • FRIDAY, OCTOBER 9
                      </span>
                    </div>

                    <h1 className="text-[36px] sm:text-[48px] font-light text-on-surface tracking-tight mt-1 leading-tight">
                      Good evening, Julian.
                    </h1>

                    <p className="text-[14px] text-on-surface-variant flex flex-wrap items-center gap-2">
                      <span>{pendingCount} reminders coming up today</span>
                      <span className="text-outline-variant">•</span>
                      <span className="inline-flex items-center gap-1.5 text-secondary font-medium">
                        <span className="material-symbols-outlined text-[16px]">
                          verified
                        </span>
                        1 active alert sequence armed
                      </span>
                    </p>
                  </div>

                  {/* Top Action Buttons */}
                  <div className="flex items-center gap-3 self-start lg:self-end">
                    <button
                      onClick={() => setIsFilterOpen(true)}
                      className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface shadow-[0_1px_8px_rgba(0,0,0,0.02)] hover:bg-surface-container border border-outline-variant/30 transition-all cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-on-surface transition-colors">
                        tune
                      </span>
                      <span className="text-[12px] font-medium">
                        {activeFilter !== 'all' ? `Filter (${activeFilter})` : 'Filter & View'}
                      </span>
                    </button>

                    <button
                      onClick={() => setIsNewCommitmentOpen(true)}
                      className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary shadow-xs hover:bg-inverse-surface active:scale-[0.99] transition-all cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px] text-secondary-fixed transition-transform group-hover:rotate-90">
                        add
                      </span>
                      <span className="text-[12px] font-medium">
                        New Commitment
                      </span>
                    </button>
                  </div>
                </header>

                {/* Hero Reminder Card */}
                {heroCommitment && (
                  <HeroReminder
                    commitment={heroCommitment}
                    onToggleComplete={toggleCommitment}
                    onSnooze={snoozeCommitment}
                    onOpenEscalationModal={() => setIsEscalationOpen(true)}
                  />
                )}

                {/* Main Two-Column Structure */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left: Primary Timeline Column */}
                  <div className="lg:col-span-8">
                    <TimelineSection
                      commitments={filteredCommitments}
                      viewMode={viewMode}
                      setViewMode={setViewMode}
                      onToggleComplete={toggleCommitment}
                      onOpenDetails={() => setIsEscalationOpen(true)}
                    />
                  </div>

                  {/* Right: Secondary Aside Column */}
                  <RightSidebar
                    onOpenUpcomingModal={() => setIsUpcomingModalOpen(true)}
                    onOpenAndroidModal={() => setIsAndroidModalOpen(true)}
                    deviceCount={deviceCount}
                  />
                </div>
              </>
            )}

            {/* Tab: UPCOMING */}
            {currentTab === 'upcoming' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-[32px] font-light text-on-surface">Upcoming Horizon</h2>
                  <p className="text-[14px] text-on-surface-variant">
                    Extended temporal commitments and synchronized calendar itineraries.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      date: 'Tomorrow, Oct 10 • 08:30 AM',
                      title: 'Private Breakfast with Zurich Team',
                      location: 'The Battery, Salon Room',
                      desc: 'Quarterly review with European partners.',
                    },
                    {
                      date: 'Tomorrow, Oct 10 • 02:00 PM',
                      title: 'Architectural Review — Presidio Heights',
                      location: 'With Studio KDA & Lead Contractor',
                      desc: 'Site materials inspection & lighting review.',
                    },
                    {
                      date: 'Tomorrow, Oct 10 • 06:00 PM',
                      title: 'Gallery Vernissage & Acquisition',
                      location: 'Mayfair Gallery Private Salon',
                      desc: 'Private view of horological timepieces.',
                    },
                    {
                      date: 'Monday, Oct 12 • 09:00 AM',
                      title: 'Executive Board Quorum Dispatch',
                      location: 'Geneva Horology Center',
                      desc: 'Global strategy alignment & audit presentation.',
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-6 rounded-[24px] bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-2 hover:shadow-md transition-shadow"
                    >
                      <span className="text-[11px] font-mono uppercase tracking-wider text-secondary">
                        {item.date}
                      </span>
                      <h3 className="text-[16px] font-medium text-on-surface">{item.title}</h3>
                      <p className="text-[13px] text-on-surface-variant">{item.desc}</p>
                      <div className="pt-2 flex items-center gap-1.5 text-[12px] text-outline">
                        <span className="material-symbols-outlined text-[15px] text-secondary">
                          location_on
                        </span>
                        {item.location}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: ALL REMINDERS */}
            {currentTab === 'all-reminders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-[32px] font-light text-on-surface">All Reminders</h2>
                    <p className="text-[14px] text-on-surface-variant">
                      Complete archive of scheduled dispatches and alert chains.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsNewCommitmentOpen(true)}
                    className="px-4 py-2 bg-primary text-on-primary text-[12px] font-medium rounded-xl hover:bg-inverse-surface"
                  >
                    + Add Reminder
                  </button>
                </div>
                <TimelineSection
                  commitments={commitments}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  onToggleComplete={toggleCommitment}
                  onOpenDetails={() => setIsEscalationOpen(true)}
                />
              </div>
            )}

            {/* Tab: COMPLETED */}
            {currentTab === 'completed' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-[32px] font-light text-on-surface">Completed Commitments</h2>
                  <p className="text-[14px] text-on-surface-variant">
                    Historical record of resolved dispatches and acknowledged alarms.
                  </p>
                </div>
                <TimelineSection
                  commitments={commitments.filter((c) => c.status === 'completed')}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  onToggleComplete={toggleCommitment}
                  onOpenDetails={() => setIsEscalationOpen(true)}
                />
              </div>
            )}

            {/* Tab: CALENDAR */}
            {currentTab === 'calendar' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-[32px] font-light text-on-surface">October 2026 Calendar</h2>
                  <p className="text-[14px] text-on-surface-variant">
                    Executive horological grid with synced chronological time blocks.
                  </p>
                </div>
                <div className="p-6 rounded-[24px] bg-surface-container-lowest border border-outline-variant/20 shadow-xs">
                  <div className="grid grid-cols-7 gap-2 text-center text-[12px] font-mono text-outline mb-4">
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => (
                      <div key={d} className="py-1">
                        {d}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                      const isToday = day === 9;
                      const hasEvent = [9, 10, 11, 15, 22].includes(day);
                      return (
                        <div
                          key={day}
                          className={`p-3 rounded-2xl min-h-[72px] flex flex-col justify-between text-left transition-all border ${
                            isToday
                              ? 'bg-secondary/10 border-secondary/40 ring-1 ring-secondary/30'
                              : 'bg-surface-container-low/40 border-outline-variant/10 hover:border-outline-variant/30'
                          }`}
                        >
                          <span
                            className={`text-[12px] font-mono ${
                              isToday ? 'font-bold text-secondary' : 'text-on-surface'
                            }`}
                          >
                            {day}
                          </span>
                          {hasEvent && (
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary self-end" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: ANDROID & ALARMS */}
            {currentTab === 'android' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-[32px] font-light text-on-surface">
                    Android Native App & Alarm Diagnostics
                  </h2>
                  <p className="text-[14px] text-on-surface-variant">
                    Full Android 12–15 exact alarm architecture and Web Push real-time synchronization.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card 1: Alarm permissions */}
                  <div className="p-6 rounded-[24px] bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 text-secondary">
                      <span className="material-symbols-outlined text-[20px]">verified_user</span>
                      <h3 className="text-[16px] font-semibold text-on-surface">
                        Configured Android Permissions
                      </h3>
                    </div>
                    <ul className="text-[13px] text-on-surface-variant space-y-2">
                      <li className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
                        <span className="font-mono text-[12px]">SCHEDULE_EXACT_ALARM</span>
                        <span className="text-[11px] font-mono text-[#54906e]">GRANTED</span>
                      </li>
                      <li className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
                        <span className="font-mono text-[12px]">USE_EXACT_ALARM</span>
                        <span className="text-[11px] font-mono text-[#54906e]">GRANTED</span>
                      </li>
                      <li className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
                        <span className="font-mono text-[12px]">POST_NOTIFICATIONS</span>
                        <span className="text-[11px] font-mono text-[#54906e]">GRANTED</span>
                      </li>
                      <li className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
                        <span className="font-mono text-[12px]">WAKE_LOCK & BOOT_COMPLETED</span>
                        <span className="text-[11px] font-mono text-[#54906e]">ACTIVE</span>
                      </li>
                    </ul>
                    <button
                      onClick={() => setIsAndroidModalOpen(true)}
                      className="w-full py-2.5 bg-primary text-on-primary rounded-xl text-[12px] font-medium hover:bg-inverse-surface transition-all"
                    >
                      Open Android Diagnostic Suite
                    </button>
                  </div>

                  {/* Card 2: Interactive alarm trigger */}
                  <div className="p-6 rounded-[24px] bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 text-secondary">
                      <span className="material-symbols-outlined text-[20px]">ring_volume</span>
                      <h3 className="text-[16px] font-semibold text-on-surface">
                        Audio Chime & Alarm Simulation
                      </h3>
                    </div>
                    <p className="text-[13px] text-on-surface-variant leading-relaxed">
                      Synthesize the Celestia Gradual Crescendo or trigger a test notification
                      right now.
                    </p>
                    <div className="flex flex-col gap-2 pt-2">
                      <button
                        onClick={() => chimeSynthesizer.playCelestiaCrescendo()}
                        className="w-full py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline-variant/30 text-[12px] font-medium transition-all"
                      >
                        Play Celestia Gradual Crescendo
                      </button>
                      <button
                        onClick={() => {
                          triggerTaskNotification(
                            'Kallos Chronology Alert',
                            'Scheduled exact alarm fired. Transit checkpoint live.',
                            'celestia'
                          );
                        }}
                        className="w-full py-2.5 rounded-xl bg-secondary text-white hover:bg-secondary/90 text-[12px] font-medium transition-all"
                      >
                        Send Test Task Notification
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: SETTINGS */}
            {currentTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-[32px] font-light text-on-surface">Chronology Settings</h2>
                  <p className="text-[14px] text-on-surface-variant">
                    Temporal preferences, audio profiles, and device synchronization.
                  </p>
                </div>
                <div className="p-6 rounded-[24px] bg-surface-container-lowest border border-outline-variant/20 shadow-xs space-y-4 max-w-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                    <div>
                      <span className="text-[14px] font-medium text-on-surface">
                        Smart Persistence Audio Profile
                      </span>
                      <p className="text-[12px] text-outline">
                        Harmonic audio crescendo with gradual volume swell
                      </p>
                    </div>
                    <span className="text-[12px] text-secondary font-semibold">
                      Celestia
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                    <div>
                      <span className="text-[14px] font-medium text-on-surface">
                        Repetition Interval
                      </span>
                      <p className="text-[12px] text-outline">
                        Autononous escalation interval for unacknowledged alarms
                      </p>
                    </div>
                    <span className="text-[12px] font-mono text-on-surface">
                      15 minutes
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                    <div>
                      <span className="text-[14px] font-medium text-on-surface">
                        Connected Chronometers & Terminals
                      </span>
                      <p className="text-[12px] text-outline">
                        Real-time synced devices on private horology cluster
                      </p>
                    </div>
                    <span className="text-[12px] font-mono text-on-surface">
                      {deviceCount} Active
                    </span>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setIsAndroidModalOpen(true)}
                      className="text-[12px] text-secondary font-medium hover:underline"
                    >
                      View Android Manifest & Exact Alarm Configuration →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Interactive Modals */}
      <NewCommitmentModal
        isOpen={isNewCommitmentOpen}
        onClose={() => setIsNewCommitmentOpen(false)}
        onAddCommitment={addCommitment}
      />

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      {heroCommitment && (
        <EscalationLadderModal
          isOpen={isEscalationOpen}
          onClose={() => setIsEscalationOpen(false)}
          commitment={heroCommitment}
        />
      )}

      <SearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        commitments={commitments}
        onSelectCommitment={(item) => {
          if (item.tagType === 'upcoming') {
            setIsEscalationOpen(true);
          }
        }}
      />

      <UpcomingModal
        isOpen={isUpcomingModalOpen}
        onClose={() => setIsUpcomingModalOpen(false)}
      />

      <AndroidSyncModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
        syncLatencyMs={syncLatencyMs}
        deviceCount={deviceCount}
      />
    </div>
  );
}
