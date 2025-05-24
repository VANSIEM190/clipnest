import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { auth, db } from "../services/firebaseconfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../Context/DarkModeContext";
import Seo from "./Seo";

const validationSchema = Yup.object({
  nom: Yup.string()
    .min(2, "Le nom est trop court")
    .max(30, "Le nom est trop long")
    .required("Le nom est requis"),
  prenom: Yup.string()
    .min(2, "Le prénom est trop court")
    .max(30, "Le prénom est trop long")
    .required("Le prénom est requis"),
  email: Yup.string()
  .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email invalide")
  .required("L'email est requis")

    .required("L'email est requis"),
  niveau: Yup.string().required("Le niveau d'étude est requis"),
  nationalite: Yup.string().required("La nationalité est requise"),
  password: Yup.string()
    .min(8, "Minimum 8 caractères")
    .matches(/[a-z]/, "Une minuscule requise")
    .matches(/[A-Z]/, "Une majuscule requise")
    .matches(/\d/, "Un chiffre requis")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Un caractère spécial requis")
    .required("Le mot de passe est requis")
});

const initialValues = {
  nom: "",
  prenom: "",
  email: "",
  niveau: "",
  nationalite: "",
  password: ""
};

// Liste des champs du formulaire
const FormulaireList = [
  { name: "nom", label: "Nom" },
  { name: "prenom", label: "Prénom" },
  { name: "email", label: "Email", type: "email" },
  { name: "niveau", label: "Niveau d'étude", placeholder: "Ex: Bac, Licence, Master..." },
  { name: "nationalite", label: "Nationalité" },
  { name: "password", label: "Mot de passe", type: "password" }
];

const FormulaireInscription = () => {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const onSubmit = async (values, { resetForm }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        nom: values.nom,
        prenom: values.prenom,
        email: values.email,
        niveau: values.niveau,
        nationalite: values.nationalite,
        createdAt: new Date()
      });
      setLoading(false);
      navigate("/salon")
      alert("Inscription réussie !");
      resetForm();
    } catch (error) {
      if(error === "FirebaseError: Firebase: Error (auth/email-already-in-use)."){
      alert("Erreur :  l'email est déjà utilisé !");
    }}
  };

  return (
    <>
    <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? "dark:bg-gray-900" : "bg-gray-200"}`}>
    <div className="w-2/4 max-sm:w-5/6 mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-indigo-600">Inscription</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        <Form className="space-y-5">
          {
          FormulaireList.map(({ name, label, type = "text", placeholder = "" }) => (
            <div key={name}>
              <label htmlFor={name} className="block text-gray-700 font-medium mb-1">{label}</label>
              <Field
                name={name}
                type={type}
                placeholder={placeholder}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:border-blue-400"
              />
              <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
            </div>
          ))}

          <button 
          type="submit" 
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
            disabled={loading}
            {loading ? "Chargement..." : "S'inscrire"}
          </button>
        </Form>
      </Formik>
    </div>
    </div>

    <Seo
      title="Inscription - ClipNest"
      description="Créez un compte sur ClipNest pour commencer à apprendre et échanger."
      url="https://clipnest-zet.vercel.app/inscription"
    />
  
    </>
  );
};

export default FormulaireInscription;
