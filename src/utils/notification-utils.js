/**
 * Utilitaires pour l'envoi de notifications push
 */

const BACKEND_URL = 'https://clipnest-app.onrender.com/api/firebase/send-notification'

/**
 * Envoie une notification push à un utilisateur spécifique
 * @param {string} deviceToken - Le token FCM de l'utilisateur cible
 * @param {string} title - Le titre de la notification
 * @param {string} body - Le contenu de la notification
 * @returns {Promise<boolean>} - True si l'envoi a réussi, false sinon
 */
export const sendPushNotification = async (deviceToken, title, body) => {
  if (!deviceToken) {
    console.error("Token FCM manquant pour l'envoi de notification")
    return false
  }

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deviceToken,
        title,
        body,
      }),
    })

    if (response.ok) {
      console.log('Notification push envoyée avec succès')
      return true
    } else {
      console.error(
        "Erreur lors de l'envoi de la notification push:",
        response.status
      )
      return false
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi de la notification push:", error)
    return false
  }
}

/**
 * Envoie une notification push à plusieurs utilisateurs
 * @param {Array<string>} deviceTokens - Array de tokens FCM
 * @param {string} title - Le titre de la notification
 * @param {string} body - Le contenu de la notification
 * @returns {Promise<Array<boolean>>} - Array des résultats d'envoi
 */
export const sendPushNotificationToMultiple = async (
  deviceTokens,
  title,
  body
) => {
  if (!Array.isArray(deviceTokens) || deviceTokens.length === 0) {
    console.error("Aucun token FCM fourni pour l'envoi de notification")
    return []
  }
  const results = await Promise.allSettled(
    deviceTokens.map(token => sendPushNotification(token, title, body))
  )

  return results.map(result =>
    result.status === 'fulfilled' ? result.value : false
  )
}

/**
 * Envoie une notification locale (si le navigateur est ouvert)
 * @param {string} title - Le titre de la notification
 * @param {string} body - Le contenu de la notification
 * @param {Object} options - Options supplémentaires pour la notification
 */
export const sendLocalNotification = (title, body, options = {}) => {
  if (!('Notification' in window)) {
    console.warn('Les notifications ne sont pas supportées par ce navigateur')
    return
  }

  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/image.png', // Icône par défaut
      ...options
    })
  } else {
    console.warn('Permission de notification non accordée')
  }
}

/**
 * Demande la permission de notification et retourne le statut
 * @returns {Promise<string>} - Le statut de la permission
 */
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    return 'unsupported'
  }

  try {
    const permission = await Notification.requestPermission()
    return permission
  } catch (error) {
    console.error('Erreur lors de la demande de permission:', error)
    return 'denied'
  }
} 