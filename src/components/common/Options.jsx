import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiBell, FiSun, FiMoon, FiMenu } from "react-icons/fi";
import { useDarkMode, useUser } from '../../context'
import { stringToColor } from '../../utils/StringToColor.js'
import { UserStatus } from '../users/UserStatut.jsx'

const Options = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const { user } = useUser()
  const bgColor = stringToColor(user.fullName)
  const [isOpen, setIsOpen] = useState(false)
  const toggleDropdown = () => setIsOpen(!isOpen)

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          className={`flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 
            ${
              isDarkMode
                ? 'bg-gray-900  text-white'
                : 'bg-gray-200 text-gray-900'
            }`}
          type="button"
          onClick={toggleDropdown}
        >
          <FiMenu className="text-2xl" />
        </button>
      </div>

      {isOpen && (
        <div
          className="z-100 absolute max-xs:-right-30 right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
          role="menu"
        >
          <div
            className={`py-1 rounded-sm shadow-sm shadow-gray-700 ${
              isDarkMode ? 'bg-gray-900 text-white ' : 'bg-white text-gray-900'
            }`}
          >
            {/* Accueil */}
            <div className="w-full text-center py-2 text-sm  hover:bg-gray-100">
              <Link to="/" className="block">
                Accueil
              </Link>
            </div>

            {/* À propos */}
            <div className="w-full text-center py-2 text-sm  hover:bg-gray-100">
              <Link to="/Àpropos" className="block">
                À propos
              </Link>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-center gap-x-2 py-2 text-sm  hover:bg-gray-100">
              <FiBell className="text-xl" />
              <span>Notifications</span>
            </div>

            {/* Mode sombre/clair */}
            <div className="w-full text-center py-2 text-sm  hover:bg-gray-100">
              <button
                onClick={toggleDarkMode}
                className="flex items-center justify-center gap-x-2 w-full"
              >
                {isDarkMode ? (
                  <>
                    <FiSun className="text-xl" />
                    <span>Mode clair</span>
                  </>
                ) : (
                  <>
                    <FiMoon className="text-xl" />
                    <span>Mode sombre</span>
                  </>
                )}
              </button>
            </div>

            {/* Profil utilisateur */}
            <div className="p-1 flex items-center justify-center gap-x-2 py-2 text-sm  hover:bg-gray-100">
              <div
                className=" relative w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm  shadow-inner shrink-0"
                style={{ backgroundColor: bgColor }}
              >
                {user.initials}
                <div className="absolute -bottom-1.5 right-1 translate-x-1/2 -translate-y-1/2">
                  <UserStatus userId={user?.uid} />
                </div>
              </div>
              <span className="font-semibol text-sm sm:text-base truncate  overflow-hidden">
                {user.fullName}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Options;
