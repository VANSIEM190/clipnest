import {
  FaHome,
  FaCommentDots,
  FaUsers,
  FaUser,
  FaFileCode,
} from 'react-icons/fa'
import React from 'react'
import { BiCodeBlock } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import { useDarkMode } from '../../context/DarkModeContext'

const Sidebar = () => {
  const { isDarkMode } = useDarkMode()
  const navigate = useNavigate()

  const sidebarClass = isDarkMode
    ? 'bg-gray-900 text-gray-200'
    : 'bg-gray-100 text-gray-800'

  const onNavigate = link => {
    navigate(link)
  }

  return (
    <>
      <div className="absolute z-50 top-4 transition-all duration-300 left-1"></div>

      <div
        className={`z-40 w-12 h-screen flex flex-col items-center shadow-lg transition-all duration-300 ease-in-out  fixed top-15 left-0
          ${sidebarClass}
          `}
      >
        {/* Navigation */}
        <div className="space-y-2 flex-1 mt-4">
          <NavItem
            icon={<FaHome size={20} />}
            label="salon"
            onClick={() => onNavigate('/salon')}
          />
          <NavItem
            icon={<FaCommentDots size={20} />}
            label="poser une question"
            onClick={() => onNavigate('/question-user')}
          />
          <NavItem
            icon={<FaUsers size={20} />}
            label="utilisateurs"
            onClick={() => onNavigate('/profils-utilisateurs')}
          />
          <NavItem
            icon={<FaUser size={20} />}
            label="mon profil"
            onClick={() => onNavigate('/mon-profil')}
          />
          <NavItem
            icon={<BiCodeBlock size={24} />}
            label="codeLine"
            onClick={() => onNavigate('/snippets')}
          />
          <NavItem
            icon={<FaFileCode size={24} />}
            label="snippets"
            onClick={() => onNavigate('/blog-de-code')}
          />
        </div>
      </div>
    </>
  )
}

const NavItem = React.memo(({ icon, label, onClick }) => {
  const { isDarkMode } = useDarkMode()
  return (
    <div
      onClick={onClick}
      className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition
      ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-400'}
      text-sm`}
      title={label}
    >
      {icon}
    </div>
  )
})

export default Sidebar
