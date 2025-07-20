import React, { useEffect, useState } from 'react'
import { useParams  , useNavigate} from 'react-router-dom'
import {
  collection,
  doc,
  getDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { db, auth } from '../../services/firebaseconfig'
import ProfilsUsers from './profilsUsers'
import { toast } from 'react-toastify'

const SelectedUser = () => {
  const { id } = useParams()
  const navigation = useNavigate()

  const [userData, setUserData] = useState({})
  const [userMessages, setUserMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserAndMessages = async () => {
      try {
        // Récupérer les infos de l'utilisateur
        const userRef = doc(db, 'users', id)
        const userSnap = await getDoc(userRef)
        if (userSnap.exists()) {
          setUserData({
            id: userSnap.id,
            nom: userSnap.data().nom,
            prenom: userSnap.data().prenom,
            email: userSnap.data().email,
            niveau: userSnap.data().niveau,
            nationalite: userSnap.data().nationalite,
            createdAt: userSnap.data().createdAt,
          })
        } else {
          setUserData(null)
        }

        // Récupérer les messages liés à cet utilisateur
        const messagesQuery = query(
          collection(db, 'messages'),
          where('userId', '==', id)
        )
        const querySnapshot = await getDocs(messagesQuery)
        const messages = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        setUserMessages(messages)
      } catch {
        toast.error('Erreur lors de la récupération :')
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndMessages()
  }, [id])

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
      {userData ? (
        <ProfilsUsers
          informationsUser={userData}
          userOnline={userData.id}
          messagesUser={userMessages}
          loading={loading}
          handleLogout={handleLogout}
        />
      ) : (
        <p>Utilisateur introuvable.</p>
      )}
    </>
  )
}

export default SelectedUser
