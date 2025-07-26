import { Link, useLocation } from "react-router-dom";
import { FiBell, FiSun, FiMoon } from "react-icons/fi";
import { useDarkMode } from '../../context/DarkModeContext.jsx'
import { useUser } from '../../context/UserContext.jsx'
import useStateScreen from '../../hooks/UseSizeScreen.js'
import { Options } from '../common'
import { stringToColor } from '../../utils/StringToColor.js'
import { UserStatus } from '../users/UserStatut.jsx'

const Navbar = () => {
  const { user } = useUser()
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const location = useLocation()
  const isSmallScreen = useStateScreen()
  const bgColor = stringToColor(user?.fullName)

  const isRoot = location.pathname === '/'

  return (
    <>
      <header
        className={`${
          isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
        } min-w-scren shadow-md py-4 px-8 flex justify-between items-center max-sm:flex-wrap max-sm:items-start max-sm:gap-4`}
      >
        <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          ClipNest
        </h3>

        <nav
          className={`items-center space-x-6 text-gray-800 ${
            isDarkMode ? 'dark:text-gray-200' : ''
          } ${isSmallScreen ? 'hidden' : 'flex'}`}
        >
          {/* liens de navigation */}
          <Link
            to="/"
            className="hover:text-blue-500 dark:hover:text-blue-400 transition"
          >
            Accueil
          </Link>
          <Link
            to="/Àpropos"
            className="hover:text-blue-500 dark:hover:text-blue-400 transition"
          >
            À propos
          </Link>
          <FiBell className="text-2xl" />
          <button
            onClick={toggleDarkMode}
            className="text-xl focus:outline-none cursor-pointer"
          >
            {isDarkMode ? <FiSun /> : <FiMoon />}
          </button>
          {/* profil utilisateur  */}
          <div
            className=" relative w-8 h-8 rounded-full  flex items-center justify-center text-white font-semibold"
            style={{ backgroundColor: bgColor }}
          >
            {user?.initials}
            <div className="absolute -bottom-1.5 right-1 translate-x-1/2 -translate-y-1/2">
              <UserStatus userId={user?.uid} />
            </div>
          </div>
        </nav>
        {/* on affiche les composant options si nous sommes dans small screen */}
        {isSmallScreen && !isRoot && <Options />}
      </header>
    </>
  )
}

export default Navbar;
