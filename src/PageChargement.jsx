import React from 'react';
import { Link } from 'react-router-dom';
import  logoApp  from './assets/image.png';

const PageChargement = () => {
  return (
    <>
      <div className="w-screen h-screen flex flex-col justify-center items-center bg-gray-100">
        <img src={logoApp} alt="logo-app" />
        <h1 className="text-3xl  font-bold mt-4">SnapLoop</h1>
        <Link to="/connexion" >
        <button type="button" className="bg-gray-800 text-white p-3 rounded-md cursor-pointer  mt-4">
          Contunuer
          </button>
        </Link>
      </div>
    </>
  );
};

export default PageChargement;