import { useState } from 'react'
import { useUser } from '../Context/UserContext'
import { signOut } from 'firebase/auth'
import { auth } from '../services/firebaseconfig'
import { useNavigate } from 'react-router-dom'
import ProfilsUsers from '../pages/profilsUsers'
import useUserQuestions from '../hooks/useUserQuestion'

const UserProfil = () => {
  const { user } = useUser()
  const navigation = useNavigate()
  const { questions, loading } = useUserQuestions()
  const [userInformations] = useState({
    nom: user?.nom,
    prenom: user?.prenom,
    id: user?.uid,
    email: user?.email,
    niveau: user?.niveau,
    nationalite: user?.nationalite,
    createdAt: user?.createdAt,
  })

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigation('/')
    } catch (error) {
      console.error('Erreur de déconnexion :', error)
    }
  }

  return (
    <ProfilsUsers
      informationsUser={userInformations}
      messagesUser={questions}
      loading={loading}
      handleLogout={handleLogout}
    />
  )
}

export default UserProfil
