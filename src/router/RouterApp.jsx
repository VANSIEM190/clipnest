// router/RouterApp.jsx
import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { onMessageListener } from '../utils/firebase-utils.js'
import { useFCMToken } from '../hooks'

// components
import {
  FormulaireInscription,
  LoginForm,
  RichTextEditor,
  SnippetsCode,
  Loader,
} from '../components'

// context
import { useNetworkStatus } from '../context/NetworkStatusContext.jsx'

// pages
import OfflineStatus from '../pages/OfflineStatus.jsx'
import ErrorPage from '../pages/ErrorPage'
import Apropos from '../pages/Apropos'

// Lazy loading des pages
const LadingPage = lazy(() => import('../pages/LadingPage'))
const UsersMessages = lazy(() =>
  import('../components/messages/UsersMessages.jsx')
)
const ContactCard = lazy(() => import('../components/users/AllUsers.jsx'))
const UserProfil = lazy(() => import('../components/users/UserProfil.jsx'))
const ReplyMessage = lazy(() =>
  import('../components/messages/ReplyMessage.jsx')
)
const SelectedUser = lazy(() => import('../components/users/SelectedUser.jsx'))
const AfficheCode = lazy(() => import('../components/code/AfficheCode.jsx'))
const SectionDeCommentaire = lazy(() =>
  import('../components/comments/SectionDeCommentaire.jsx')
)

const RouterApp = () => {
  const { isOnline, isOnlineStatus } = useNetworkStatus()
  const { fcmToken, error: fcmError } = useFCMToken()

  useEffect(() => {
    // Écouter les messages reçus
    onMessageListener()
      .then(payload => {
        console.log('Message reçu :', payload)
        alert(payload.title)
      })
      .catch(err => console.log('Erreur de réception du message :', err))
  }, [])

  // Log pour debug
  useEffect(() => {
    if (fcmToken) {
      console.log('Token FCM disponible:', fcmToken)
    }
    if (fcmError) {
      console.error('Erreur FCM:', fcmError)
    }
  }, [fcmToken, fcmError])

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
          <Route path="/snippets" element={<SnippetsCode />} />
          <Route path="/blog-de-code" element={<AfficheCode />} />
          <Route path="/mon-profil" element={<UserProfil />} />
          <Route path="/profil/:id" element={<SelectedUser />} />
          <Route path="/message/:messageId" element={<ReplyMessage />} />
          <Route path="/code-id/:codeId" element={<SectionDeCommentaire />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      ) : (
        <OfflineStatus />
      )}
    </Suspense>
  )
}

export default RouterApp;
