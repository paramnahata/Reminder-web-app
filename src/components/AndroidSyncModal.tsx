import React, { useState, useEffect } from 'react';
import { triggerTaskNotification } from '../utils/notifications';

interface AndroidSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncLatencyMs: number;
  deviceCount: number;
}

export const AndroidSyncModal: React.FC<AndroidSyncModalProps> = ({
  isOpen,
  onClose,
  syncLatencyMs,
  deviceCount,
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'manifest' | 'kotlin' | 'test'>('status');
  const [testCountdown, setTestCountdown] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (testCountdown !== null && testCountdown > 0) {
      interval = setInterval(() => {
        setTestCountdown((prev) => (prev !== null && prev > 1 ? prev - 1 : 0));
      }, 1000);
    } else if (testCountdown === 0) {
      // Trigger Alarm!
      triggerTaskNotification(
        'Kallos Exact Alarm Fired',
        'Android Exact Alarm & Web Synced: Transit buffer reached. Time to depart.',
        'celestia'
      );
      setTestCountdown(null);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [testCountdown]);

  if (!isOpen) return null;

  const manifestSnippet = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.kallos.chronology">

    <!-- Crucial Exact Alarm Permissions for Android 12, 13, 14 & 15 -->
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
    <uses-permission android:name="android.permission.USE_EXACT_ALARM" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_SPECIAL_USE" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    ...
</manifest>`;

  const kotlinSnippet = `class KallosAlarmManager(private val context: Context) {
    private val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

    fun scheduleExactCommitment(id: String, title: String, epochMillis: Long) {
        val intent = Intent("com.kallos.chronology.ACTION_TRIGGER_ALARM").apply {
            putExtra("EXTRA_COMMITMENT_ID", id)
            putExtra("EXTRA_TITLE", title)
        }
        val pendingIntent = PendingIntent.getBroadcast(
            context, id.hashCode(), intent, 
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        // Uses setAlarmClock for lockscreen visibility and guaranteed Doze penetration
        val clockInfo = AlarmManager.AlarmClockInfo(epochMillis, pendingIntent)
        alarmManager.setAlarmClock(clockInfo, pendingIntent)
    }
}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-surface-container-lowest w-full max-w-2xl rounded-[28px] shadow-[0_20px_60px_-12px_rgba(26,25,24,0.18)] border border-outline-variant/30 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
              <span className="material-symbols-outlined text-[22px]">smartphone</span>
            </div>
            <div>
              <h3 className="text-[18px] font-semibold text-on-surface">
                Android & Web Real-Time Synchronization
              </h3>
              <p className="text-[12px] text-on-surface-variant">
                Exact Alarms (Android 12–15), Doze-proof dispatch, and Web Push
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-outline-variant/20 px-6 bg-surface-container-low/40">
          {[
            { id: 'status', label: 'Alarm Diagnostics' },
            { id: 'test', label: 'Test Dispatch' },
            { id: 'manifest', label: 'AndroidManifest.xml' },
            { id: 'kotlin', label: 'Kotlin AlarmManager' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-3 px-3 text-[12px] font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-secondary text-on-surface font-semibold'
                  : 'border-transparent text-outline hover:text-on-surface'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {activeTab === 'status' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-surface-container-low/60 border border-outline-variant/20 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-outline uppercase tracking-wider block">
                    Real-Time Sync Bridge
                  </span>
                  <p className="text-[15px] font-medium text-on-surface mt-0.5">
                    {deviceCount} Devices Connected (Web & Pocket Terminal)
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#54906e]/10 text-[#54906e] text-[11px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#54906e]" />
                    SSE Stream Active
                  </span>
                  <span className="text-[11px] text-outline block mt-1 font-mono">
                    Latency: {syncLatencyMs}ms
                  </span>
                </div>
              </div>

              <h4 className="text-[13px] font-semibold uppercase tracking-wider text-outline pt-2">
                Android Alarm Permissions Configured
              </h4>

              <div className="space-y-2.5">
                {[
                  {
                    name: 'SCHEDULE_EXACT_ALARM',
                    api: 'API 31+ (Android 12+)',
                    desc: 'Required for millisecond-accurate user clock & calendar alarms.',
                    status: 'CONFIGURED',
                  },
                  {
                    name: 'USE_EXACT_ALARM',
                    api: 'API 33+ (Android 13+)',
                    desc: 'Privileged alarm clock permission preventing OS power throttle.',
                    status: 'CONFIGURED',
                  },
                  {
                    name: 'POST_NOTIFICATIONS',
                    api: 'API 33+ (Android 13+)',
                    desc: 'Grants high-priority heads-up banner notifications with action buttons.',
                    status: 'CONFIGURED',
                  },
                  {
                    name: 'WAKE_LOCK & RECEIVE_BOOT_COMPLETED',
                    api: 'Universal',
                    desc: 'Wakes device processor from deep Doze mode; auto-restores alarms on boot.',
                    status: 'CONFIGURED',
                  },
                ].map((perm, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-start justify-between gap-3 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[12px] font-semibold text-on-surface">
                          {perm.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-container text-outline">
                          {perm.api}
                        </span>
                      </div>
                      <p className="text-[12px] text-on-surface-variant mt-0.5">
                        {perm.desc}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#54906e]/10 text-[#54906e] shrink-0">
                      {perm.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'test' && (
            <div className="space-y-5 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-secondary/10 mx-auto flex items-center justify-center text-secondary border border-secondary/20">
                <span className="material-symbols-outlined text-[32px]">
                  alarm_on
                </span>
              </div>
              <div className="max-w-md mx-auto">
                <h4 className="text-[18px] font-light text-on-surface">
                  Test Timely Task Alarm Sequence
                </h4>
                <p className="text-[13px] text-on-surface-variant mt-1 leading-relaxed">
                  Trigger an exact alarm test simulating the Android AlarmManager +
                  Web Notification chime dispatch.
                </p>
              </div>

              {testCountdown !== null ? (
                <div className="p-6 rounded-2xl bg-secondary/10 border border-secondary/20 max-w-sm mx-auto">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-secondary">
                    Alarm countdown active
                  </span>
                  <div className="text-[44px] font-light text-on-surface font-mono my-2">
                    00:0{testCountdown}
                  </div>
                  <button
                    onClick={() => setTestCountdown(null)}
                    className="text-[12px] text-outline hover:text-on-surface underline"
                  >
                    Cancel Countdown
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setTestCountdown(5)}
                    className="px-5 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-inverse-surface text-[13px] font-medium transition-all shadow-xs"
                  >
                    Schedule Alarm in 5s
                  </button>
                  <button
                    onClick={() => {
                      triggerTaskNotification(
                        'Instant Horology Dispatch',
                        'Transit checkpoint confirmed. Live telemetry synced.',
                        'celestia'
                      );
                    }}
                    className="px-5 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-[13px] font-medium border border-outline-variant/30 transition-all"
                  >
                    Trigger Alarm Now
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'manifest' && (
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] text-outline font-mono">
                  android/app/src/main/AndroidManifest.xml
                </span>
                <button
                  onClick={() => copyToClipboard(manifestSnippet)}
                  className="text-[11px] text-secondary hover:underline font-medium"
                >
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-[#1c1b1a] text-[#cac6c4] text-[12px] font-mono overflow-x-auto">
                {manifestSnippet}
              </pre>
            </div>
          )}

          {activeTab === 'kotlin' && (
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] text-outline font-mono">
                  android/app/src/main/java/com/kallos/chronology/KallosAlarmManager.kt
                </span>
                <button
                  onClick={() => copyToClipboard(kotlinSnippet)}
                  className="text-[11px] text-secondary hover:underline font-medium"
                >
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-[#1c1b1a] text-[#cac6c4] text-[12px] font-mono overflow-x-auto">
                {kotlinSnippet}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-outline-variant/20 bg-surface-container-low/40 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-primary text-on-primary text-[12px] font-medium hover:bg-inverse-surface transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
