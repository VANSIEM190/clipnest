import {Routes,Route} from "react-router-dom";
import PageChargement from "./PageChargement";

const RouterApp = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<PageChargement />} />
    </Routes>
    </>
  );
}

export  default RouterApp;