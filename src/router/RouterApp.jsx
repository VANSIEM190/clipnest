// router/RouterApp.jsx
import { Suspense, lazy, useEffect , useState} from "react";
import { Routes, Route } from "react-router-dom";

import { Loader } from '../components/common/Loader'
import { requestFCMToken, onMessageListener } from '../utils/firebase-utils.js'
import { useNetworkStatus } from '../context/networkStatusContext.jsx'
import OfflineStatus from '../pages/OfflineStatus.jsx'
import FormulaireInscription from '../components/forms/Formulaire'
import LoginForm from '../components/forms/ConnectionForm.jsx'
import ErrorPage from '../pages/ErrorPage'
import Apropos from '../pages/Apropos'
import RichTextEditor from '../components/messages/QuestionsUsers.jsx'
import SnippetsCode from '../components/code/SnippetsCode.jsx'

// Lazy loading des pages
const LadingPage = lazy(() => import('../pages/LadingPage'))
const UsersMessages = lazy(() =>
  import('../components/messages/UsersMessages.jsx')
)
const ContactCard = lazy(() => import('../components/users/AllUsers.jsx'))
const UserProfil = lazy(() => import('../components/users/UserProfil.jsx'))
const ReplyMessage = lazy(() => import('../components/messages/ReplyMessage'))
const SelectedUser = lazy(() => import('../components/users/SelectedUser'))
const AfficheCode = lazy(() => import('../components/code/AfficheCode.jsx'))
const SectionDeCommentaire = lazy(() =>
  import('../components/comments/SectionDeCommentaire')
)

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
