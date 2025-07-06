import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebaseconfig"; 
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../Context/DarkModeContext";
import { Link } from "react-router-dom";


const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { isDarkMode } = useDarkMode()
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/salon')
    } catch (err) {
      console.error('Erreur de connexion :', err)
      setError('Email ou mot de passe incorrect.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div
        className={`flex items-center justify-center min-h-screen ${
          isDarkMode ? 'dark:bg-gray-900' : 'bg-gray-200'
        }`}
      >
        <div className="w-2/4 max-sm:w-5/6 mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-indigo-600">
            Connexion
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Champ Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:border-blue-400"
                required
              />
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-1"
              >
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:border-blue-400"
                required
              />
            </div>

            {/* Message d'erreur */}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

            {/* Bouton de connexion */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded cursor-pointer hover:bg-blue-700 disabled:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Chargement...' : 'Se connecter'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm">
            Pas encore de compte ?{' '}
            <Link to="/inscription" className="text-blue-600 hover:underline">
              S'inscrire ici
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default LoginForm;
