import React, { useState, useEffect } from 'react';
import { Commitment } from '../types';

interface HeroReminderProps {
  commitment: Commitment;
  onToggleComplete: (id: string) => void;
  onSnooze: (id: string, minutes: number) => void;
  onOpenEscalationModal: () => void;
}

export const HeroReminder: React.FC<HeroReminderProps> = ({
  commitment,
  onToggleComplete,
  onSnooze,
  onOpenEscalationModal,
}) => {
  // Live ticking countdown calculation for 7:00 PM today
  const [countdownMinutes, setCountdownMinutes] = useState(18);
  const [countdownSeconds, setCountdownSeconds] = useState(42);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((prevSec) => {
        if (prevSec <= 0) {
          setCountdownMinutes((prevMin) => (prevMin > 0 ? prevMin - 1 : 0));
          return 59;
        }
        return prevSec - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isCompleted = commitment.status === 'completed';

  return (
    <section className="relative overflow-hidden rounded-[24px] bg-surface-container-lowest shadow-[0_8px_30px_-4px_rgba(26,25,24,0.03),0_24px_48px_-8px_rgba(26,25,24,0.05)] border border-outline-variant/20 p-6 lg:p-8">
      {/* Ambient champagne gold light glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none" />

      <div className="relative grid grid-cols-1 xl:grid-cols-12 gap-8 items-center">
        {/* Left: Main Focus Horology */}
        <div className="xl:col-span-7 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant text-[11px] font-semibold tracking-widest uppercase">
              NEXT REMINDER
            </span>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
              <span
                className="material-symbols-outlined text-[15px] animate-spin text-secondary"
                style={{ animationDuration: '9s' }}
              >
                timelapse
              </span>
              <span className="text-[11px] font-medium font-mono tabular-nums">
                ⏱ in {countdownMinutes}m {countdownSeconds}s
              </span>
            </div>
            <span className="text-[11px] text-outline-variant font-mono">
              SEQ #09-HTR
            </span>
          </div>

          <div>
            <h2
              className={`text-[32px] text-on-surface font-light tracking-tight transition-all ${
                isCompleted ? 'line-through text-outline' : ''
              }`}
            >
              {commitment.title}
            </h2>
            <p className="text-[19px] text-secondary font-normal mt-0.5 flex flex-wrap items-center gap-1.5">
              <span>{commitment.time}</span>
              <span className="text-outline-variant mx-1 font-light">•</span>
              <span>{commitment.subtitle || 'Heathrow Terminal 2'}</span>
              {commitment.flightInfo && (
                <span className="text-[12px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-mono ml-1 border border-outline-variant/30">
                  {commitment.flightInfo}
                </span>
              )}
            </p>
          </div>

          <p className="text-[14px] text-on-surface-variant max-w-xl leading-relaxed">
            {commitment.description}
          </p>

          {/* Interactive Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={() => onToggleComplete(commitment.id)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 ${
                isCompleted
                  ? 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container'
                  : 'bg-primary text-on-primary hover:bg-inverse-surface'
              }`}
              type="button"
            >
              <span
                className={`material-symbols-outlined text-[18px] ${
                  isCompleted ? 'text-on-tertiary-container' : 'text-[#b1f1c9]'
                }`}
              >
                {isCompleted ? 'done_all' : 'check_circle'}
              </span>
              <span className="text-[12px] font-medium">
                {isCompleted ? 'Completed' : 'Mark Complete'}
              </span>
            </button>

            <button
              onClick={() => onSnooze(commitment.id, 10)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container border border-outline-variant/20 transition-all active:scale-95"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-outline">
                snooze
              </span>
              <span className="text-[12px] font-medium">Snooze 10m</span>
            </button>

            <button
              onClick={onOpenEscalationModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-on-surface-variant hover:text-secondary transition-colors group cursor-pointer"
              type="button"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                Escalation Ladder
              </span>
              <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </button>
          </div>
        </div>

        {/* Right: Escalation Multi-Stage Preview Indicator */}
        <div className="xl:col-span-5 bg-surface-container-low/70 backdrop-blur rounded-2xl p-5 sm:p-6 flex flex-col gap-4 border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-secondary">
                conversion_path
              </span>
              <span className="text-[11px] uppercase tracking-wider text-on-surface font-semibold">
                Staged Dispatch Chain
              </span>
            </div>
            <span className="text-[11px] text-secondary bg-surface-container-lowest px-2 py-0.5 rounded shadow-xs font-mono border border-secondary/20">
              Stage 2 of 4
            </span>
          </div>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-outline-variant/40">
            {/* Stage 1 */}
            <div className="relative flex flex-col">
              <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-[#54906e] flex items-center justify-center text-white shadow-xs">
                <span className="material-symbols-outlined text-[11px]">check</span>
              </span>
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="text-[11px] font-semibold text-on-surface">
                  6:30 PM Departure Notice
                </span>
                <span className="text-[11px] text-[#54906e] font-mono font-medium">
                  Delivered
                </span>
              </div>
              <p className="text-[12px] text-outline mt-0.5">
                Push confirmation sent to chronometer & auto dock.
              </p>
            </div>

            {/* Stage 2 */}
            <div className="relative flex flex-col">
              <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-surface-container-lowest ring-2 ring-secondary flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              </span>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-on-surface">
                  6:45 PM Transit Checkpoint
                </span>
                <span className="text-[11px] text-secondary font-mono font-medium">
                  In 3m
                </span>
              </div>
              <p className="text-[12px] text-on-surface-variant mt-0.5">
                Live telemetry ping: M4 corridor status check.
              </p>
            </div>

            {/* Stage 3 */}
            <div className="relative flex flex-col opacity-60">
              <span className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-surface-variant flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-outline" />
              </span>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-on-surface">
                  6:55 PM Engine Start / Arrival Prep
                </span>
                <span className="text-[11px] text-outline font-mono">Queued</span>
              </div>
            </div>

            {/* Stage 4 */}
            <div className="relative flex flex-col opacity-40">
              <span className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-surface-variant flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-outline" />
              </span>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-on-surface">
                  7:00 PM Main Terminal Audible Tone
                </span>
                <span className="text-[11px] text-outline font-mono">Queued</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
