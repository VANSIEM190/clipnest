import { useState , useEffect } from "react";

const useStateScreen = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 700)

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 700)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isSmallScreen;
}

export default useStateScreen