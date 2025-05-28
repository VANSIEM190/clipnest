import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Typed from "typed.js";
import Navbar from "../components/Navbar";
import { useDarkMode } from "../Context/DarkModeContext";
import { UserProvider, useUser } from "../Context/UserContext";
import Seo from "../components/Seo";

const LandingPage = () => {
  const { isDarkMode } = useDarkMode();
  const { initials, isLoading } = useUser()
  const typedElement = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!typedElement.current) {
      console.warn('typedElement is null')
      return
    }

    const typed = new Typed(typedElement.current, {
      strings: [
        'Posez vos questions, partagez vos idées 💬',
        'Collaborez avec une communauté créative 🌟',
      ],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2000,
      loop: true,
    })

    return () => typed.destroy()
  }, [])

  const handleClick = () => {
    navigate(initials ? '/salon' : '/connexion')
  }

  return (
    <>
      <UserProvider>
        <Navbar />
      </UserProvider>

      <main
        className={`flex items-center justify-center min-h-screen px-2 sm:px-6 py-10 
        ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}
      >
        <div className="max-w-3xl w-full text-center space-y-6">
          <h1
            className={`text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight break-words`}
          >
            <span ref={typedElement}></span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg  text-wrap break-words px-2 sm:px-6">
            Vous avez une question technique, créative ou stratégique ? Posez-la
            sur ClipNest. Notre communauté de passionnés et d’experts est là
            pour vous aider à apprendre, progresser et partager votre savoir.
          </p>

          <button
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-xl transition duration-200 cursor-pointer"
            onClick={handleClick}
            disabled={isLoading}
          >
            {isLoading
              ? 'Chargement...'
              : initials
              ? 'Accéder au salon'
              : 'Rejoindre la communauté'}
          </button>
        </div>
      </main>

      <Seo
        title="ClipNest - Apprentissage collaboratif"
        description="Bienvenue sur ClipNest, le forum éducatif pour poser des questions et partager vos connaissances."
        url="https://clipnest-zeta.vercel.app"
      />
    </>
  )
};

export default LandingPage;
