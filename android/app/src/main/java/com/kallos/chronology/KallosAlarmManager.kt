package com.kallos.chronology

import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.media.RingtoneManager
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.annotation.RequiresApi

/**
 * Kallos Horology Alarm Coordinator.
 * Enforces Exact Alarm compliance on Android 12+ (API 31..35).
 * Uses setAlarmClock and setExactAndAllowWhileIdle to pierce Doze battery restrictions.
 */
class KallosAlarmManager(private val context: Context) {

    private val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    private val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

    companion object {
        const val CHANNEL_CRITICAL = "kallos_critical_chronology"
        const val CHANNEL_STAGED = "kallos_staged_dispatch"
        const val ACTION_ALARM_TRIGGER = "com.kallos.chronology.ACTION_TRIGGER_ALARM"
    }

    init {
        createNotificationChannels()
    }

    /**
     * Checks whether the application has permission to schedule exact alarms (Android 12+)
     */
    fun hasExactAlarmPermission(): Boolean {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            alarmManager.canScheduleExactAlarms()
        } else {
            true
        }
    }

    /**
     * Opens system setting intent if exact alarm permission is missing
     */
    fun requestExactAlarmPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && !alarmManager.canScheduleExactAlarms()) {
            val intent = Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM).apply {
                data = Uri.fromParts("package", context.packageName, null)
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            context.startActivity(intent)
        }
    }

    /**
     * Schedules an uncompromising exact alarm that triggers even during system Doze.
     * Uses setAlarmClock for highest reliability and lockscreen alarm clock pill visibility.
     */
    fun scheduleExactCommitment(
        commitmentId: String,
        title: String,
        timestampEpochMillis: Long,
        isCritical: Boolean = true
    ) {
        val intent = Intent(ACTION_ALARM_TRIGGER).apply {
            setPackage(context.packageName)
            putExtra("EXTRA_COMMITMENT_ID", commitmentId)
            putExtra("EXTRA_TITLE", title)
            putExtra("EXTRA_TIMESTAMP", timestampEpochMillis)
        }

        val pendingIntent = PendingIntent.getBroadcast(
            context,
            commitmentId.hashCode(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        // Show launcher icon on lock screen clock indicator
        val showIntent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        val showPendingIntent = PendingIntent.getActivity(
            context,
            0,
            showIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val alarmClockInfo = AlarmManager.AlarmClockInfo(timestampEpochMillis, showPendingIntent)
        alarmManager.setAlarmClock(alarmClockInfo, pendingIntent)
    }

    /**
     * Cancels an existing scheduled alarm
     */
    fun cancelCommitmentAlarm(commitmentId: String) {
        val intent = Intent(ACTION_ALARM_TRIGGER).apply {
            setPackage(context.packageName)
        }
        val pendingIntent = PendingIntent.getBroadcast(
            context,
            commitmentId.hashCode(),
            intent,
            PendingIntent.FLAG_NO_CREATE or PendingIntent.FLAG_IMMUTABLE
        )
        if (pendingIntent != null) {
            alarmManager.cancel(pendingIntent)
        }
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val criticalChannel = NotificationChannel(
                CHANNEL_CRITICAL,
                "Kallos Critical Chronology",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "High-priority horological alarms with Celestia crescendo tone"
                enableVibration(true)
                vibrationPattern = longArrayOf(0, 500, 250, 500, 250, 1000)
                setBypassDnd(true)
                lockscreenVisibility = android.app.Notification.VISIBILITY_PUBLIC
            }

            val stagedChannel = NotificationChannel(
                CHANNEL_STAGED,
                "Kallos Staged Dispatch Ladder",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Intermediate telemetry and route buffers"
                enableVibration(true)
            }

            notificationManager.createNotificationChannels(listOf(criticalChannel, stagedChannel))
        }
    }
}
