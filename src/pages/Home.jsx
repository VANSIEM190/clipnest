import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { UserProvider } from "../Context/UserContext";
import { useDarkMode } from "../Context/DarkModeContext";
import useStateScreen from "../hooks/UseSizeScreen";
import ContactCard from '../components/AllUsers'
import RichTextEditor from '../components/QuestionsUsers'
import UsersMessages from '../components/usersMessages'
import UserProfil from '../components/userProfil'
import Seo from '../components/Seo'

const Home = () => {
  const { isDarkMode } = useDarkMode()
  const isSmallScreen = useStateScreen()
  const homeClass = isDarkMode
    ? 'bg-gray-900 text-white'
    : 'bg-gray-100 text-black'
  const [activeSection, setActiveSection] = useState([])
  const [isdefaultSection, setIsdefaultSection] = useState(true)
  const sections = ['home', 'profil', 'users', 'questions']

  const handleNavigationSection = section => {
    setActiveSection(sections.includes(section) ? section : 'home')
    setIsdefaultSection(false)
  }

  return (
    <div className={`${homeClass} min-h-screen flex flex-col`}>
      <UserProvider>
        <Navbar />

        <div className="w-screen  ">
          <Sidebar onNavigate={handleNavigationSection} />
          <div
            className={` w-[97%] overflow-auto ${
              isSmallScreen ? ' mx-auto' : 'float-right'
            }`}
          >
            {isdefaultSection && <UsersMessages />}
            {activeSection.includes('profil') && <UserProfil />}
            {activeSection.includes('users') && <ContactCard />}
            {activeSection.includes('questions') && <RichTextEditor />}
            {activeSection.includes('home') && <UsersMessages />}
          </div>
        </div>
      </UserProvider>
      <Seo
        title="Salon - Discussions éducatives sur ClipNest"
        description="Rejoignez les discussions dans le salon de ClipNest, un lieu d'échange d'idées éducatives."
        url="https://clipnest-zeta.vercel.app/salon"
      />
    </div>
  )
}

export default Home;
