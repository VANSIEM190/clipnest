import { Link, useLocation } from "react-router-dom";
import { FiBell, FiSun, FiMoon } from "react-icons/fi";
import { useUser } from "../Context/UserContext";
import { useDarkMode } from "../Context/DarkModeContext";
import useStateScreen from "../hooks/UseSizeScreen";
import Options from "./Options";
import { stringToColor } from "../utils/StringToColor";

const Navbar = () => {
  const { user } = useUser();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const location = useLocation();
  const isSmallScreen = useStateScreen();
  const bgColor = stringToColor(user?.fullName);

  const isRoot = location.pathname === "/";

  return (
    <>
      <header className={`${isDarkMode ? "dark:bg-gray-900" : "bg-gray-200"} shadow-md py-4 px-8 flex justify-between items-center max-sm[290px]:flex-col max-sm[290px]:gap-4l`}>
        <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">ClipNest</h3>

        <nav className={`items-center space-x-6 text-gray-800 ${isDarkMode ? "dark:text-gray-200" : ""} ${isSmallScreen ? "hidden" : "flex"}`}>
          <Link to="/" className="hover:text-blue-500 dark:hover:text-blue-400 transition">Accueil</Link>
          <Link to="/Àpropos" className="hover:text-blue-500 dark:hover:text-blue-400 transition">À propos</Link>
          <FiBell className="text-2xl" />
          <button onClick={toggleDarkMode} className="text-xl focus:outline-none cursor-pointer">
            {isDarkMode ? <FiSun /> : <FiMoon />}
          </button>
          <div className="w-8 h-8 rounded-full  flex items-center justify-center text-white font-semibold"
          style={{ backgroundColor: bgColor }}
          >
            {user?.initials}
          </div>
        </nav>

        {isSmallScreen && !isRoot && (
          <Options />
        )}
      </header>
      
    </>
  );
};

export default Navbar;
