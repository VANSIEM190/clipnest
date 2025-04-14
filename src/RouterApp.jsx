import { lazy, Suspense } from "react";
import { Routes, Route} from "react-router-dom";
import { DarkModeProvider } from "./Context/DarkModeContext";
import { UserProvider } from "./Context/UserContext";
const LadingPage = lazy(() => import("./LadingPage"));
const Apropos = lazy(() => import("./Apropos"));
const FormulaireInscription = lazy(() => import("./Formulaire"));
const Home = lazy(() => import("./Home"));

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