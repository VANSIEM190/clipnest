import React, { useEffect, useState } from "react";
import { db } from "../services/firebaseconfig";
import { collection, getDocs } from "firebase/firestore";
import Loader from "./Loader";
import { useDarkMode } from "../Context/DarkModeContext";
import usePagination from "../hooks/Pagination";
import { stringToColor } from "../utils/StringToColor";
import ButtonPagination from "./ButtonPagination";
import useSortedQuestions from "../hooks/useSortedQuestions";

const ContactCard = () => {
  const [users, setUsers] = useState([]);
  const [usersSearch, setUsersSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useDarkMode();
  const usersPerPage = 26;

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

  const pagination = usePagination(useSortedQuestions(filteredUsers), usersPerPage);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-400">
            Cartes de contact
          </h1>

          <div className="flex justify-center items-center my-4">
            <input
              type="text"
              placeholder="Recherche"
              onChange={handleChange}
              value={usersSearch}
              className={`w-full max-w-xs sm:max-w-md rounded-md bg-transparent px-3.5 py-2 text-sm sm:text-base ${
                isDarkMode ? "text-white" : "text-gray-900"
              } outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-blue-500`}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 px-2 sm:px-6 justify-center">
            {pagination.currentData.map((user) => (
              <div
                key={user.email || `${user.prenom}-${user.nom}`}
                className={`${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } flex flex-col items-center gap-2 p-3 rounded-2xl shadow-sm hover:shadow-md transition text-center text-xs sm:text-sm md:text-base w-full max-w-[100%] min-w-[80px]`}
              >
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full mx-auto mb-1 text-white flex justify-center items-center font-semibold text-[10px] sm:text-base"
                  style={{ backgroundColor: user.bgColor }}
                  translate="no"
                >
                  {user.initials}
                </div>
                <h5 className="font-medium text-gray-800 dark:text-gray-200 text-[10px] sm:text-sm break-words">
                  {user.fullName}
                </h5>
                <span className="text-gray-500 text-[10px] sm:text-xs break-words whitespace-normal overflow-hidden text-center max-w-full">
                  {user?.email}
                </span>
                <p className="text-gray-500 text-[10px] sm:text-xs">
                  {user?.niveau}
                </p>
                <p className="text-gray-500 text-[10px] sm:text-xs mb-1">
                  {user?.nationalite}
                </p>
                <span className="inline-block mt-2 px-2 py-0.5 text-[9px] bg-green-100 text-green-700 rounded-full">
                  Admin
                </span>
              </div>
            ))}
          </div>

          <ButtonPagination
            goToPreviousPage={pagination.goToPreviousPage}
            goToPage={pagination.goToPage}
            currentPage={pagination.currentPage}
            goToNextPage={pagination.goToNextPage}
            totalPages={pagination.totalPages}
          />
        </div>
      )}
    </>
  );
};

export default ContactCard;
