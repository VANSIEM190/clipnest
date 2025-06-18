// router/RouterApp.jsx
import { Suspense, lazy, useEffect , useState} from "react";
import { Routes, Route } from "react-router-dom";

import {Loader} from "../components/Loader";
import { requestFCMToken , onMessageListener } from "../utils/firebase-utils.js";
import { useNetworkStatus } from '../Context/networkStatusContext.jsx'
import OfflineStatus from '../pages/OfflineStatus.jsx'
import FormulaireInscription from '../components/Formulaire'
import LoginForm from '../components/ConnectionForm'
import ErrorPage from '../pages/ErrorPage'
import Apropos from '../pages/Apropos'
import RichTextEditor from '../components/QuestionsUsers.jsx'

// Lazy loading des pages
const LadingPage = lazy(() => import('../pages/LadingPage'))
const UsersMessages = lazy(() => import('../components/usersMessages.jsx'))
const ContactCard = lazy(() => import('../components/AllUsers.jsx'))
const UserProfil = lazy(() => import('../components/userProfil.jsx'))
const ReplyMessage = lazy(() => import('../components/ReplyMessage'))
const SelectedUser = lazy(() => import('../components/SelectedUser'))

const RouterApp = () => {
  const [fcmToken, setFcmToken] = useState(null)
  const { isOnline, isOnlineStatus } = useNetworkStatus()

  useEffect(() => {
    const requestPermission = async () => {
      const token = await requestFCMToken()
      if (token) {
        setFcmToken(token)
      }
    }
    requestPermission()
  }, [])

  onMessageListener()
    .then(payload => {
      console.log('Message reçu :', payload)
    })
    .catch(err => console.log('Erreur de réception du message :', err))

  return (
    <Suspense fallback={<Loader />}>
      {isOnline && isOnlineStatus ? (
        <Routes>
          <Route path="/" element={<LadingPage />} />
          <Route path="/Àpropos" element={<Apropos />} />
          <Route path="/inscription" element={<FormulaireInscription />} />
          <Route path="/connexion" element={<LoginForm />} />
          <Route path="/salon" element={<UsersMessages />} />
          <Route path="/question-user" element={<RichTextEditor />} />
          <Route path="/profils-utilisateurs" element={<ContactCard />} />
          <Route path="/mon-profil" element={<UserProfil />} />
          <Route path="/profil/:id" element={<SelectedUser />} />
          <Route path="/message/:messageId" element={<ReplyMessage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      ) : (
        <OfflineStatus />
      )}
    </Suspense>
  )
}

export default RouterApp;
