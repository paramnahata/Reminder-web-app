import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const PORT = 3000;

app.use(express.json());

// In-memory persistent data store with default chronology
export interface Commitment {
  id: string;
  time: string; // e.g. "7:00 PM"
  timeRange?: string; // e.g. "8:00 PM — 8:45 PM"
  title: string;
  subtitle?: string;
  description: string;
  tag: string; // e.g. "MAIN ARRIVAL • UPCOMING", "HIGH PRIORITY", "SCHEDULED DELIVERABLE", "30 MIN NOTICE"
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
  stagedDispatch?: {
    stage: number;
    totalStages: number;
    steps: {
      time: string;
      title: string;
      status: 'delivered' | 'active' | 'queued';
      countdown?: string;
      description?: string;
    }[];
  };
  alarmConfig?: {
    exactAlarmEnabled: boolean;
    crescendoAudio: boolean;
    repeatMinutes: number;
    maxCycles: number;
  };
  targetTimestampEpoch?: number;
}

// Initial commitments matching the design specification
let commitments: Commitment[] = [
  {
    id: 'comm-1',
    time: '6:30 PM',
    title: 'Pick Sister — Depart Flat',
    description: 'Autonomous vehicle preconditioned & key fob ready. Departure lane reserved.',
    tag: '30 MIN NOTICE',
    tagType: 'notice',
    status: 'completed',
    stagedDispatch: {
      stage: 1,
      totalStages: 4,
      steps: [
        { time: '6:30 PM', title: 'Departure Notice', status: 'delivered', description: 'Push confirmation sent to chronometer & auto dock.' },
        { time: '6:45 PM', title: 'Transit Checkpoint', status: 'queued' },
        { time: '6:55 PM', title: 'Engine Start / Arrival Prep', status: 'queued' },
        { time: '7:00 PM', title: 'Main Terminal Audible Tone', status: 'queued' },
      ],
    },
    alarmConfig: {
      exactAlarmEnabled: true,
      crescendoAudio: true,
      repeatMinutes: 15,
      maxCycles: 3,
    },
  },
  {
    id: 'comm-2',
    time: '7:00 PM',
    title: 'Pick Sister — Main Arrival',
    subtitle: 'Heathrow Terminal 2',
    description: 'Flight Status: On Time • Gate 54B, Baggage Hall B. Curbside rendezvous point at Level 1 Short Stay.',
    tag: 'MAIN ARRIVAL • UPCOMING',
    tagType: 'upcoming',
    status: 'pending',
    flightInfo: 'Flight BA 178',
    flightStatus: 'Flight BA 178 Status: On Time',
    location: 'Heathrow T2 (Pick Up B)',
    travelBuffer: '24m drive from flat',
    chimeSequence: 'Loud Chime Sequence',
    stagedDispatch: {
      stage: 2,
      totalStages: 4,
      steps: [
        { time: '6:30 PM', title: 'Departure Notice', status: 'delivered', description: 'Push confirmation sent to chronometer & auto dock.' },
        { time: '6:45 PM', title: 'Transit Checkpoint', status: 'active', countdown: 'In 3m', description: 'Live telemetry ping: M4 corridor status check.' },
        { time: '6:55 PM', title: 'Engine Start / Arrival Prep', status: 'queued' },
        { time: '7:00 PM', title: 'Main Terminal Audible Tone', status: 'queued' },
      ],
    },
    alarmConfig: {
      exactAlarmEnabled: true,
      crescendoAudio: true,
      repeatMinutes: 15,
      maxCycles: 3,
    },
  },
  {
    id: 'comm-3',
    time: '8:00 PM',
    timeRange: '8:00 PM — 8:45 PM',
    title: 'Call XYZ Portfolio',
    description: 'Quarterly risk allocation & mandate rebalancing review with Charles Vance. Discussion of private placement memorandum.',
    tag: 'HIGH PRIORITY',
    tagType: 'priority',
    status: 'pending',
    subtitle: 'Encrypted Teleconference',
    meetingLink: 'https://briefing.kallos.horology/room-xyz',
    attendees: ['CV', 'JV', '+2'],
    quorumStatus: 'Executive Quorum Verified',
    alarmConfig: {
      exactAlarmEnabled: true,
      crescendoAudio: true,
      repeatMinutes: 10,
      maxCycles: 4,
    },
  },
  {
    id: 'comm-4',
    time: '9:30 PM',
    title: 'Submit Executive Memo',
    description: 'Consolidate Asia-Pacific weekly metrics for Board distribution • 4 attachments ready in Drafts. Automatic dispatch scheduled upon confirmation.',
    tag: 'SCHEDULED DELIVERABLE',
    tagType: 'deliverable',
    status: 'pending',
    subtitle: 'Vault Stored',
    attachment: 'AP_Q3_Recap_v4.pdf',
    autoRelease: '21:30 GMT Auto-release',
    alarmConfig: {
      exactAlarmEnabled: true,
      crescendoAudio: true,
      repeatMinutes: 15,
      maxCycles: 2,
    },
  },
];

// Active SSE client connections for real-time synchronization across devices
type SSEClient = {
  id: string;
  res: express.Response;
};
let sseClients: SSEClient[] = [];

function broadcastSync(event: string, data: unknown) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.res.write(payload);
    } catch {
      // client connection closed
    }
  });
}

// REST Endpoints
app.get('/api/commitments', (_req, res) => {
  res.json({
    success: true,
    data: commitments,
    lastSyncTimestamp: Date.now(),
    deviceCount: Math.max(1, sseClients.length + 1),
  });
});

