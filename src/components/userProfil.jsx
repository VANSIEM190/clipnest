import { useUser } from "../Context/UserContext";
import { useDarkMode } from "../Context/DarkModeContext";
import { stringToColor } from "../utils/StringToColor";
import useUserQuestions from "../hooks/useUserQuestion";
import DOMPurify from "dompurify";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebaseconfig"; 
import usePagination from "../hooks/Pagination"; 
import { useNavigate } from "react-router-dom";
import useSortedQuestions from "../hooks/useSortedQuestions";
import ButtonPagination from "./ButtonPagination";
import useUsersIsConnected from "../hooks/useUsersconnected";


const QUESTIONS_PER_PAGE = 5;

const UserProfil = () => {
  const { initials, user } = useUser();
  const { isDarkMode } = useDarkMode();
  const { questions, loading } = useUserQuestions();
  const bgColor = stringToColor(user?.fullName);
  const navigation = useNavigate();
  const sortedQuestions = useSortedQuestions(questions);
  const connectedUserIds = useUsersIsConnected();
  const isOnline = connectedUserIds.includes(user?.uid);

  // la pagination
  const {
    currentPage,
    totalPages,
    currentData: paginatedQuestions,
    goToNextPage,
    goToPreviousPage,
    goToPage
  } = usePagination(sortedQuestions, QUESTIONS_PER_PAGE);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation("/")
    } catch (error) {
      console.error("Erreur de déconnexion :", error);
    }
  };

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 flex flex-col items-center gap-6 z-index-1 ${
        isDarkMode ? "bg-gray-900 text-white" : " text-gray-900"
      }` }
      translate="no"
    >
      {/* Carte Profil */}
      <div className={`w-full max-w-2xl  rounded-2xl shadow-lg p-6 sm:p-8 relative ${isDarkMode? "bg-gray-800" : "bg-white"}`}>

        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 space-y-4 sm:space-y-0">
          <div
            className="relative w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white shrink-0"
            style={{ backgroundColor: bgColor }}
          >
            {initials || "?"}
            <span
                    className={`absolute bottom-1 right-1 w-3 h-3 rounded-full ${
                    isOnline ? "bg-green-500" : "bg-red-500"
                    }`}
                  title={isOnline ? "En ligne" : "Hors ligne"}
                  >
                </span>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-semibold break-words">{user?.fullName}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300 break-words">
              {user ? `@${user?.fullName}` : "Utilisateur inconnu"}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4 text-sm sm:text-base">
          <div className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-4">
            <span className="font-medium">Email :</span>
            <span className="text-right sm:text-left break-all">{user?.email}</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-4">
            <span className="font-medium">Niveau d'étude :</span>
            <span className="text-right sm:text-left">{user?.niveau || "Non renseigné"}</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-4">
            <span className="font-medium">Nationalité :</span>
            <span className="text-right sm:text-left">{user?.nationalite || "Non renseignée"}</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-4">
            <span className="font-medium">Inscrit le :</span>
            <span className="text-right sm:text-left">
              {user?.createdAt
                ? user?.createdAt.toDate().toLocaleString()
                : "Date inconnue"}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md"
        >
          Déconnexion
        </button>
      </div>

      {/* Liste des Questions */}
      <div className="w-full max-w-2xl">
        <h3 className="text-xl font-semibold mb-4">Mes Questions</h3>
        {loading ? (
          <p>Chargement des questions...</p>
        ) : questions.length > 0 ? (
          <>
            <ul className="space-y-3">
              {paginatedQuestions.map((q) => (
                <li
                  key={q.id}
                  className={` p-4 rounded-xl shadow flex flex-col md:flex-row justify-between ${isDarkMode? "bg-gray-800" : "bg-white"}`}
                >
                  <span
                    className="font-medium text-base break-words"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(q.message),
                    }}
                  ></span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 mt-2 sm:mt-0 sm:ml-4 text-center">
                    Posté le : {q.timestamp?.toDate().toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>

            {/* Pagination */}
            <ButtonPagination 
            goToPreviousPage ={goToPreviousPage}
            goToPage ={goToPage}
            currentPage = {currentPage}
            goToNextPage={goToNextPage}
            totalPages = {totalPages}
            />
        </>
        ) : (
          <p className="text-sm text-gray-500">Aucune question posée.</p>
        )}

    </div>
    </div>
  );
};

export default UserProfil;
