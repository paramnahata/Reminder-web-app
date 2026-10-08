import React, { useState } from 'react';
import { Commitment } from '../types';
import { chimeSynthesizer } from '../utils/audio';
import { triggerTaskNotification } from '../utils/notifications';

interface EscalationLadderModalProps {
  isOpen: boolean;
  onClose: () => void;
  commitment: Commitment;
}

export const EscalationLadderModal: React.FC<EscalationLadderModalProps> = ({
  isOpen,
  onClose,
  commitment,
}) => {
  const [currentStage, setCurrentStage] = useState(2);

  if (!isOpen) return null;

  const handleAdvanceStage = () => {
    const next = currentStage < 4 ? currentStage + 1 : 1;
    setCurrentStage(next);
    if (next === 4) {
      triggerTaskNotification(
        'Terminal Audible Tone Triggered',
        'Stage 4 executed: Main terminal rendezvous arrived.',
        'chime'
      );
    } else {
      chimeSynthesizer.playAcknowledgeTone();
    }
  };

  const steps = [
    {
      num: 1,
      time: '6:30 PM',
      title: 'Departure Notice',
      status: currentStage >= 1 ? 'Delivered' : 'Queued',
      detail: 'Push confirmation sent to chronometer & auto dock. Pre-heat cabin enabled.',
    },
    {
      num: 2,
      time: '6:45 PM',
      title: 'Transit Checkpoint',
      status: currentStage >= 2 ? (currentStage === 2 ? 'Active (In 3m)' : 'Delivered') : 'Queued',
      detail: 'Live telemetry ping: M4 corridor status check. Route clear, 24m flow.',
    },
    {
      num: 3,
      time: '6:55 PM',
      title: 'Engine Start / Arrival Prep',
      status: currentStage >= 3 ? (currentStage === 3 ? 'Active' : 'Delivered') : 'Queued',
      detail: 'Curbside rendezvous point confirmed at Level 1 Short Stay. Luggage trolley reserved.',
    },
    {
      num: 4,
      time: '7:00 PM',
      title: 'Main Terminal Audible Tone',
      status: currentStage >= 4 ? 'Delivered' : 'Queued',
      detail: 'Celestia Gradual Crescendo tone dispatched across Android & Web synchronization.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-[28px] shadow-[0_20px_60px_-12px_rgba(26,25,24,0.18)] border border-outline-variant/30 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[20px] text-secondary">
              conversion_path
            </span>
            <div>
              <h3 className="text-[17px] font-semibold text-on-surface">
                Escalation Ladder
              </h3>
              <p className="text-[12px] text-on-surface-variant font-mono">
                {commitment.title} • Stage {currentStage} of 4
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Staged Chain List */}
        <div className="p-6 space-y-6">
          <p className="text-[13px] text-on-surface-variant leading-relaxed">
            Multi-stage progressive escalation ensures critical temporal checkpoints are
            acknowledged prior to terminal deadlines.
          </p>

          <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-outline-variant/40">
            {steps.map((step) => {
              const isPastOrCurrent = currentStage >= step.num;
              const isCurrent = currentStage === step.num;

              return (
                <div key={step.num} className="relative flex flex-col">
                  {step.status === 'Delivered' ? (
                    <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-[#54906e] flex items-center justify-center text-white shadow-xs">
                      <span className="material-symbols-outlined text-[11px]">check</span>
                    </span>
                  ) : isCurrent ? (
                    <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-surface-container-lowest ring-2 ring-secondary flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    </span>
                  ) : (
                    <span className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-surface-variant flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-outline" />
                    </span>
                  )}

                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[12px] font-semibold ${
                        isPastOrCurrent ? 'text-on-surface' : 'text-outline'
                      }`}
                    >
                      {step.time} {step.title}
                    </span>
                    <span
                      className={`text-[11px] font-mono ${
                        step.status === 'Delivered'
                          ? 'text-[#54906e] font-medium'
                          : isCurrent
                          ? 'text-secondary font-medium'
                          : 'text-outline'
                      }`}
                    >
                      {step.status}
                    </span>
                  </div>

                  <p className="text-[12px] text-on-surface-variant mt-0.5">
                    {step.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-outline-variant/20 bg-surface-container-low/40 flex items-center justify-between">
          <button
            onClick={() => chimeSynthesizer.playCelestiaCrescendo()}
            className="text-[12px] text-secondary font-medium hover:underline inline-flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[15px]">volume_up</span>
            Preview Tone
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAdvanceStage}
              className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-[12px] font-medium transition-all"
            >
              Advance Stage ({currentStage}/4)
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-primary text-on-primary text-[12px] font-medium hover:bg-inverse-surface transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
