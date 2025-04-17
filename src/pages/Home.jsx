import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { UserProvider } from "../Context/UserContext";
import { useDarkMode } from "../Context/DarkModeContext";
import useStateScreen from "../hooks/UseSizeScreen";
import ContactCard from "../components/Users";
import QuestionForm from "../QuestionsUsers";

const Home = () => {
  const { isDarkMode } = useDarkMode();
  const isSmallScreen = useStateScreen();
  const homeClass = isDarkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-black";

  const [activeSection, setActiveSection] = useState(null); 

  const handleNavigation = (section) => {
    setActiveSection(section);
  };

  return (
    <div className={`${homeClass} min-h-screen flex flex-col`}>
      <UserProvider>
        <Navbar />

        <div className="w-screen  ">
          <Sidebar onNavigate={handleNavigation} />

          <div className={` w-[97%] overflow-auto ${isSmallScreen? " mx-auto" : "float-right" }`}  >
            {activeSection === "users" && <ContactCard />}
            {activeSection === "questions" && <QuestionForm />}
            {activeSection === "home" && <h1 className="text-2xl mt-10"></h1>}
            {/* tu peux en ajouter d'autres si tu veux */}
          </div>
        </div>
      </UserProvider>
    </div>
  );
};

export default Home;
