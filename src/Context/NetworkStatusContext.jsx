import { createContext, useContext, useEffect, useState } from 'react'

const networkStatusContext = createContext()

const NetworkStatusProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(false)
  const [isOnlineStatus, setIsOnlineStatus] = useState(navigator.onLine)

  useEffect(() => {
    const checkInternet = async () => {
      const millisecondeController = 3000
      const controller = new AbortController()
      const timeout = setTimeout(
        () => controller.abort(),
        millisecondeController
      )

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

    const milliSecondeInterval = 50000
    const intervalId = setInterval(() => {
      checkInternet()
    }, milliSecondeInterval)

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
      clearInterval(intervalId)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <networkStatusContext.Provider value={{ isOnline, isOnlineStatus }}>
      {children}
    </networkStatusContext.Provider>
  )
}

const useNetworkStatus = () => useContext(networkStatusContext)

export {NetworkStatusProvider , useNetworkStatus}
