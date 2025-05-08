// router/RouterApp.jsx
import { Suspense, lazy, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Loader from "../components/Loader";
import useOnlineStatus from "../hooks/useOnelineStatus";

import { useUser } from '../Context/UserContext';
import { RequestNotificationPermission } from '../utils/requestNotificationPermission';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebaseconfig';

// Lazy loading des pages
const LadingPage = lazy(() => import("../pages/LadingPage"));
const Apropos = lazy(() => import("../pages/Apropos"));
const FormulaireInscription = lazy(() => import("../components/Formulaire"));
const LoginForm = lazy(() => import("../components/ConnectionForm"));
const Home = lazy(() => import("../pages/Home"));
const ErrorPage = lazy(() => import("../pages/ErrorPage"));
const UsersProfileDetails = lazy(() => import("../components/usersProfil"));

const RouterApp = () => {
  useOnlineStatus();
  const { user } = useUser();

  useEffect(() => {
    if (user?.uid) {
      RequestNotificationPermission().then((token) => {
        if (token) {
          setDoc(doc(db, 'tokens', user.uid), {
            uid: user.uid,
            token,
          });
        }
      });
    }
  }, [user]);

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<LadingPage />} />
        <Route path="/Àpropos" element={<Apropos />} />
        <Route path="/inscription" element={<FormulaireInscription />} />
        <Route path="/connexion" element={<LoginForm />} />
        <Route path="/salon" element={<Home />} />
        <Route path="/profil/:id" element={<UsersProfileDetails />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Suspense>
  );
};

export default RouterApp;
