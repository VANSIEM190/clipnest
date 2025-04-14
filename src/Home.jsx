import Navbar from "./Navbar";
import Sidebar from "./Sidebar"
import { UserProvider } from "./Context/UserContext";
import { useDarkMode } from "./Context/DarkModeContext";

const Home = () => {
  const { isDarkMode } = useDarkMode();
  const homeClass = isDarkMode ? "dark:bg-gray-900" : "bg-gray-200";
  return (
    <div className={`${homeClass} `}>
      <UserProvider>
      <Navbar />
      <Sidebar />
      </UserProvider>
    </div>
  );
}

export default Home;