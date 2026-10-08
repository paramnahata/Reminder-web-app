import { chimeSynthesizer } from './audio';

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch {
    return 'denied';
  }
}

export function triggerTaskNotification(title: string, body: string, sound: 'celestia' | 'chime' = 'celestia') {
  // Play sound
  if (sound === 'celestia') {
    chimeSynthesizer.playCelestiaCrescendo();
  } else {
    chimeSynthesizer.playLoudChime();
  }

  // Trigger web notification if permission is granted
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      const notif = new Notification(title, {
        body,
        icon: '/icon.svg',
        tag: 'kallos-task-alert',
        requireInteraction: true,
      });

      notif.onclick = () => {
        window.focus();
        notif.close();
      };
    } catch {
      // Fallback in some mobile browsers where Notification constructor throws without ServiceWorker
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SHOW_NOTIFICATION',
          title,
          body,
        });
      }
    }
  }

  // Trigger vibration if available (tactile haptic simulation)
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate([200, 100, 200, 100, 400]);
    } catch {
      // ignored
    }
  }
}
