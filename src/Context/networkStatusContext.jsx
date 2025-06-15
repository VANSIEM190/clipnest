import { createContext, useContext, useEffect, useState } from 'react'

const netWorkStatusContext = createContext()

export const NetWorkStatusProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(false)
  const [isOnlineStatus, setIsOnlineStatus] = useState(navigator.onLine)

  useEffect(() => {
    const checkInternet = async () => {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 3000) // 3 secondes

      try {
        await fetch('https://www.google.com/favicon.ico', {
          method: 'HEAD',
          mode: 'no-cors',
          signal: controller.signal,
        })
        setIsOnline(true)
      } catch {
        setIsOnline(false)
      } finally {
        clearTimeout(timeout)
      }
    }

    checkInternet()

    const handleOnline = () => {
      setIsOnlineStatus(true)
      checkInternet()
    }
    const handleOffline = () => {
      setIsOnline(false)
      setIsOnlineStatus(false)
    }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <netWorkStatusContext.Provider value={{ isOnline, isOnlineStatus }}>
      {children}
    </netWorkStatusContext.Provider>
  )
}

export const useNetworkStatus = () => useContext(netWorkStatusContext)
