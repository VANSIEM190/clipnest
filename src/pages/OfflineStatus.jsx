import { useDarkMode } from '../context/DarkModeContext.jsx'
import { RiWifiOffLine } from 'react-icons/ri'

const OfflineStatus = () => {
  const { isDarkMode } = useDarkMode()

  return (
    <main
      className={`flex  justify-center items-center min-h-full  px-6 py-24 sm:py-32 lg:px-8 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-black'
      }`}
    >
      <div className=" flex flex-col justify-center items-center text-center">
        <RiWifiOffLine size={40} />
        <h1 className=" mt-4 text-3xl font-bold sm:text-7xl">
          Pas de connexion Internet
        </h1>
        <p className="mt-6 text-lg leading-8">
          Veuillez vérifier votre connexion et réessayer
        </p>
      </div>
    </main>
  )
}

export default OfflineStatus
