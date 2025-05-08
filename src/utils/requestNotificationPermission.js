import { getToken } from 'firebase/messaging';
import { messaging } from '../services/firebaseconfig'; // assure-toi que messaging est bien exporté

export async function RequestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'BIanCUYSecZqQYqqtVIq_nMZoc7_bRMaz-0DGVj-uCe49bbTrZ_N68T3Tgmh0KJ2rAktdWA-d_AeNYz0jJ3NB8s', // Remplace par ta clé publique VAPID
      });
      return token;
    } else {
      console.warn('Permission de notification refusée');
      return null;
    }
  } catch (err) {
    console.error('Erreur lors de la récupération du token FCM:', err);
    return null;
  }
}
