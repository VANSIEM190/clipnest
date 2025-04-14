import { lazy, Suspense } from "react";
import { Routes, Route} from "react-router-dom";
import { DarkModeProvider } from "../Context/DarkModeContext";
import { UserProvider } from "../Context/UserContext";
const LadingPage = lazy(() => import("../pages/LadingPage"));
const Apropos = lazy(() => import("../pages/Apropos"));
const FormulaireInscription = lazy(() => import("../components/Formulaire"));
const Home = lazy(() => import("../pages/Home"));

const RouterApp = () => {
  return (
    <DarkModeProvider>
      <UserProvider>
  <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<LadingPage />} />
        <Route path="/Àpropos" element={<Apropos />} />
        <Route path="/inscription" element={<FormulaireInscription />} />
        <Route path="/salon" element={<Home />} />
      </Routes>
    </Suspense>
      </UserProvider>
    </DarkModeProvider>
  );
}

export default RouterApp;