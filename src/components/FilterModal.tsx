import React from 'react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  activeFilter,
  setActiveFilter,
}) => {
  if (!isOpen) return null;

  const filters = [
    { id: 'all', label: 'All Commitments', desc: 'Complete timeline sequence' },
    { id: 'pending', label: 'Pending & Armed', desc: 'Upcoming active alert sequences' },
    { id: 'priority', label: 'High Priority Only', desc: 'Critical executive & teleconferences' },
    { id: 'completed', label: 'Completed / Acknowledged', desc: 'Past events marked resolved' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-surface-container-lowest w-full max-w-sm rounded-[24px] shadow-[0_20px_60px_-12px_rgba(26,25,24,0.18)] border border-outline-variant/30 overflow-hidden">
        <div className="p-5 border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-secondary">
              tune
            </span>
            <h3 className="text-[16px] font-semibold text-on-surface">
              Filter & View
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-outline hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-4 space-y-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                setActiveFilter(f.id);
                onClose();
              }}
              className={`w-full p-3 rounded-xl text-left transition-all border flex items-center justify-between ${
                activeFilter === f.id
                  ? 'bg-secondary/10 border-secondary/40 text-on-surface'
                  : 'bg-surface-container-lowest border-outline-variant/20 hover:bg-surface-container-low text-on-surface-variant'
              }`}
            >
              <div>
                <p className="text-[13px] font-medium text-on-surface">{f.label}</p>
                <p className="text-[11px] text-outline mt-0.5">{f.desc}</p>
              </div>
              {activeFilter === f.id && (
                <span className="material-symbols-outlined text-[18px] text-secondary">
                  check
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-outline-variant/20 bg-surface-container-low/40 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-primary text-on-primary text-[12px] font-medium hover:bg-inverse-surface"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
