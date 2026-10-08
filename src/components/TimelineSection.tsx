import React from 'react';
import { Commitment, ViewMode } from '../types';
import { chimeSynthesizer } from '../utils/audio';

interface TimelineSectionProps {
  commitments: Commitment[];
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onToggleComplete: (id: string) => void;
  onOpenDetails: (commitment: Commitment) => void;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({
  commitments,
  viewMode,
  setViewMode,
  onToggleComplete,
  onOpenDetails,
}) => {
  return (
    <section className="flex flex-col gap-6">
      {/* Section Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-[19px] font-normal text-on-surface">
            Today's Chronology
          </h3>
          <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant border border-outline-variant/30">
            {commitments.length} events total
          </span>
        </div>

        {/* View mode toggle switch */}
        <div className="inline-flex p-0.5 bg-surface-container-low rounded-xl border border-outline-variant/30 self-start sm:self-auto">
          {(['timeline', 'list', 'compact'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 text-[11px] font-medium capitalize rounded-lg transition-all ${
                viewMode === mode
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs font-semibold'
                  : 'text-outline hover:text-on-surface'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Render based on ViewMode */}
      {viewMode === 'compact' ? (
        <div className="divide-y divide-outline-variant/20 bg-surface-container-lowest rounded-2xl p-2 border border-outline-variant/20 shadow-xs">
          {commitments.map((item) => (
            <div
              key={item.id}
              className="p-3 flex items-center justify-between hover:bg-surface-container-low/60 rounded-xl transition-colors cursor-pointer"
              onClick={() => onOpenDetails(item)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleComplete(item.id);
                  }}
                  className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                    item.status === 'completed'
                      ? 'bg-[#54906e] border-[#54906e] text-white'
                      : 'border-outline-variant hover:border-secondary'
                  }`}
                >
                  {item.status === 'completed' && (
                    <span className="material-symbols-outlined text-[13px]">check</span>
                  )}
                </button>
                <span className="text-[13px] font-mono text-outline shrink-0">
                  {item.time}
                </span>
                <span
                  className={`text-[14px] font-medium truncate ${
                    item.status === 'completed'
                      ? 'line-through text-outline'
                      : 'text-on-surface'
                  }`}
                >
                  {item.title}
                </span>
              </div>
              <span className="text-[11px] uppercase tracking-wider text-outline px-2 py-0.5 rounded bg-surface-container shrink-0">
                {item.tag}
              </span>
            </div>
          ))}
        </div>
      ) : (
        /* Vertical Continuous Timeline Rail */
        <div className="relative pl-8 sm:pl-10 space-y-6 before:absolute before:left-3 sm:before:left-3.5 before:top-4 before:bottom-4 before:w-[1px] before:bg-outline-variant/40">
          {commitments.map((item, idx) => {
            const isCompleted = item.status === 'completed';
            const isHighlighted = item.tagType === 'upcoming' && !isCompleted;

            return (
              <article key={item.id} className="relative group">
                {/* Node on the vertical rail */}
                {isCompleted ? (
                  <span className="absolute -left-8 sm:-left-10 top-5 w-7 h-7 rounded-full bg-surface-container-lowest shadow-xs flex items-center justify-center text-[#54906e] ring-1 ring-outline-variant/40">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </span>
                ) : isHighlighted ? (
                  <span className="absolute -left-8 sm:-left-10 top-6 w-7 h-7 rounded-full bg-secondary text-white shadow-md flex items-center justify-center ring-4 ring-surface">
                    <span className="w-2 h-2 rounded-full bg-surface-container-lowest" />
                  </span>
                ) : (
                  <span className="absolute -left-8 sm:-left-10 top-6 w-7 h-7 rounded-full bg-surface-container-lowest shadow-xs flex items-center justify-center text-outline ring-1 ring-outline-variant/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  </span>
                )}

                {/* Event Card */}
                <div
                  className={`p-5 sm:p-6 rounded-[22px] bg-surface-container-lowest transition-all border ${
                    isHighlighted
                      ? 'shadow-[0_4px_20px_-2px_rgba(26,25,24,0.04)] ring-1 ring-secondary/30 border-secondary/20'
                      : 'shadow-[0_1px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.03)] border-outline-variant/20'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span
                        className={`text-[18px] tracking-tight font-light ${
                          isHighlighted ? 'text-secondary font-medium' : 'text-on-surface'
                        }`}
                      >
                        {item.timeRange || item.time}
                      </span>

                      {/* Tag pill */}
                      {item.tagType === 'upcoming' ? (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-secondary-container/50 text-on-secondary-container uppercase tracking-wider">
                          {item.tag}
                        </span>
                      ) : item.tagType === 'priority' ? (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-error-container/60 text-on-error-container uppercase tracking-wider">
                          {item.tag}
                        </span>
                      ) : (
                        <span className="text-[11px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant uppercase tracking-wider">
                          {item.tag}
                        </span>
                      )}
                    </div>

                    {/* Secondary metadata indicator */}
                    {isCompleted ? (
                      <div className="inline-flex items-center gap-1.5 text-[#54906e] text-[11px] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#54906e]" />
                        <span>Alert Delivered & Acknowledged</span>
                      </div>
                    ) : item.flightStatus ? (
                      <span className="text-[11px] text-secondary font-mono">
                        {item.flightStatus}
                      </span>
                    ) : item.subtitle ? (
                      <span className="text-[11px] text-outline font-mono">
                        {item.subtitle}
                      </span>
                    ) : null}
                  </div>

                  {/* Title & Action Row */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mt-1">
                    <div className="flex-1">
                      <h4
                        className={`text-[19px] font-normal text-on-surface ${
                          isCompleted ? 'line-through text-on-surface-variant' : ''
                        }`}
                      >
                        {item.title}
                      </h4>
                      <p className="text-[14px] text-on-surface-variant mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Action button based on type */}
                    <div className="shrink-0 flex items-center gap-2">
                      {item.meetingLink ? (
                        <a
                          href={item.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary hover:bg-inverse-surface transition-all shadow-xs text-[12px] font-medium"
                        >
                          <span className="material-symbols-outlined text-[16px] text-secondary-fixed">
                            video_call
                          </span>
                          <span>Join Briefing</span>
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onToggleComplete(item.id)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-medium transition-all ${
                            isCompleted
                              ? 'bg-surface-container-highest text-outline'
                              : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                          }`}
                        >
                          <span
                            className={`material-symbols-outlined text-[16px] ${
                              isCompleted ? 'text-[#54906e]' : 'text-secondary'
                            }`}
                          >
                            check
                          </span>
                          <span>{isCompleted ? 'Resolved' : 'Mark Complete'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Metadata Chips / Sub-bar */}
                  {item.location && (
                    <div className="mt-4 pt-2 flex flex-wrap items-center gap-4 text-outline text-[11px] bg-surface-container-low/50 rounded-xl p-3 border border-outline-variant/20">
                      <span className="flex items-center gap-1 text-on-surface-variant font-medium">
                        <span className="material-symbols-outlined text-[16px] text-secondary">
                          location_on
                        </span>
                        {item.location}
                      </span>
                      {item.travelBuffer && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">
                            navigation
                          </span>
                          {item.travelBuffer}
                        </span>
                      )}
                      {item.chimeSequence && (
                        <button
                          type="button"
                          onClick={() => chimeSynthesizer.playLoudChime()}
                          className="flex items-center gap-1 hover:text-secondary transition-colors cursor-pointer"
                          title="Preview loud chime sequence"
                        >
                          <span className="material-symbols-outlined text-[16px] text-secondary">
                            notifications_active
                          </span>
                          <span>{item.chimeSequence}</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Attendees for briefing */}
                  {item.attendees && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex -space-x-1.5">
                        {item.attendees.map((att, i) => (
                          <div
                            key={i}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium border border-surface-container-lowest ${
                              att === '+2'
                                ? 'bg-secondary-container text-on-secondary-container'
                                : 'bg-surface-container-highest text-on-surface-variant'
                            }`}
                          >
                            {att}
                          </div>
                        ))}
                      </div>
                      {item.quorumStatus && (
                        <span className="text-[11px] text-outline">
                          {item.quorumStatus}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Attachments for Deliverables */}
                  {item.attachment && (
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-outline text-[11px]">
                      <span className="flex items-center gap-1 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[15px] text-outline">
                          attachment
                        </span>
                        {item.attachment}
                      </span>
                      {item.autoRelease && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px] text-outline">
                            schedule_send
                          </span>
                          {item.autoRelease}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
