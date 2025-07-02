import React, { useState } from 'react'
import Editor from '@monaco-editor/react'
import { useDarkMode } from '../Context/DarkModeContext'
import { db } from '../services/firebaseconfig'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { useUser } from '../Context/UserContext'

// Liste des langages avec labels
const languages = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java' },
  { id: 'php', label: 'PHP' },
  { id: 'c', label: 'C' },
  { id: 'cpp', label: 'C++' },
  { id: 'csharp', label: 'C#' },
  { id: 'css', label: 'CSS' },
  { id: 'html', label: 'HTML' },
  { id: 'sql', label: 'SQL' },
  { id: 'json', label: 'JSON' },
  { id: 'bash', label: 'Bash' },
  { id: 'go', label: 'Go' },
  { id: 'rust', label: 'Rust' },
  { id: 'kotlin', label: 'Kotlin' },
  { id: 'swift', label: 'Swift' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'dart', label: 'Dart' },
  { id: 'scala', label: 'Scala' },
  { id: 'ruby', label: 'Ruby' },
  { id: 'perl', label: 'Perl' },
  { id: 'lua', label: 'Lua' },
  { id: 'yaml', label: 'YAML' },
]

const themes = [
  { id: 'vs', label: 'light' },
  { id: 'vs-dark', label: 'dark' },
  { id: 'hc-black', label: 'contraste élevé' },
]

const CodeEditor = () => {
  const [code, setCode] = useState('// Commence ici...')
  const [language, setLanguage] = useState('javascript')
  const [theme, setTheme] = useState('vs-dark')
  const { isDarkMode } = useDarkMode()
  const { user } = useUser()

  const handlSendCode = async () => {
    try {
      await addDoc(collection(db, 'snippets'), {
        nom: user?.nom,
        prenom: user?.prenom,
        code: code,
        language: language,
        date: serverTimestamp(),
      })
      toast.success('code envoyé avec succé')
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
          minimap: { enabled: false }, // petite carte de code à droite
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
      <button
        type="button"
        className=" mt-4 inline-block bg-indigo-600 text-white
        px-3 py-1 rounded-lg hover:bg-indigo-700 transition cursor-pointer"
        onClick={handlSendCode}
      >
        publier le code
      </button>
    </div>
  )
}

export default CodeEditor
