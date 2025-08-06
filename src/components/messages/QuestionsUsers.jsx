import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { db } from '../../services/firebaseconfig'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import useStateScreen from '../../hooks/UseSizeScreen'
import { useDarkMode, useUser } from '../../context'
import { toast } from 'react-toastify'
import { Navbar, Sidebar } from '../layout'
import {
  sendPushNotification,
  sendLocalNotification,
} from '../../utils/notification-utils'

const RichTextEditor = () => {
  const [content, setContent] = useState('')
  const [disabled, setdisabled] = useState(false)
  const isSmallScreen = useStateScreen()
  const { user } = useUser()
  const { isDarkMode } = useDarkMode()
  const navigate = useNavigate()

  const handleSendMessage = async () => {
    setdisabled(true)
    if (!user?.uid) {
      toast.error('Veuillez vous connecter pour envoyer un message')
      return
    }

    if (content.trim() === '') {
      toast.error("Veuillez entrer un message avant de l'envoyer")
      return
    }

    try {
      // 1. Ajouter dans Firestore
      await addDoc(collection(db, 'messages'), {
        userId: user.uid,
        name: user?.fullName,
        nameProfil: user?.initials,
        email: user?.email,
        message: content,
        timestamp: serverTimestamp(),
      })

      setContent('')
      navigate('/salon')

      // 2. Envoyer la notification locale
      sendLocalNotification(user?.fullName, content)

      // 3. Envoyer la notification push via le backend
      if (user?.uid) {
        const pushSuccess = await sendPushNotification(
          user.fcmToken,
          user?.fullName,
          content
        )

        if (pushSuccess) {
          toast.success(
            `
          ${user?.fullName} a été notifié avec succès.
          ${content}
          `
          )
        } else {
          toast.warning('Message envoyé mais notification push échouée.')
        }
      } else {
        toast.warning('Token FCM non disponible pour les notifications push.')
      }

      setdisabled(false)
    } catch (error) {
      console.error('Erreur :', error)
      toast.error("Erreur lors de l'envoi du message ou de la notification.")
    } finally {
      setdisabled(false)
    }
  }

  return (
    <>
      <Navbar />
      <Sidebar />
      <div
        className={`${
          isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'
        }`}
      >
        <div className="flex justify-center items-center w-full h-screen">
          <div
            className={`mx-auto my-8 p-4 rounded-lg shadow-md max-xm:mr-3 ${
              isSmallScreen ? 'w-3/4' : 'w-2/4'
            }`}
          >
            <h2 className="text-xl font-bold mb-4 text-center">
              Posez votre problème
            </h2>
            <textarea
              className="resize-none w-full h-36 p-2 border border-gray-400 rounded-2xl"
              placeholder="Écrire un message ici..."
              onChange={e => setContent(e.target.value)}
              value={content}
            ></textarea>
            <div className="flex justify-center mt-4">
              <button
                onClick={handleSendMessage}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg cursor-pointer  hover:bg-blue-600 transition duration-300 disabled:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={disabled}
              >
                {disabled ? 'chargement...' : 'Envoyer le message'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RichTextEditor