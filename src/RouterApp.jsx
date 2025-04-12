import { lazy, Suspense } from "react";
import {Routes,Route} from "react-router-dom";

const App = lazy(() => import("./App"));
const PageChargement = lazy(() => import("./PageChargement"));
const Formulaire = lazy(() => import("./Formulaire"));
const FormulaireLogin = lazy(()=> import ("./formulaireLogin"));
const ImageProfilUser = lazy(() => import("./ImageProfilUser"));  
const Terms  = lazy(()=> import("./Termes"));


const RouterApp = () => {
  return (
    <>
    <Suspense fallback={
      <div className="w-screen h-screen flex justify-center items-center">
        <p>Loading.....</p>
      </div>
    }>
    <Routes>
      <Route path="/" element={<PageChargement />} />
      <Route path="/home" element={<App />} />
      <Route path="/connexion" element={<FormulaireLogin />} />
      <Route path="/inscription" element={<Formulaire />} />
      <Route path="/photo-profil" element={<ImageProfilUser />} />
      <Route path="/terms" element={<Terms />} />
    </Routes>
    </Suspense>
    </>
  );
}

export  default RouterApp;