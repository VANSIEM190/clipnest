import { useEffect, useState } from 'react'
import {
  getDatabase,
  ref,
  onValue,
  set,
  onDisconnect,
  serverTimestamp,
} from 'firebase/database'
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp as fsServerTimestamp,
} from 'firebase/firestore'

export default function useOnlineStatus(uid) {
  const [isOnline, setIsOnline] = useState(false)
  const [lastSeen, setLastSeen] = useState(null)

  useEffect(() => {
    if (!uid) return

    const db = getDatabase()
    const dbFS = getFirestore()

    // Références pour le statut
    const userStatusRef = ref(db, `/status/${uid}`)
    const userFirestoreRef = doc(dbFS, 'users', uid)

    // États de présence avec timestamp
    const isOfflineData = {
      state: 'offline',
      lastSeen: serverTimestamp(),
      lastActivity: new Date().toISOString(),
      isActivelyUsing: false, // Nouveau champ
    }

    const isOnlineData = {
      state: 'online',
      lastSeen: serverTimestamp(),
      lastActivity: new Date().toISOString(),
      isActivelyUsing: true, // Nouveau champ
    }

    // Référence pour vérifier la connexion
    const connectedRef = ref(db, '.info/connected')

    let inactivityTimeout

    // Fonction pour mettre à jour le statut
    const updateStatus = async (status, firestore = true) => {
      try {
        await set(userStatusRef, status)
        if (firestore) {
          await setDoc(
            userFirestoreRef,
            {
              online: status.isActivelyUsing, // Modifié ici
              lastSeen: fsServerTimestamp(),
              lastActivity: status.lastActivity,
            },
            { merge: true }
          )
        }
        setIsOnline(status.isActivelyUsing) // Modifié ici
        setLastSeen(status.lastActivity)
      } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error)
      }
    }

    // Fonction pour détecter l'inactivité
    const setupActivityDetection = () => {
      // Marquer comme inactif après 2 minutes sans activité
      const startInactivityTimer = () => {
        if (inactivityTimeout) clearTimeout(inactivityTimeout)
        inactivityTimeout = setTimeout(() => {
          updateStatus({
            ...isOfflineData,
            state: 'inactive',
            isActivelyUsing: false,
          })
        }, 120000) // 2 minutes
      }

      // Événements à surveiller pour l'activité
      const events = [
        'mousedown',
        'mousemove',
        'keydown',
        'scroll',
        'touchstart',
        'click',
        'focus',
      ]

      const handleActivity = () => {
        // Réinitialiser le timer d'inactivité
        if (inactivityTimeout) clearTimeout(inactivityTimeout)

        // Mettre à jour le statut comme actif
        updateStatus({
          ...isOnlineData,
          lastActivity: new Date().toISOString(),
          isActivelyUsing: true,
        })

        // Redémarrer le timer d'inactivité
        startInactivityTimer()
      }

      // Ajouter les écouteurs d'événements
      events.forEach(event => {
        document.addEventListener(event, handleActivity)
      })

      // Démarrer le timer initial
      startInactivityTimer()

      return () => {
        events.forEach(event => {
          document.removeEventListener(event, handleActivity)
        })
        if (inactivityTimeout) clearTimeout(inactivityTimeout)
      }
    }

    // Écouter les changements de connexion
    const unsubscribeConnected = onValue(connectedRef, async snapshot => {
      if (!snapshot.val()) {
        updateStatus({
          ...isOfflineData,
          isActivelyUsing: false,
        })
        return
      }

      try {
        // Configurer le comportement de déconnexion
        await onDisconnect(userStatusRef).set({
          ...isOfflineData,
          isActivelyUsing: false,
        })

        // Mettre à jour le statut initial
        await updateStatus({
          ...isOnlineData,
          isActivelyUsing: true,
        })
      } catch (error) {
        console.error('Erreur lors de la configuration de la connexion:', error)
      }
    })

    // Écouter les changements de visibilité de la page
    const handleVisibilityChange = () => {
      updateStatus(
        document.hidden
          ? { ...isOfflineData, isActivelyUsing: false }
          : { ...isOnlineData, isActivelyUsing: true }
      )
    }

    // Écouter les événements de fermeture de la page
    const handleBeforeUnload = () => {
      updateStatus(
        {
          ...isOfflineData,
          isActivelyUsing: false,
        },
        false
      )
    }

    // Configurer les écouteurs d'événements
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    // Configurer la détection d'activité
    const cleanupActivity = setupActivityDetection()

    // Écouter les changements de statut
    const unsubscribeStatus = onValue(userStatusRef, snapshot => {
      if (snapshot.exists()) {
        const status = snapshot.val()
        setIsOnline(status.isActivelyUsing)
        setLastSeen(status.lastActivity)
      }
    })

    // Nettoyage
    return () => {
      unsubscribeConnected()
      unsubscribeStatus()
      if (cleanupActivity) cleanupActivity()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      updateStatus({
        ...isOfflineData,
        isActivelyUsing: false,
      })
    }
  }, [uid])

  return { isOnline, lastSeen }
}
