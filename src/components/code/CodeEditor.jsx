import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { useDarkMode } from '../../context/DarkModeContext.jsx'
import { useUser } from '../../context/UserContext.jsx'
import { db } from '../../services/firebaseconfig'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { FiChevronDown } from 'react-icons/fi'
import { languages, themes } from '../../utils/languagesAndThemesEditor'

const CodeEditor = () => {
  const [detailsIsOpen, setDetailsIsOpen] = useState(false)
  const [commentaire, setCommentaire] = useState('')
  const [code, setCode] = useState('// Commence ici...')
  const [language, setLanguage] = useState('javascript')
  const [theme, setTheme] = useState('vs-dark')
  const { isDarkMode } = useDarkMode()
  const { user } = useUser()
  const navigate = useNavigate()
  const handlSendCode = async () => {
    try {
      await addDoc(collection(db, 'snippets'), {
        idUser: user?.uid,
        nom: user?.nom,
        prenom: user?.prenom,
        code: code,
        language: language,
        commentaireUser: commentaire,
        date: serverTimestamp(),
      })
      setCode('// Commence ici...')
      setCommentaire('')
      toast.success('code envoyé avec succé')
      navigate('/blog-de-code')
    } catch {
      toast.error('une erreur est surveni veillez reesayer !')
    }
  }

  return (
    <div className="bg-transparent w-full h-full max-w-3xl mx-auto  rounded-xl ">
      <div className="flex flex-col md:flex-row gap-4 mb-4 ">
        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          className={`${
            isDarkMode
              ? 'bg-gray-800 text-gray-100'
              : 'bg-gray-300 text-gray-900'
          } p-2 rounded`}
        >
          {languages.map(lang => (
            <option key={lang.id} value={lang.id}>
              {lang.label}
            </option>
          ))}
        </select>
        <select
          value={theme}
          onChange={e => setTheme(e.target.value)}
          className={` ${
            isDarkMode
              ? 'bg-gray-800 text-gray-100'
              : 'bg-gray-300 text-gray-900'
          } p-2 rounded`}
        >
          {themes.map(th => (
            <option key={th.id} value={th.id}>
              {th.label}
            </option>
          ))}
        </select>
      </div>

      <Editor
        height={400} // hauteur dynamique
        language={language} // tu peux changer (voir liste plus bas)
        theme={theme} // ou "light", "hc-black", etc.
        value={code}
        onChange={value => setCode(value)}
        options={{
          fontSize: 14,
          minimap: { enabled: true }, // petite carte de code à droite
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
      <details
        open={detailsIsOpen}
        onClick={() => setDetailsIsOpen(!detailsIsOpen)}
        className={`w-full max-w-md mx-auto  rounded-2xl shadow-lg p-4 transition-all duration-300 ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'
        }`}
      >
        <summary
          className={`cursor-pointer text-lg font-semibold  flex items-center justify-between list-none${
            isDarkMode ? 'text-white' : 'text-black'
          }`}
        >
          <span>Écrire un commentaire</span>
          <FiChevronDown
            className={`w-5 h-5 ml-2 transform transition-transform duration-300 ${
              detailsIsOpen ? 'rotate-180' : ''
            } ${isDarkMode ? 'text-white' : 'text-base'}`}
          />
        </summary>
        <div className="mt-4">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all duration-200"
            rows="5"
            placeholder="Votre message..."
            onChange={e => setCommentaire(e.target.value)}
            value={commentaire}
          ></textarea>
        </div>
      </details>
      <button
        type="button"
        className=" mt-4 inline-block bg-blue-600 text-white
        px-3 py-1 rounded-lg hover:bg-blue-700 transition cursor-pointer"
        onClick={handlSendCode}
      >
        publier le code
      </button>
    </div>
  )
}


export default CodeEditor
