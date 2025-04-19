import {
  FaHome,
  FaQuestionCircle,
  FaCommentDots,
  FaUsers,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { useUser } from '../Context/UserContext';
import { useDarkMode } from '../Context/DarkModeContext';
import React, { useEffect, useState } from 'react';
import useStateScreen from '../hooks/UseSizeScreen'; 
import { stringToColor } from '../utils/StringToColor';

const Sidebar = ({ onNavigate }) => {
  const {  user } = useUser();
  const { isDarkMode } = useDarkMode();
  const isSmallScreen = useStateScreen(); // Ex: return window.innerWidth < 640;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const bgColor = stringToColor(user?.fullName);

  const sidebarClass = isDarkMode
    ? 'bg-gray-900 text-gray-200'
    : 'bg-gray-200 text-gray-800';

  useEffect(() => {

    // Reset menu lorsqu'on change de taille d'écran
    if (!isSmallScreen) {
      setIsMobileMenuOpen(false); 
      setIsCollapsed(false); 
    } else {
      setIsCollapsed(true);
    }
  }, [isSmallScreen]);

  const toggleMenu = () => {
    if (isSmallScreen) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const shouldCollapse = isSmallScreen ? !isMobileMenuOpen : isCollapsed;

  return (
    <>
      {/* Bouton menu flottant */}

      <div
      className={`absolute z-50 top-4 transition-all duration-300 ${
      isSmallScreen
        ? 'left-1' 
        : shouldCollapse
        ? 'left-0' 
        : 'left-58' 
    }`}
  >
  <button
    onClick={toggleMenu}
    className="text-sm p-2  rounded-full shadow"
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
          ${isSmallScreen ? 'fixed top-20 left-0' : ''}
          ${!isSmallScreen ? 'fixed top-20 left-0' : ''}
          `}
        >
          {!shouldCollapse && (
            <div className="text-xl font-bold mb-4 p-4">MaBarre</div>
          )}

          {/* Profil utilisateur */}
          <div className="p-4 border-t border-white/20">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full  text-white flex items-center justify-center text-sm"
              style={{ backgroundColor: bgColor }}
              >
                {user?.initials}
              </div>
              {!shouldCollapse && (
                <span className="text-sm truncate">{user?.fullName}</span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-2 flex-1 mt-4">
            <NavItem icon={<FaHome size={20} />} label="Accueil" isCollapsed={shouldCollapse} onClick={() => onNavigate("home")} />
            <NavItem icon={<FaQuestionCircle size={20} />} label="Mes Questions" isCollapsed={shouldCollapse} onClick={() => onNavigate("questionsUsers")} />
            <NavItem icon={<FaCommentDots size={20} />} label="Posez une Question" isCollapsed={shouldCollapse} onClick={() => onNavigate("questions")} />
            <NavItem icon={<FaUsers size={20} />} label="Utilisateurs" isCollapsed={shouldCollapse} onClick={() => onNavigate("users")} />
            <NavItem icon={<FaUser size={20} />} label="Profil" isCollapsed={shouldCollapse} onClick={() => onNavigate("profil")} />
          </div>
        </div>
      ) : null}
    </>
  );
};

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
