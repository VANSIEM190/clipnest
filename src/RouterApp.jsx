import {Routes,Route} from "react-router-dom";




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