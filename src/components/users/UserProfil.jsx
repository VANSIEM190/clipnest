import { useEffect, useState } from 'react'
import { useUser } from '../../context/UserContext'
import { signOut } from 'firebase/auth'
import { where, collection, getDocs, query } from 'firebase/firestore'
import { auth, db } from '../../services/firebaseconfig'
import { useNavigate } from 'react-router-dom'
import ProfilsUsers from './ProfilsUsers'
import {toast } from 'react-toastify'


const UserProfil = () => {
  const { user } = useUser()
  const navigation = useNavigate()
  const [userMessages, setUserMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [userInformations] = useState({
    nom: user?.nom,
    prenom: user?.prenom,
    id: user?.uid,
    email: user?.email,
    niveau: user?.niveau,
    nationalite: user?.nationalite,
    createdAt: user?.createdAt,
  })

  useEffect(() => {
    const fetchMessageUser = async () => {
      setLoading(true)
      try {
        const queryMessages =  query(
          collection(db, 'messages'),
          where('userId', '==', user?.uid),
        )
        const querySnapshotMessage = await getDocs(queryMessages)
        const messagesUser = querySnapshotMessage.docs.map(message => ({
          id: message.id,
          ...message.data(),
        }))
        setUserMessages(messagesUser)
      } catch {
        toast.error('erreur lors de la récupération des données')
      } finally {
        setLoading(false)
      }
    }
    fetchMessageUser()
  }, [user?.uid , userInformations.createdAt])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigation('/')
    } catch (error) {
      console.error('Erreur de déconnexion :', error)
    }
  }

  return (
    <>
      <ProfilsUsers
        informationsUser={userInformations}
        messagesUser={userMessages}
        loading={loading}
        handleLogout={handleLogout}
      />
    </>
  )
}

export default UserProfil
