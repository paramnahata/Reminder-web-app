import React, { useState, useEffect } from 'react';
import { Commitment } from '../types';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  commitments: Commitment[];
  onSelectCommitment: (commitment: Commitment) => void;
}

export const SearchDialog: React.FC<SearchDialogProps> = ({
  isOpen,
  onClose,
  commitments,
  onSelectCommitment,
}) => {
  const [query, setQuery] = useState('');

  // Handle ESC key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = commitments.filter((c) =>
    `${c.title} ${c.description} ${c.time} ${c.location || ''} ${c.tag || ''}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-[24px] shadow-[0_20px_60px_-12px_rgba(26,25,24,0.18)] border border-outline-variant/30 overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-outline-variant/20 flex items-center gap-3">
          <span className="material-symbols-outlined text-[20px] text-secondary">
            search
          </span>
          <input
            type="text"
            autoFocus
            placeholder="Search agenda, vault, teleconferences..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-[15px] bg-transparent text-on-surface focus:outline-hidden"
          />
          <kbd className="text-[11px] font-mono bg-surface-container text-outline px-1.5 py-0.5 rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto divide-y divide-outline-variant/15 p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-outline text-[13px]">
              No commitments matching &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectCommitment(item);
                  onClose();
                }}
                className="p-3 hover:bg-surface-container-low rounded-xl transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-medium text-on-surface">
                      {item.title}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-surface-container text-outline">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-[12px] text-on-surface-variant line-clamp-1 mt-0.5">
                    {item.description}
                  </p>
                </div>
                <span className="text-[12px] font-mono text-secondary shrink-0 ml-3">
                  {item.time}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
