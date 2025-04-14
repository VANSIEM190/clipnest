import {
  FaHome,
  FaQuestionCircle,
  FaCommentDots,
  FaUsers,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { useUser } from './Context/UserContext';
import { useDarkMode } from './Context/DarkModeContext';
import React, { useState } from 'react';

const Sidebar = () => {
  const { initials, user } = useUser();
  const { isDarkMode } = useDarkMode();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const sidebarClass = isDarkMode
    ? 'bg-gray-900 text-gray-200'
    : 'bg-gray-200 text-gray-800';

  return (
    <div
      className={`h-screen flex flex-col shadow-lg transition-all duration-300 ease-in-out
      ${sidebarClass} ${isCollapsed ? 'w-16' : 'w-64'}`}
    >
      {/* Bouton toggle */}
      <div className="flex justify-end p-2">
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-xl">
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      {/* Titre */}
      {!isCollapsed && (
        <div className="text-2xl font-bold mb-6 px-4">MaBarre</div>
      )}

      {/* Liens */}
      <div className="space-y-4 flex-1">
        <NavItem icon={<FaHome size={20} />} label="Accueil" isCollapsed={isCollapsed} />
        <NavItem icon={<FaQuestionCircle size={20} />} label="Questions" isCollapsed={isCollapsed} />
        <NavItem icon={<FaCommentDots size={20} />} label="Réponses" isCollapsed={isCollapsed} />
        <NavItem icon={<FaUsers size={20} />} label="Utilisateurs" isCollapsed={isCollapsed} />
        <NavItem icon={<FaUser size={20} />} label="Profil" isCollapsed={isCollapsed} />
      </div>

      {/* Footer utilisateur */}
      <div className="p-4 border-t border-white/20">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 text-white flex items-center justify-center">
            {initials}
          </div>
          {!isCollapsed && <span>{user}</span>}
        </div>
      </div>
    </div>
  );
};

const NavItem = React.memo(({ icon, label, isCollapsed }) => {
  const { isDarkMode } = useDarkMode();
  return (
    <div
      className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition
      ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-400'}`}
    >
      <span className="ml-4">{icon}</span>
      {!isCollapsed && <span>{label}</span>}
    </div>
  );
});

export default Sidebar;
