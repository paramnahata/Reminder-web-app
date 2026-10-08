import { useState, useEffect, useCallback, useRef } from 'react';
import { Commitment, NotificationItem } from '../types';
import { triggerTaskNotification } from '../utils/notifications';
import { chimeSynthesizer } from '../utils/audio';

const STORAGE_KEY = 'kallos_chronology_commitments';

export function useChronologySync() {
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [isSynchronized, setIsSynchronized] = useState(true);
  const [syncLatencyMs, setSyncLatencyMs] = useState(400); // 0.4s default
  const [deviceCount, setDeviceCount] = useState(3);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Initial fetch from backend
  const fetchCommitments = useCallback(async () => {
    const startTime = performance.now();
    try {
      const res = await fetch('/api/commitments');
      if (res.ok) {
        const json = await res.json();
        const latency = Math.round(performance.now() - startTime);
        setSyncLatencyMs(latency || 400);
        setCommitments(json.data);
        setDeviceCount(json.deviceCount || 3);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(json.data));
        } catch {
          // localStorage full or disabled
        }
      }
    } catch {
      // Offline fallback
      setIsSynchronized(false);
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          setCommitments(JSON.parse(cached));
        }
      } catch {
        // ignore
      }
    }
  }, []);

  // Connect SSE for real-time synchronization across browser tabs and Android devices
  useEffect(() => {
    fetchCommitments();

    // Check if EventSource is available
    if (typeof EventSource !== 'undefined') {
      const es = new EventSource('/api/sync/stream');
      eventSourceRef.current = es;

      es.onopen = () => {
        setIsSynchronized(true);
      };

      es.addEventListener('commitment:created', (e) => {
        try {
          const item: Commitment = JSON.parse(e.data);
          setCommitments((prev) => {
            if (prev.some((c) => c.id === item.id)) return prev;
            return [...prev, item];
          });
        } catch {
          // ignore
        }
      });

      es.addEventListener('commitment:updated', (e) => {
        try {
          const item: Commitment = JSON.parse(e.data);
          setCommitments((prev) => prev.map((c) => (c.id === item.id ? item : c)));
        } catch {
          // ignore
        }
      });

      es.addEventListener('commitment:snoozed', (e) => {
        try {
          const data = JSON.parse(e.data);
          setCommitments((prev) => prev.map((c) => (c.id === data.id ? data.item : c)));
          addNotification(`Commitment Snoozed: ${data.item?.title}`, `Snoozed for ${data.minutes} minutes`, 'staged');
        } catch {
          // ignore
        }
      });

      es.addEventListener('commitment:deleted', (e) => {
        try {
          const { id } = JSON.parse(e.data);
          setCommitments((prev) => prev.filter((c) => c.id !== id));
        } catch {
          // ignore
        }
      });

      es.addEventListener('notification:push', (e) => {
        try {
          const payload = JSON.parse(e.data);
          triggerTaskNotification(payload.title, payload.body, payload.sound === 'celestia_crescendo' ? 'celestia' : 'chime');
          addNotification(payload.title, payload.body, 'alarm');
        } catch {
          // ignore
        }
      });

      es.onerror = () => {
        setIsSynchronized(false);
      };

      return () => {
        es.close();
      };
    }
  }, [fetchCommitments]);

  const addNotification = useCallback((title: string, body: string, type: 'alarm' | 'sync' | 'staged' = 'alarm') => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random()}`,
      title,
      body,
      timestamp: Date.now(),
      read: false,
      type,
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 19)]);
  }, []);

  const toggleCommitment = useCallback(async (id: string) => {
    chimeSynthesizer.playAcknowledgeTone();
    // Optimistic update
    setCommitments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newStatus = c.status === 'completed' ? 'pending' : 'completed';
          return { ...c, status: newStatus };
        }
        return c;
      })
    );

    try {
      const res = await fetch(`/api/commitments/${id}/toggle`, { method: 'PATCH' });
      if (res.ok) {
        const json = await res.json();
        setCommitments((prev) => prev.map((c) => (c.id === id ? json.data : c)));
      }
    } catch {
      // rollback or retry
    }
  }, []);

  const snoozeCommitment = useCallback(async (id: string, minutes: number = 10) => {
    chimeSynthesizer.playAcknowledgeTone();
    // Optimistic
    setCommitments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'snoozed' } : c))
    );

    try {
      const res = await fetch(`/api/commitments/${id}/snooze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ minutes }),
      });
      if (res.ok) {
        const json = await res.json();
        setCommitments((prev) => prev.map((c) => (c.id === id ? json.data : c)));
        addNotification('Snooze Armed', `Next reminder will ring in ${minutes} minutes.`, 'staged');
      }
    } catch {
      // rollback or retry
    }
  }, [addNotification]);

  const addCommitment = useCallback(async (data: Partial<Commitment>) => {
    try {
      const res = await fetch('/api/commitments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        setCommitments((prev) => [...prev, json.data]);
        chimeSynthesizer.playAcknowledgeTone();
        addNotification('New Commitment Armed', `${json.data.title} scheduled for ${json.data.time}.`, 'staged');
        return json.data;
      }
    } catch (e) {
      console.error(e);
    }
  }, [addNotification]);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  return {
    commitments,
    isSynchronized,
    syncLatencyMs,
    deviceCount,
    notifications,
    toggleCommitment,
    snoozeCommitment,
    addCommitment,
    markAllNotificationsRead,
    addNotification,
  };
}
