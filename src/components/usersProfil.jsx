import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { collection, doc, getDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../services/firebaseconfig";
import DOMPurify from "dompurify";
import { stringToColor } from "../utils/StringToColor";
import { useDarkMode } from "../Context/DarkModeContext";
import { FileurLoader} from "./Loader";
import useSortedQuestions from "../hooks/useSortedQuestions";
import ButtonPagination from "./ButtonPagination";
import usePagination from "../hooks/Pagination";
import UserStatus from "./UsersStatut";
import formatDate from "../utils/formatDate";

const QUESTIONS_PER_PAGE = 5;

const UsersProfileDetails = () => {
  const { id } = useParams(); // ID de l'utilisateur dans l'URL
  const { isDarkMode } = useDarkMode();
  const [userData, setUserData] = useState(null); // données utilisateur
  const [userMessages, setUserMessages] = useState([]); // messages utilisateur
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  const sortedMessages = useSortedQuestions(userMessages); // messages triés

  const {
    currentPage,
    totalPages,
    currentData: paginatedMessages,
    goToNextPage,
    goToPreviousPage,
    goToPage
  } = usePagination(sortedMessages, QUESTIONS_PER_PAGE);

  useEffect(() => {
    const fetchUserAndMessages = async () => {
      try {
        // Récupérer les infos de l'utilisateur
        const userRef = doc(db, "users", id);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData({ id: userSnap.id, ...userSnap.data() });
        } else {
          setUserData(null);
        }

        // Récupérer les messages liés à cet utilisateur
        const messagesQuery = query(
          collection(db, "messages"),
          where("userId", "==", id)
        );
        const querySnapshot = await getDocs(messagesQuery);
        const messages = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserMessages(messages);

      } catch (error) {
        console.error("Erreur lors de la récupération :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndMessages();
  }, [id]);


  if (loading) return <FileurLoader />;
  if (!userData) return <p>Utilisateur introuvable.</p>;

  const bgColor = stringToColor(`${userData.prenom} ${userData.nom}`);

  return (
    <div className={`min-h-screen p-4 sm:p-6 flex flex-col items-center gap-6 ${isDarkMode ? "bg-gray-900 text-white" : "text-gray-900"}`}>
      {/* Carte Profil */}
      <div className={`w-full max-w-2xl rounded-2xl shadow-lg p-6 sm:p-8 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="flex items-center gap-4">
          <div className="relative w-10 h-10 sm:w-20 sm:h-20  max-sm:text-base rounded-full flex items-center justify-center text-2xl font-bold text-white shrink-0" style={{ backgroundColor: bgColor }}>
            {userData.prenom?.charAt(0).toUpperCase()}{userData.nom?.charAt(0).toUpperCase()}
            <div className="absolute -bottom-1 right-2 translate-x-1/2 -translate-y-1/2  sm:bottom-1 sm:right-3">
              <UserStatus uid={userData?.id} />
            </div>
          </div>
          <div className="overflow-hidden">
            <h2 className="text-2xl font-semibold max-sm:text-base truncate">{`${userData.prenom} ${userData.nom}`}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300 sm:text-base truncate">@{userData.prenom} {userData.nom}</p>
          </div>
        </div>
        <div className="mt-6 space-y-4 text-sm sm:text-base">
          <div className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-4">
            <span className="font-medium">Email :</span>
            <span className="text-right sm:text-left break-all">{userData?.email}</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-4">
            <span className="font-medium">Niveau d'étude :</span>
            <span className="text-right sm:text-left">{userData?.niveau || "Non renseigné"}</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-4">
            <span className="font-medium">Nationalité :</span>
            <span className="text-right sm:text-left">{userData?.nationalite || "Non renseignée"}</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-4">
            <span className="font-medium">Inscrit le :</span>
            <span className="text-right sm:text-left">
              {userData?.createdAt
                ? formatDate(userData?.createdAt)
                : "Date inconnue"}
            </span>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
        <button
          onClick={() =>navigate(-1)} 
          className="mt-4 px-3  text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md cursor-pointer"
        >
          Retour
        </button>
        </div>

      </div>

      {/* Liste des Questions / Messages */}
      <div className="w-full max-w-2xl">
        <h3 className="text-xl font-semibold mb-4">Ses Messages</h3>
        {userMessages.length > 0 ? (
          <>
            <ul className="space-y-3">
              {paginatedMessages.map((q) => (
                <li key={q.id} className={`p-4 rounded-xl shadow ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(q.message) }} className="text-base break-words" />
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
  );
};

export default UsersProfileDetails;
