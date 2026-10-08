import React, { useState } from 'react';
import { Commitment } from '../types';

interface NewCommitmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCommitment: (commitment: Partial<Commitment>) => void;
}

export const NewCommitmentModal: React.FC<NewCommitmentModalProps> = ({
  isOpen,
  onClose,
  onAddCommitment,
}) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('08:00 PM');
  const [description, setDescription] = useState('');
  const [tagType, setTagType] = useState<Commitment['tagType']>('upcoming');
  const [location, setLocation] = useState('');
  const [flightInfo, setFlightInfo] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let tagLabel = 'UPCOMING';
    if (tagType === 'priority') tagLabel = 'HIGH PRIORITY';
    if (tagType === 'deliverable') tagLabel = 'SCHEDULED DELIVERABLE';
    if (tagType === 'notice') tagLabel = 'NOTICE';

    onAddCommitment({
      title: title.trim(),
      time,
      description: description.trim(),
      tag: tagLabel,
      tagType,
      location: location.trim() || undefined,
      flightInfo: flightInfo.trim() || undefined,
    });

    setTitle('');
    setDescription('');
    setLocation('');
    setFlightInfo('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-[28px] shadow-[0_20px_60px_-12px_rgba(26,25,24,0.18)] border border-outline-variant/30 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-outline-variant/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-secondary">
                add_circle
              </span>
              <h3 className="text-[18px] font-semibold text-on-surface">
                New Commitment
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-outline mb-1.5">
                Commitment Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Private Salon Viewing, Board Review..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-[14px] focus:outline-hidden focus:border-secondary transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-outline mb-1.5">
                  Scheduled Time
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 7:30 PM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-[14px] focus:outline-hidden focus:border-secondary transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-outline mb-1.5">
                  Classification
                </label>
                <select
                  value={tagType}
                  onChange={(e) => setTagType(e.target.value as Commitment['tagType'])}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-[14px] focus:outline-hidden focus:border-secondary transition-all"
                >
                  <option value="upcoming">Upcoming Normal</option>
                  <option value="priority">High Priority</option>
                  <option value="deliverable">Scheduled Deliverable</option>
                  <option value="notice">Notice</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-outline mb-1.5">
                Description / Dispatch Notes
              </label>
              <textarea
                rows={3}
                placeholder="Transit route buffers, attendee briefings, security codes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-[14px] focus:outline-hidden focus:border-secondary transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-outline mb-1.5">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. The Battery, Salon Room"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-[14px] focus:outline-hidden focus:border-secondary transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-outline mb-1.5">
                  Flight / Ref ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Flight BA 178"
                  value={flightInfo}
                  onChange={(e) => setFlightInfo(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-[14px] focus:outline-hidden focus:border-secondary transition-all font-mono"
                />
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-outline-variant/20 bg-surface-container-low/40 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface text-[12px] font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary text-on-primary hover:bg-inverse-surface text-[12px] font-medium transition-all shadow-xs"
            >
              Arm Commitment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
