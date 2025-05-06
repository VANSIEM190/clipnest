import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { collection, doc, getDoc, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../services/firebaseconfig";
import { signOut } from "firebase/auth";
import DOMPurify from "dompurify";
import { stringToColor } from "../utils/StringToColor";
import { useDarkMode } from "../Context/DarkModeContext";
import Loader from "./Loader";
import useSortedQuestions from "../hooks/useSortedQuestions";
import ButtonPagination from "./ButtonPagination";
import usePagination from "../hooks/Pagination";

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // redirection ou autre action
    } catch (error) {
      console.error("Erreur de déconnexion :", error);
    }
  };

  if (loading) return <Loader />;
  if (!userData) return <p>Utilisateur introuvable.</p>;

  const bgColor = stringToColor(`${userData.prenom} ${userData.nom}`);

  return (
    <div className={`min-h-screen p-4 sm:p-6 flex flex-col items-center gap-6 ${isDarkMode ? "bg-gray-900 text-white" : "text-gray-900"}`}>
      {/* Carte Profil */}
      <div className={`w-full max-w-2xl rounded-2xl shadow-lg p-6 sm:p-8 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white" style={{ backgroundColor: bgColor }}>
            {userData.prenom?.charAt(0).toUpperCase()}{userData.nom?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{`${userData.prenom} ${userData.nom}`}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">@{userData.prenom} {userData.nom}</p>
          </div>
        </div>
        <div className="mt-4 space-y-2 text-sm sm:text-base">
          <p><strong>Email :</strong> {userData.email}</p>
          <p><strong>Niveau :</strong> {userData.niveau || "Non renseigné"}</p>
          <p><strong>Nationalité :</strong> {userData.nationalite || "Non renseignée"}</p>
          <p><strong>Inscrit le :</strong> {userData.createdAt?.toDate().toLocaleString() || "Date inconnue"}</p>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
        <button onClick={handleLogout} className="mt-4 px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md">
          Déconnexion
        </button>
        <button
          onClick={() =>navigate(-1)} 
          className="mt-4 px-3  text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md"
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
                    Posté le : {q.timestamp?.toDate().toLocaleString()}
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
