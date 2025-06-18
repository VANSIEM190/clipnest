import {
  FaHome,
  FaCommentDots,
  FaUsers,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'
import { useUser } from '../Context/UserContext'
import { useDarkMode } from '../Context/DarkModeContext'
import React, { useEffect, useState } from 'react'
import useStateScreen from '../hooks/UseSizeScreen'
import { stringToColor } from '../utils/StringToColor'
import UserStatus from './UsersStatut'

const Sidebar = () => {
  const { user } = useUser()
  const { isDarkMode } = useDarkMode()
  const isSmallScreen = useStateScreen()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const bgColor = stringToColor(user?.fullName)
  const navigate = useNavigate()

  const sidebarClass = isDarkMode
    ? 'bg-gray-900 text-gray-200'
    : 'bg-gray-100 text-gray-800'

  useEffect(() => {
    // Reset menu lorsqu'on change de taille d'écran
    if (!isSmallScreen) {
      setIsMobileMenuOpen(false)
      setIsCollapsed(true)
    } else {
      setIsCollapsed(true)
    }
  }, [isSmallScreen])

  const toggleMenu = () => {
    if (isSmallScreen) {
      setIsMobileMenuOpen(!isMobileMenuOpen)
    } else {
      setIsCollapsed(!isCollapsed)
    }
  }

  const shouldCollapse = isSmallScreen ? !isMobileMenuOpen : isCollapsed

  const onNavigate = link => {
    navigate(link)
  }

  return (
    <>
      {/* Bouton menu flottant */}

      <div
        className={`absolute z-50 top-4 transition-all duration-300 ${
          isSmallScreen ? 'left-1' : shouldCollapse ? 'left-0' : 'left-58'
        }`}
      >
        <button
          onClick={toggleMenu}
          className={`text-sm p-2  rounded-full shadow ${
            isDarkMode
              ? 'bg-transparent text-gray-100'
              : 'bg-transparent text-gray-900'
          }`}
        >
          {shouldCollapse ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      {/* Sidebar */}
      {!isSmallScreen || isMobileMenuOpen ? (
        <div
          className={`z-40 h-screen flex flex-col shadow-lg transition-all duration-300 ease-in-out min-w-15 max-w-65
          ${sidebarClass}
          ${shouldCollapse ? 'w-16' : 'w-58'}
          ${isSmallScreen ? 'fixed top-20 left-0' : 'fixed top-20 left-0'}
          `}
        >
          {!shouldCollapse && (
            <div className="text-xl font-bold mb-4 p-4">
              Mon Menu
              <button
                onClick={toggleMenu}
                className="text-sm p-2  rounded-full shadow"
              >
                {shouldCollapse ? <FaChevronRight /> : <FaChevronLeft />}
              </button>
            </div>
          )}

          {/* Profil utilisateur */}
          <div className="p-4 border-t border-white/20">
            <div className="flex items-center space-x-2">
              <div
                className="relative w-8 h-8 rounded-full  text-white flex items-center justify-center text-sm"
                style={{ backgroundColor: bgColor }}
              >
                {user?.initials}
                <div className="absolute -bottom-1 right-1 translate-x-1/2 -translate-y-1/2">
                  <UserStatus uid={user.uid} />
                </div>
              </div>
              {!shouldCollapse && (
                <span className="text-sm truncate">{user?.fullName}</span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-2 flex-1 mt-4">
            <NavItem
              icon={<FaHome size={20} />}
              label="Accueil"
              isCollapsed={shouldCollapse}
              onClick={() => onNavigate('/salon')}
            />
            <NavItem
              icon={<FaCommentDots size={20} />}
              label="Posez une Question"
              isCollapsed={shouldCollapse}
              onClick={() => onNavigate('/question-user')}
            />
            <NavItem
              icon={<FaUsers size={20} />}
              label="Utilisateurs"
              isCollapsed={shouldCollapse}
              onClick={() => onNavigate('/profils-utilisateurs')}
            />
            <NavItem
              icon={<FaUser size={20} />}
              label="Profil"
              isCollapsed={shouldCollapse}
              onClick={() => onNavigate('/mon-profil')}
            />
          </div>
        </div>
      ) : null}
    </>
  )
}

const NavItem = React.memo(({ icon, label, isCollapsed, onClick }) => {
  const { isDarkMode } = useDarkMode();
  return (
    <div
      onClick={onClick}
      className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition
      ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-400'}
      text-sm`}
    >
      <span className="ml-2">{icon}</span>
      {!isCollapsed && <span className="truncate">{label}</span>}
    </div>
  );
});

export default Sidebar;
