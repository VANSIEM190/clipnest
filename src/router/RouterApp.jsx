import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

import { DarkModeProvider } from "../Context/DarkModeContext";
import { UserProvider } from "../Context/UserContext";
import Loader from "../components/Loader";

// Lazy loading des pages
const LadingPage = lazy(() => import("../pages/LadingPage"));
const Apropos = lazy(() => import("../pages/Apropos"));
const FormulaireInscription = lazy(() => import("../components/Formulaire"));
const LoginForm = lazy(() => import("../components/ConnectionForm"));
const Home = lazy(() => import("../pages/Home"));
const ErrorPage = lazy(() => import("../pages/ErrorPage"));

const RouterApp = () => {

  return (
    <DarkModeProvider>
      <UserProvider>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<LadingPage />} />
            <Route path="/Àpropos" element={<Apropos />} />
            <Route path="/inscription" element={<FormulaireInscription />} />
            <Route path="/connexion" element={<LoginForm />} />
            <Route path="/salon" element={<Home />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Suspense>
      </UserProvider>
    </DarkModeProvider>
  );
};

export default RouterApp;
