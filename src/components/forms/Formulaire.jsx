import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { auth, db } from '../../services/firebaseconfig'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { useDarkMode } from '../../context/DarkModeContext.jsx'
import { FileurLoader } from '../common'
import { Navbar } from '../layout'
import { ToastContainer, toast } from 'react-toastify'

const validationSchema = Yup.object({
  nom: Yup.string()
    .min(4, 'Le nom est trop court')
    .max(15, 'Le nom est trop long')
    .required('Le nom est requis'),
  prenom: Yup.string()
    .min(4, 'Le prénom est trop court')
    .max(15, 'Le prénom est trop long')
    .required('Le prénom est requis'),
  email: Yup.string()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email invalide')
    .required("L'email est requis"),
  niveau: Yup.string()
    .min(3, 'La taille du texte est  trop courte')
    .max(15, 'La taille du texte est  trop longue')
    .required("Le niveau d'étude est requis"),
  nationalite: Yup.string()
    .min(3, 'La taille du texte est  trop courte')
    .max(20, 'La taille du texte est  trop longue')
    .required('La nationalité est requise'),
  password: Yup.string()
    .min(8, 'Minimum 8 caractères')
    .matches(/[a-z]/, 'Une minuscule requise')
    .matches(/[A-Z]/, 'Une majuscule requise')
    .matches(/\d/, 'Un chiffre requis')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Un caractère spécial requis')
    .required('Le mot de passe est requis'),
})

const initialValues = {
  nom: '',
  prenom: '',
  email: '',
  niveau: '',
  nationalite: '',
  password: '',
}

// Liste des champs du formulaire
const FormulaireList = [
  { name: 'nom', label: 'Nom' },
  { name: 'prenom', label: 'Prénom' },
  { name: 'email', label: 'Email', type: 'email' },
  {
    name: 'niveau',
    label: "Niveau d'étude",
    placeholder: 'Ex: Bac, Licence, Master...',
  },
  { name: 'nationalite', label: 'Nationalité' },
  { name: 'password', label: 'Mot de passe', type: 'password' },
]

const FormulaireInscription = () => {
  const { isDarkMode } = useDarkMode()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (values, { resetForm }) => {
    setLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      )
      const user = userCredential.user

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        nom: values.nom,
        prenom: values.prenom,
        email: values.email,
        niveau: values.niveau,
        nationalite: values.nationalite,
        createdAt: serverTimestamp(),
      })
      setLoading(false)
      navigate('/salon')
      toast.success('Inscription réussie !')
      resetForm()
    } catch (error) {
      if (
        error === 'FirebaseError: Firebase: Error (auth/email-already-in-use).'
      ) {
        toast.error("Erreur :  l'email est déjà utilisé !")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ToastContainer />
      <Navbar />
      <div
        className={`flex items-center justify-center min-h-screen ${
          isDarkMode ? 'dark:bg-gray-900' : 'bg-gray-100'
        }`}
      >
        {loading ? (
          <FileurLoader />
        ) : (
          <div className="w-2/4 max-sm:w-5/6 mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6 text-indigo-600">
              Inscription
            </h2>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              <Form className="space-y-5">
                {FormulaireList.map(
                  ({ name, label, type = 'text', placeholder = '' }) => (
                    <div key={name}>
                      <label
                        htmlFor={name}
                        className="block text-gray-700 font-medium mb-1"
                      >
                        {label}
                      </label>
                      <Field
                        name={name}
                        type={type}
                        placeholder={placeholder}
                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:border-blue-400"
                      />
                      <ErrorMessage
                        name={name}
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  )
                )}

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:bg-blue-400 cursor-pointer"
                  disabled={loading}
                >
                  {loading ? 'Chargement...' : "S'inscrire"}
                </button>
              </Form>
            </Formik>
          </div>
        )}
      </div>
    </>
  )
}

export default FormulaireInscription
