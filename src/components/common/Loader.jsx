import { useDarkMode } from '../../context/DarkModeContext'

const Loader = () => {
  const { isDarkMode } = useDarkMode()
  return (
    <div
      className={`${
        isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-900'
      }w-screen h-screen flex justify-center items-center`}
    >
      <div className="loader"></div>
    </div>
  )
}

const FileurLoader = () => {
  const { isDarkMode } = useDarkMode()
  return (
    <div
      className={`${
        isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-900'
      }w-screen h-screen flex justify-center items-center`}
    >
      <div className="fileurLoader"></div>
    </div>
  )
}

export { Loader, FileurLoader }
