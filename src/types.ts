export interface DispatchStep {
  time: string;
  title: string;
  status: 'delivered' | 'active' | 'queued';
  countdown?: string;
  description?: string;
}

export interface StagedDispatch {
  stage: number;
  totalStages: number;
  steps: DispatchStep[];
}

export interface Commitment {
  id: string;
  time: string;
  timeRange?: string;
  title: string;
  subtitle?: string;
  description: string;
  tag: string;
  tagType: 'upcoming' | 'priority' | 'deliverable' | 'notice' | 'standard';
  status: 'pending' | 'completed' | 'snoozed';
  location?: string;
  travelBuffer?: string;
  chimeSequence?: string;
  flightInfo?: string;
  flightStatus?: string;
  meetingLink?: string;
  attendees?: string[];
  quorumStatus?: string;
  attachment?: string;
  autoRelease?: string;
  stagedDispatch?: StagedDispatch;
  alarmConfig?: {
    exactAlarmEnabled: boolean;
    crescendoAudio: boolean;
    repeatMinutes: number;
    maxCycles: number;
  };
  targetTimestampEpoch?: number;
}

export type TabType = 'today' | 'upcoming' | 'all-reminders' | 'completed' | 'calendar' | 'android' | 'settings';
export type ViewMode = 'timeline' | 'list' | 'compact';

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
  type: 'alarm' | 'sync' | 'staged';
}
