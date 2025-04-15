import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { UserProvider } from "../Context/UserContext";
import { useDarkMode } from "../Context/DarkModeContext";
import ContactCard from "../components/Users";

const Home = () => {
  const { isDarkMode } = useDarkMode();
  const homeClass = isDarkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-black";
  const [showUsers, setShowUsers] = useState(false);

  return (
    <div className={`${homeClass} min-h-screen flex flex-col`}>
      <UserProvider>
        {/* Navbar en haut */}
        <Navbar />

        {/* Contenu principal : sidebar + contenu */}
        <div className="flex flex-1">
          {/* Sidebar fixe à gauche */}
          <div className="" >
            <Sidebar onUsersClick={() => setShowUsers(true)} />
          </div>

          {/* Contenu dynamique à droite */}
          <div className="flex-1 overflow-y-auto p-6 text-center justify-center">
            {showUsers && <ContactCard />}
          </div>
        </div>
      </UserProvider>
    </div>
  );
};

export default Home;