app.post('/api/commitments', (req, res) => {
  const newCommitment: Commitment = {
    id: `comm-${Date.now()}`,
    time: req.body.time || '12:00 PM',
    timeRange: req.body.timeRange,
    title: req.body.title || 'Untitled Commitment',
    subtitle: req.body.subtitle,
    description: req.body.description || '',
    tag: req.body.tag || 'UPCOMING',
    tagType: req.body.tagType || 'upcoming',
    status: 'pending',
    location: req.body.location,
    flightInfo: req.body.flightInfo,
    flightStatus: req.body.flightStatus,
    attachment: req.body.attachment,
    stagedDispatch: req.body.stagedDispatch || {
      stage: 1,
      totalStages: 3,
      steps: [
        { time: req.body.time || '12:00 PM', title: 'Schedule Triggered', status: 'delivered' },
        { time: 'Checkpoint', title: 'Telemetry Ping', status: 'queued' },
        { time: 'Final', title: 'Audible Chime Alarm', status: 'queued' }
      ]
    },
    alarmConfig: {
      exactAlarmEnabled: true,
      crescendoAudio: true,
      repeatMinutes: req.body.repeatMinutes || 15,
      maxCycles: req.body.maxCycles || 3,
    },
  };

  commitments.push(newCommitment);
  broadcastSync('commitment:created', newCommitment);
  res.status(201).json({ success: true, data: newCommitment });
});

app.put('/api/commitments/:id', (req, res) => {
  const { id } = req.params;
  const index = commitments.findIndex((c) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Commitment not found' });
  }

  commitments[index] = { ...commitments[index], ...req.body };
  broadcastSync('commitment:updated', commitments[index]);
  res.json({ success: true, data: commitments[index] });
});

app.patch('/api/commitments/:id/toggle', (req, res) => {
  const { id } = req.params;
  const item = commitments.find((c) => c.id === id);
  if (!item) {
    return res.status(404).json({ success: false, error: 'Commitment not found' });
  }

  item.status = item.status === 'completed' ? 'pending' : 'completed';
  broadcastSync('commitment:updated', item);
  res.json({ success: true, data: item });
});

app.post('/api/commitments/:id/snooze', (req, res) => {
  const { id } = req.params;
  const minutes = req.body.minutes || 10;
  const item = commitments.find((c) => c.id === id);
  if (!item) {
    return res.status(404).json({ success: false, error: 'Commitment not found' });
  }

  item.status = 'snoozed';
  broadcastSync('commitment:snoozed', { id, minutes, item });
  res.json({ success: true, data: item, snoozedMinutes: minutes });
});

app.delete('/api/commitments/:id', (req, res) => {
  const { id } = req.params;
  commitments = commitments.filter((c) => c.id !== id);
  broadcastSync('commitment:deleted', { id });
  res.json({ success: true, id });
});

// Real-Time Server-Sent Events (SSE) Stream
app.get('/api/sync/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const clientId = `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const client: SSEClient = { id: clientId, res };
  sseClients.push(client);

  // Send initial handshake
  res.write(`event: handshake\ndata: ${JSON.stringify({ status: 'connected', clientId, timestamp: Date.now() })}\n\n`);

  req.on('close', () => {
    sseClients = sseClients.filter((c) => c.id !== clientId);
  });
});

// Push notification dispatch endpoint
app.post('/api/notifications/dispatch', (req, res) => {
  const { title, body, priority, sound } = req.body;
  const notificationPayload = {
    id: `notif-${Date.now()}`,
    title: title || 'Kallos Dispatch Notice',
    body: body || 'Timely horological alert triggered.',
    priority: priority || 'high',
    sound: sound || 'celestia_crescendo',
    timestamp: Date.now(),
  };

  broadcastSync('notification:push', notificationPayload);
  res.json({ success: true, sent: notificationPayload });
});

// Android configuration and alarm diagnostics API
app.get('/api/android/alarm-config', (_req, res) => {
  res.json({
    platform: 'Android 14+ / SDK 34',
    packageName: 'com.kallos.chronology',
    alarmPermissions: [
      {
        permission: 'android.permission.SCHEDULE_EXACT_ALARM',
        status: 'GRANTED',
        description: 'Required on Android 12+ (API 31+) for user-visible alarm clock execution.',
      },
      {
        permission: 'android.permission.USE_EXACT_ALARM',
        status: 'GRANTED',
        description: 'Designated permission for clocks/alarms avoiding background battery throttling.',
      },
      {
        permission: 'android.permission.POST_NOTIFICATIONS',
        status: 'GRANTED',
        description: 'Permits high-priority heads-up notifications with full-screen intents.',
      },
      {
        permission: 'android.permission.WAKE_LOCK',
        status: 'ACTIVE',
        description: 'Guarantees execution while device CPU is in deep Doze sleep.',
      },
      {
        permission: 'android.permission.RECEIVE_BOOT_COMPLETED',
        status: 'ACTIVE',
        description: 'Automatically restores exact chronometer schedules across device reboots.',
      },
    ],
    audioProfiles: [
      { id: 'celestia', name: 'Celestia Gradual Crescendo', durationSec: 15, ambientDecibelTarget: 42 },
      { id: 'chime_sequence', name: 'Loud Chime Sequence', durationSec: 8, ambientDecibelTarget: 68 },
    ],
  });
});

// In development, hook up Vite middleware; in production serve dist
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Kallos Chronology running at http://0.0.0.0:${PORT}`);
  });
}

start();
