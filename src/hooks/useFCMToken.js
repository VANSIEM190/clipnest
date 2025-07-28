import { useState, useEffect } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../services/firebaseconfig'
import { requestFCMToken } from '../utils/firebase-utils'
import { useUser } from '../context'

/**
 * Hook personnalisé pour gérer les tokens FCM
 * Récupère le token, le stocke dans Firestore et le met à jour si nécessaire
 */
const useFCMToken = () => {
  const [fcmToken, setFcmToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useUser()

  useEffect(() => {
    const initializeFCMToken = async () => {
      if (!user?.uid) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // Demander la permission et récupérer le token
        const token = await requestFCMToken()
        
        if (token) {
          setFcmToken(token)
          
          // Stocker le token dans Firestore
          await setDoc(doc(db, 'users', user.uid), {
            fcmToken: token,
            lastTokenUpdate: new Date(),
            isNotificationEnabled: true
          }, { merge: true })
          
          console.log('Token FCM enregistré avec succès pour l\'utilisateur:', user.uid)
        } else {
          setError('Impossible de récupérer le token FCM')
        }
      } catch (err) {
        console.error('Erreur lors de l\'initialisation du token FCM:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    initializeFCMToken()
  }, [user?.uid])

  // Fonction pour forcer la mise à jour du token
  const refreshToken = async () => {
    if (!user?.uid) return null
    
    try {
      const newToken = await requestFCMToken()
      if (newToken) {
        setFcmToken(newToken)
        
        // Mettre à jour dans Firestore
        await setDoc(doc(db, 'users', user.uid), {
          fcmToken: newToken,
          lastTokenUpdate: new Date()
        }, { merge: true })
        
        return newToken
      }
    } catch (err) {
      console.error('Erreur lors du rafraîchissement du token:', err)
      setError(err.message)
    }
    
    return null
  }

  return {
    fcmToken,
    isLoading,
    error,
    refreshToken
  }
}

export default useFCMToken 