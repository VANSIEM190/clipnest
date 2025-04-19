import React, { useEffect, useState } from "react";
import { db } from "../services/firebaseconfig";
import { collection, getDocs } from "firebase/firestore";
import Loader from "./Loader";
import { useDarkMode } from "../Context/DarkModeContext";
import usePagination from "../hooks/Pagination";
import { stringToColor } from "../utils/StringToColor";

const ContactCard = () => {
  const [users, setUsers] = useState([]);
  const [usersSearch, setUsersSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useDarkMode();
  const usersPerPage = 9;

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const prenom = data.prenom || "";
        const nom = data.nom || "";
        const fullName = `${prenom} ${nom}`;
        const initials = `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
        const bgColor = stringToColor(fullName);

        return {
          ...data,
          fullName,
          initials,
          bgColor,
        };
      });

      setUsers(usersData);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setUsersSearch(e.target.value);
    pagination.goToPage(1);
  };

  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(usersSearch.toLowerCase())
  );

  const pagination = usePagination(filteredUsers, usersPerPage);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen p-6">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-400">
            Cartes de contact
          </h1>

          <div className="flex justify-center items-center my-4">
            <input
              type="text"
              placeholder="Recherche"
              onChange={handleChange}
              value={usersSearch}
              className={`w-3/4 sm:w-2/4 rounded-md mx-auto bg-transparent px-3.5 py-2 text-base ${
                isDarkMode ? "text-white" : "text-gray-900"
              } outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-blue-500`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 justify-center">
            {pagination.currentData.map((user) => (
              <div
                key={user.email || `${user.prenom}-${user.nom}`}
                className={`${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } flex flex-col gap-4 rounded-xl shadow p-4 text-center hover:shadow-lg transition`}
              >
                <div
                  className="w-15 h-15 max-sm:w-10 max-sm:h-10 rounded-full mx-auto mb-1 text-white flex justify-center items-center font-bold border"
                  style={{ backgroundColor: user.bgColor }}
                  translate="no"
                >
                  {user.initials}
                </div>
                <div className="text-center">
                  <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-normal">
                    {user.fullName}
                  </h5>
                  <span className="text-gray-500 text-sm mb-1 break-words whitespace-normal">
                    {user?.email}
                  </span>
                  <p className="text-gray-500 text-sm">{user?.niveau}</p>
                  <p className="text-gray-500 text-sm mb-2">{user?.nationalite}</p>
                  <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full mb-3">
                    Admin
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-6 space-x-2 flex-wrap">
            <button
              onClick={pagination.goToPreviousPage}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Précédent
            </button>
            {/* creation d'un tableau avec le total page  */}
            {Array.from({ length: pagination.totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => pagination.goToPage(pageNumber)}
                  className={`px-3 py-1 rounded ${
                    pagination.currentPage === pageNumber
                      ? "bg-blue-700 text-white"
                      : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white"
                  }`}
                >
                  {pageNumber}
                </button>
              )
            )}

            <button
              onClick={pagination.goToNextPage}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactCard;
