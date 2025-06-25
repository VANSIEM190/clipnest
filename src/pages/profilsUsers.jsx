import { useDarkMode } from '../Context/DarkModeContext'
import { stringToColor } from '../utils/StringToColor'
import formatDate from '../utils/formatDate'
import { useNavigate } from 'react-router-dom'
import ButtonPagination from '../components/ButtonPagination'
import usePagination from '../hooks/Pagination'
import useSortedQuestions from '../hooks/useSortedQuestions'
import { useUser } from '../Context/UserContext'
import { FileurLoader } from '../components/Loader'
import { FaSignOutAlt } from 'react-icons/fa'
import { IoReturnUpBack } from 'react-icons/io5'
import { UserStatus, UserLastSeen } from '../components/AutreUsersStatus'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

const ProfilsUsers = ({
  informationsUser,
  messagesUser,
  loading,
  handleLogout,
}) => {
  const { isDarkMode } = useDarkMode()
  const { user } = useUser()
  const bgColor = stringToColor(
    `${informationsUser.prenom} ${informationsUser.nom}`
  )
  const navigate = useNavigate()
  const QUESTIONS_PER_PAGE = 5
  const sortedMessages = useSortedQuestions(messagesUser) // messages triés

  // la pagination
  const {
    currentPage,
    totalPages,
    currentData: paginatedMessages,
    goToNextPage,
    goToPreviousPage,
    goToPage,
  } = usePagination(sortedMessages, QUESTIONS_PER_PAGE)

  return (
    <>
      <Navbar />
      <Sidebar />
      <div
        className={`min-w-screen min-h-screen p-4 sm:p-6 flex flex-col items-center gap-6 ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
        }`}
      >
        {/* Carte Profil */}
        {loading ? (
          <FileurLoader />
        ) : (
          <div
            className={`w-full max-w-2xl rounded-2xl shadow-lg p-6 sm:p-8 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className="relative w-10 h-10 sm:w-20 sm:h-20  max-sm:text-base rounded-full flex items-center justify-center text-2xl font-bold text-white shrink-0"
                style={{ backgroundColor: bgColor }}
              >
                {informationsUser.prenom?.charAt(0).toUpperCase()}
                {informationsUser.nom?.charAt(0).toUpperCase()}
                <div className="absolute sm:-bottom-1 sm:right-3.5 translate-x-1/2 -translate-y-1/2 -bottom-1.5 right-1">
                  <UserStatus userId={informationsUser.id} />
                </div>
              </div>
              <div className="overflow-hidden">
                <h2 className="text-2xl font-semibold max-sm:text-base truncate">{`${informationsUser.prenom} ${informationsUser.nom}`}</h2>
                <div className="text-sm text-gray-500 dark:text-gray-300 sm:text-base truncate">
                  <UserLastSeen uidUser={informationsUser.id} />
                </div>
              </div>
            </div>
            {/* Informations profil utilisateur */}
            <div className="mt-6 space-y-4 text-sm sm:text-base">
              <div className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-4">
                <span className="font-medium">Email :</span>
                <span className="text-right sm:text-left break-all">
                  {informationsUser.email}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-4">
                <span className="font-medium">Niveau d'étude :</span>
                <span className="text-right sm:text-left">
                  {informationsUser.niveau || 'Non renseigné'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-4">
                <span className="font-medium">Nationalité :</span>
                <span className="text-right sm:text-left">
                  {informationsUser.nationalite || 'Non renseignée'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-4">
                <span className="font-medium">Inscrit le :</span>
                <span className="text-right sm:text-left">
                  {informationsUser.createdAt
                    ? formatDate(informationsUser.createdAt)
                    : 'Date inconnue'}
                </span>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                type="button"
                title="Retour"
                onClick={() => navigate(-1)}
                className="mt-4 p-3  text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md cursor-pointer"
              >
                <IoReturnUpBack />
              </button>
              {user?.uid === informationsUser.id && (
                <button
                  type="button"
                  title="Déconnexion"
                  onClick={handleLogout}
                  className="mt-4 p-3  text-sm bg-red-500 hover:bg-red-600 text-white rounded-md cursor-pointer"
                >
                  <FaSignOutAlt />
                </button>
              )}
            </div>
          </div>
        )}
        {/* Liste des Questions / Messages */}
        <div className="w-full max-w-2xl">
          <h3 className="text-xl font-semibold mb-4">Ses Messages</h3>
          {loading ? (
            <FileurLoader />
          ) : messagesUser.length > 0 ? (
            <>
              <ul className="space-y-3">
                {paginatedMessages.map(q => (
                  <li
                    key={q.id}
                    className={`p-4 rounded-xl shadow flex flex-col  justify-center items-center ${
                      isDarkMode ? 'bg-gray-800' : 'bg-white'
                    }`}
                  >
                    <div className="text-centertext-base break-words">
                      {q.message}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-right">
                      Posté : {formatDate(q.timestamp)}
                    </div>
                  </li>
                ))}
              </ul>

              <ButtonPagination
                goToPreviousPage={goToPreviousPage}
                goToPage={goToPage}
                currentPage={currentPage}
                goToNextPage={goToNextPage}
                totalPages={totalPages}
              />
            </>
          ) : (
            <p className="text-sm text-gray-500">Aucun message trouvé.</p>
          )}
        </div>
      </div>
    </>
  )
}

export default ProfilsUsers
