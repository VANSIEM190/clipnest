import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiBell, FiSun, FiMoon } from "react-icons/fi";
import { useUser } from "../Context/UserContext";
import { useDarkMode } from "../Context/DarkModeContext";
import { stringToColor } from '../utils/StringToColor';

const Options = ()=> {
  
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { initials , user } = useUser();
  const bgColor = stringToColor(user);
  const [isOpen, setIsOpen] = useState(false)
  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div as="div" className="relative inline-block text-left">
      <div>
        <button 
        className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white
        px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset
    hover:bg-gray-50"
        type="button"
        onClick={toggleDropdown}
    >
          Options
        </button>
      </div>

      {isOpen&&
        <div
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        <div className="'flex items-center gap-x-2 px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden">
          <div className='flex items-center gap-x-2 px-4  text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden'>
            <Link
              to="/"
              className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
            >
              Accuiel
            </Link>
          </div>
          <div className='flex items-center gap-x-2 px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden'>
            <Link
              to="/Àpropos"
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
            >
              À propos
            </Link>
          </div>
          <div className='flex items-center gap-x-2 px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden'>
            <FiBell className="text-2xl" />
            <span className="text-sm">
              notification
            </span>
          </div>
          <div className='flex items-center gap-x-2 px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden'>
          <button onClick={toggleDarkMode} className="text-xl focus:outline-none cursor-pointer"> 
            {isDarkMode ? 
              (
              <div className='flex items-center gap-x-2'>
              <FiSun />
              <span className='text-sm'>
                {isDarkMode ? "Mode clair" : "Mode sombre"}
              </span>
            </div>
            ) : 
            (
            <div className='flex items-center gap-x-2'>
              <FiMoon />
              <span className='text-sm'>
                {isDarkMode ? "Mode clair" : "Mode sombre"}
              </span>
            </div>
            )
                }
            </button>
              </div>
              <div className="flex items-center gap-x-2 px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden">
                <div className='w-8 h-8 px-4 rounded-full  flex items-center justify-center text-white font-semibold'
                style={{ backgroundColor: bgColor }}
                >
                {initials}
                </div>
                <span>{user}</span>
            </div>
        </div>
      </div>}
    </div>
  )
}

export default Options;