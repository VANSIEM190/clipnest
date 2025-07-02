import { useDarkMode } from '../Context/DarkModeContext'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import CodeEditor from './CodeEditor'
import { ToastContainer } from 'react-toastify'

const SnippetsCode = () => {
  const { isDarkMode } = useDarkMode()
  return (
    <>
      <Navbar />
      <Sidebar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div
        className={`${
          isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-900'
        } w-screen min-h-screen flex justify-center items-start pb-2 max-sm:justify-end`}
      >
        <div className="p-2  w-2/4 h-[70%] mt-5 max-sm:w-[80%] max-sm:mt-5">
          <CodeEditor />
        </div>
      </div>
    </>
  )
}

export default SnippetsCode
