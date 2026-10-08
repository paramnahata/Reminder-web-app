import React, { useState } from 'react';
import { chimeSynthesizer } from '../utils/audio';

interface RightSidebarProps {
  onOpenUpcomingModal: () => void;
  onOpenAndroidModal: () => void;
  deviceCount: number;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  onOpenUpcomingModal,
  onOpenAndroidModal,
  deviceCount,
}) => {
  const [autoEscalate, setAutoEscalate] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleTestAudio = () => {
    setIsPlayingAudio(true);
    chimeSynthesizer.playCelestiaCrescendo();
    setTimeout(() => setIsPlayingAudio(false), 3800);
  };

  return (
    <aside className="lg:col-span-4 flex flex-col gap-6">
      {/* Card 1: Smart Persistence Cadence */}
      <div className="p-6 rounded-[24px] bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.02)] border border-outline-variant/20 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-secondary">
              all_inclusive
            </span>
            <h4 className="text-[16px] text-on-surface font-medium leading-none">
              Smart Persistence
            </h4>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[11px] font-semibold uppercase tracking-wide border border-secondary/20">
            ACTIVE
          </span>
        </div>

        <p className="text-[13px] text-on-surface-variant leading-relaxed">
          Active autonomous loop ensures no critical commitment is missed by
          escalating haptics, acoustics, and secondary devices until explicitly marked
          done.
        </p>

        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/10">
            <span className="text-[12px] text-on-surface-variant">Repetition Interval</span>
            <span className="text-[12px] text-on-surface font-semibold font-mono">
              Every 15 min
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/10">
            <span className="text-[12px] text-on-surface-variant">Max Retries</span>
            <span className="text-[12px] text-on-surface font-semibold font-mono">
              3 cycles (Smart limit)
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/10">
            <span className="text-[12px] text-on-surface-variant">Audio Profile</span>
            <button
              type="button"
              onClick={handleTestAudio}
              className="inline-flex items-center gap-1.5 text-[12px] text-secondary font-medium hover:underline cursor-pointer group"
              title="Test Celestia Crescendo chime"
            >
              <span
                className={`material-symbols-outlined text-[15px] ${
                  isPlayingAudio ? 'animate-bounce text-secondary' : 'text-outline group-hover:text-secondary'
                }`}
              >
                {isPlayingAudio ? 'volume_up' : 'play_circle'}
              </span>
              <span>Celestia Gradual Crescendo</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-outline">Auto-escalate to private PA</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoEscalate}
              onChange={(e) => setAutoEscalate(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-surface-variant peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-variant after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary" />
          </label>
        </div>
      </div>

      {/* Card 2: Upcoming Horizon */}
      <div className="p-6 rounded-[24px] bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.02)] border border-outline-variant/20 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-outline">
              next_week
            </span>
            <h4 className="text-[16px] text-on-surface font-medium leading-none">
              Upcoming Horizon
            </h4>
          </div>
          <button
            type="button"
            onClick={onOpenUpcomingModal}
            className="text-[11px] font-semibold text-secondary hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="space-y-4">
          {/* Horizon Item 1 */}
          <div
            onClick={onOpenUpcomingModal}
            className="flex items-start gap-3 group cursor-pointer hover:bg-surface-container-low/50 p-1.5 -mx-1.5 rounded-xl transition-colors"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-[11px] text-outline font-mono uppercase tracking-wider block">
                Tomorrow, Oct 10 • 08:30 AM
              </span>
              <p className="text-[14px] text-on-surface font-medium truncate group-hover:text-secondary transition-colors">
                Private Breakfast with Zurich Team
              </p>
              <p className="text-[13px] text-on-surface-variant truncate">
                The Battery, Salon Room
              </p>
            </div>
          </div>

          {/* Horizon Item 2 */}
          <div
            onClick={onOpenUpcomingModal}
            className="flex items-start gap-3 group cursor-pointer hover:bg-surface-container-low/50 p-1.5 -mx-1.5 rounded-xl transition-colors"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-outline-variant mt-2 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-[11px] text-outline font-mono uppercase tracking-wider block">
                Tomorrow, Oct 10 • 02:00 PM
              </span>
              <p className="text-[14px] text-on-surface font-medium truncate group-hover:text-secondary transition-colors">
                Architectural Review — Presidio Heights
              </p>
              <p className="text-[13px] text-on-surface-variant truncate">
                With Studio KDA & Lead Contractor
              </p>
            </div>
          </div>

          {/* Horizon Item 3 */}
          <div
            onClick={onOpenUpcomingModal}
            className="flex items-start gap-3 group cursor-pointer hover:bg-surface-container-low/50 p-1.5 -mx-1.5 rounded-xl transition-colors"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-outline-variant mt-2 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-[11px] text-outline font-mono uppercase tracking-wider block">
                Tomorrow, Oct 10 • 06:00 PM
              </span>
              <p className="text-[14px] text-on-surface font-medium truncate group-hover:text-secondary transition-colors">
                Gallery Vernissage & Acquisition
              </p>
              <p className="text-[13px] text-on-surface-variant truncate">
                Mayfair Gallery Private Salon
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Acoustic & Calibrated State Widget */}
      <div className="p-6 rounded-[24px] bg-surface-container-high/60 backdrop-blur shadow-[0_1px_8px_rgba(0,0,0,0.02)] border border-outline-variant/20 flex flex-col gap-2">
        <div className="flex items-center justify-between text-on-surface">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-secondary">
              bedtime
            </span>
            <span className="text-[11px] font-semibold tracking-wider uppercase">
              Acoustic & Calibrated State
            </span>
          </div>
          <span className="w-2 h-2 rounded-full bg-[#54906e] animate-ping" />
        </div>

        <p className="text-[13px] text-on-surface-variant leading-relaxed">
          Quiet Hours begin 10:30 PM • {deviceCount} devices synced via Private Chronicle
          Sync (Chronometer, Desktop Studio, Pocket Terminal).
        </p>

        <div className="pt-2 flex items-center justify-between text-outline text-[11px]">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-secondary">
              graphic_eq
            </span>
            42 dB Ambient Threshold
          </span>
          <button
            type="button"
            onClick={onOpenAndroidModal}
            className="font-mono hover:text-secondary transition-colors cursor-pointer"
          >
            Lat: 18ms (Sync OK)
          </button>
        </div>
      </div>
    </aside>
  );
};
