import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Typed from "typed.js";
import Navbar from "../components/Navbar";
import { useDarkMode } from "../Context/DarkModeContext";
import { UserProvider , useUser} from "../Context/UserContext";

const LandingPage = () => {
  const { isDarkMode } = useDarkMode();
  const { initials } = useUser();
  const typedElement = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const typed = new Typed(typedElement.current, {
      strings: [
        "Posez vos questions, partagez vos idées 💬",
        "Organisez et gérez vos vidéos simplement 📂",
        "Collaborez avec une communauté créative 🌟",
      ],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2000,
      loop: true,
    });

    return () => typed.destroy();
  }, []);

  const handleClick = async () => {
      if (initials) {
        navigate("/salon");
      } else {
        navigate("/inscription");
      }
  };

  return (
    <>
    <UserProvider>
      <Navbar />
    </UserProvider>

      <main className={`flex md:flex-row items-center justify-between px-8 md:px-20 py-16 h-[93%] gap-16  ${isDarkMode? "dark:bg-gray-900" : "bg-gray-200"}`}>
        <div className="md:w-1/2 space-y-6">
          <h3 className={`text-4xl md:text-5xl font-bold ${isDarkMode? "dark:text-gray-200" : "text-gray-800"}`} >
            <span ref={typedElement}></span>
          </h3>
          <p className={`text-gray-600  text-lg leading-relaxed ${isDarkMode ? 'dark:text-gray-200' : ""}`}>
            Vous avez une question technique, créative ou stratégique ? Posez-la sur ClipNest.
            Notre communauté de passionnés et d’experts est là pour vous aider à apprendre, progresser et partager votre savoir.
          </p>
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition cursor-pointer"
            onClick={handleClick}
          >
            Commencer maintenant
          </button>
        </div>
      </main>
    </>
  );
};

export default LandingPage;
