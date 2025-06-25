import { useEffect, useState } from 'react'
import { getDatabase, ref, onValue } from 'firebase/database'

/**
 * Hook pour lire le statut d'un utilisateur (autre que soi-même)
 * @param {string} uid - L'identifiant de l'utilisateur à surveiller
 * @returns { state, lastSeen, isActivelyUsing }
 */
export default function useUserStatus(uid) {
  const [state, setState] = useState('offline')
  const [lastSeen, setLastSeen] = useState(null)
  const [isActivelyUsing, setIsActivelyUsing] = useState(false)

  useEffect(() => {
    if (!uid) return
    const db = getDatabase()
    const userStatusRef = ref(db, `/status/${uid}`)

    const unsubscribe = onValue(userStatusRef, snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        setState(data.state || 'offline')
        setLastSeen(data.lastActivity || null)
        setIsActivelyUsing(!!data.isActivelyUsing)
      } else {
        setState('offline')
        setLastSeen(null)
        setIsActivelyUsing(false)
      }
    })

    return () => unsubscribe()
  }, [uid])

  return { state, lastSeen, isActivelyUsing }
}
