// router/RouterApp.jsx
import { Suspense, lazy, useEffect , useState} from "react";
import { Routes, Route } from "react-router-dom";

import {Loader} from "../components/Loader";
import { requestFCMToken , onMessageListener } from "../utils/firebase-utils.js";


// Lazy loading des pages
const LadingPage = lazy(() => import("../pages/LadingPage"));
const Apropos = lazy(() => import("../pages/Apropos"));
const FormulaireInscription = lazy(() => import("../components/Formulaire"));
const LoginForm = lazy(() => import("../components/ConnectionForm"));
const Home = lazy(() => import("../pages/Home"));
const ErrorPage = lazy(() => import("../pages/ErrorPage"));
const UsersProfileDetails = lazy(() => import("../components/usersProfil"));
const MessageResponses = lazy(()=> import("../components/MessageResponses.jsx"))

const RouterApp = () => {
  
  const [fcmToken , setFcmToken] = useState(null);  

  useEffect(() => {
    const requestPermission = async () => {
      const token = await requestFCMToken();
      if (token) {
        setFcmToken(token);
      }
    };
    requestPermission();
  }, []);

onMessageListener()
  .then((payload) => {
    console.log("Message reçu :", payload)
  })
  .catch((err) => console.log("Erreur de réception du message :", err));

  

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<LadingPage />} />
        <Route path="/Àpropos" element={<Apropos />} />
        <Route path="/inscription" element={<FormulaireInscription />} />
        <Route path="/connexion" element={<LoginForm />} />
        <Route path="/salon" element={<Home />} />
        <Route path="/profil/:id" element={<UsersProfileDetails />} />
        <Route path="/message/:messageId" element={<MessageResponses />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Suspense>
  );
};

export default RouterApp;
