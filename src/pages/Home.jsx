import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { UserProvider } from "../Context/UserContext";
import { useDarkMode } from "../Context/DarkModeContext";
import useStateScreen from "../hooks/UseSizeScreen";
import ContactCard from "../components/Users";
import RichTextEditor from "../components/QuestionsUsers";
import MessageCard from "../components/Accuiel";
import UserProfil from "../components/userProfil";

const Home = () => {
  const { isDarkMode } = useDarkMode();
  const isSmallScreen = useStateScreen();
  const homeClass = isDarkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-black";

  const [activeSection, setActiveSection] = useState("home"); 

  const handleNavigation = (section ) => {
    setActiveSection(section );
  };

  return (
    <div className={`${homeClass} min-h-screen flex flex-col`}>
      <UserProvider>
        <Navbar />

        <div className="w-screen  ">
          <Sidebar onNavigate={handleNavigation} />

          <div className={` w-[97%] overflow-auto ${isSmallScreen? " mx-auto" : "float-right" }`}  >
            {activeSection === "profil" && <UserProfil />}
            {activeSection === "users" && <ContactCard />}
            {activeSection === "questions" && <RichTextEditor />}
            {activeSection === "home" && <MessageCard /> }
            {/* tu peux en ajouter d'autres si tu veux */}
          </div>
        </div>
      </UserProvider>
    </div>
  );
};

export default Home;
