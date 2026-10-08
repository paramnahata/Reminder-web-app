import React from 'react';

interface UpcomingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpcomingModal: React.FC<UpcomingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const horizonEvents = [
    {
      date: 'Tomorrow, Oct 10 • 08:30 AM',
      title: 'Private Breakfast with Zurich Team',
      location: 'The Battery, Salon Room',
      category: 'Executive Meeting',
      attendees: 'Marc G., Julian V., Beatrix H.',
    },
    {
      date: 'Tomorrow, Oct 10 • 02:00 PM',
      title: 'Architectural Review — Presidio Heights',
      location: 'With Studio KDA & Lead Contractor',
      category: 'Design Verification',
      attendees: 'KDA Partners, Chief Surveyor',
    },
    {
      date: 'Tomorrow, Oct 10 • 06:00 PM',
      title: 'Gallery Vernissage & Acquisition',
      location: 'Mayfair Gallery Private Salon',
      category: 'Horology & Arts',
      attendees: 'Curator & Private Collectors',
    },
    {
      date: 'Saturday, Oct 11 • 11:00 AM',
      title: 'Global Horology Synod Video Keynote',
      location: 'Geneva / Virtual Secure Terminal',
      category: 'Keynote Dispatch',
      attendees: 'Synod Assembly',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-[28px] shadow-[0_20px_60px_-12px_rgba(26,25,24,0.18)] border border-outline-variant/30 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[20px] text-secondary">
              next_week
            </span>
            <h3 className="text-[18px] font-semibold text-on-surface">
              Upcoming Horizon
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {horizonEvents.map((ev, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-surface-container-low/50 border border-outline-variant/20 space-y-1"
            >
              <span className="text-[11px] font-mono uppercase tracking-wider text-outline block">
                {ev.date}
              </span>
              <h4 className="text-[15px] font-medium text-on-surface">
                {ev.title}
              </h4>
              <p className="text-[13px] text-on-surface-variant flex items-center gap-1.5 pt-1">
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  location_on
                </span>
                {ev.location}
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-outline border-t border-outline-variant/15 mt-2">
                <span>{ev.category}</span>
                <span className="font-mono">{ev.attendees}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-outline-variant/20 bg-surface-container-low/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-primary text-on-primary text-[12px] font-medium hover:bg-inverse-surface"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
