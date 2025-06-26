import React, { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../services/firebaseconfig'
import { useNavigate } from 'react-router-dom'
import { stringToColor } from '../utils/StringToColor'
import { useDarkMode } from '../Context/DarkModeContext'
import { FileurLoader } from './Loader'
import usePagination from '../hooks/usePagination'
import useSortedQuestions from '../hooks/useSortedQuestions'
import ButtonPagination from './ButtonPagination'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { UserStatus } from './AutreUsersStatus'

const ContactCard = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const { isDarkMode } = useDarkMode()

  const navigate = useNavigate()
  const sortedUsers = useSortedQuestions(users)
  const maxUsersPerPage = 40
  const {
    currentPage,
    totalPages,
    currentData: paginatedMessages,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(sortedUsers, maxUsersPerPage)

  useEffect(() => {
    // Récupérer tous les utilisateurs de Firestore avec leur dernière connexion
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'))
        const userList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          lastSeen: doc.data().lastSeen?.toDate?.() || null,
        }))
        setUsers(userList)
        setLoading(false)
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des utilisateurs :',
          error
        )
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleClick = userId => {
    navigate(`/profil/${userId}`)
  }

  const filteredUsers = paginatedMessages.filter(user => {
    const fullName = `${user.prenom} ${user.nom}`.toLowerCase()
    return fullName.includes(search.toLowerCase())
  })

  return loading ? (
    <FileurLoader />
  ) : (
    <>
      <Navbar />
      <Sidebar />
      <div
        className={` min-h-full ${
          isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-900'
        }`}
      >
        <div className="container mx-auto p-2 sm:p-4">
          <h2 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4">
            Liste des utilisateurs
          </h2>
          <input
            type="text"
            placeholder="Recherche"
            onChange={e => setSearch(e.target.value)}
            value={search}
            className={`w-full max-w-full sm:max-w-md rounded-md bg-transparent px-3.5 py-2 text-sm sm:text-base ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            } outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-blue-500 mb-4`}
          />

          <div className="grid grid-cols-[repeat(auto-fill,minmax(152px,1fr))] gap-4">
            {filteredUsers.map(user => {
              return (
                <div
                  key={user.id}
                  className={`p-2 sm:p-5 rounded shadow relative cursor-pointer transition-all ${
                    isDarkMode
                      ? 'bg-gray-800 text-white hover:bg-gray-700'
                      : 'bg-white text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => handleClick(user.id)}
                  translate="no"
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <div
                        className=" relative min-w-[40px] min-h-[40px] w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs sm:text-xl font-bold text-gray-700 mr-2 sm:mr-4"
                        title={user.displayName || 'Sans nom'}
                        style={{
                          backgroundColor: stringToColor(
                            `${user.prenom} ${user.nom}`
                          ),
                        }}
                        translate="no"
                      >
                        {' '}
                        {`${user.prenom.charAt(0)}${user.nom.charAt(
                          0
                        )}`.toUpperCase()}
                        <div className="absolute -bottom-1.5 right-1 translate-x-1/2 -translate-y-1/2">
                          <UserStatus userId={user.id} />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 max-sm:overflow-hidden">
                      <h3 className="text-sm sm:text-base font-semibold max-sm:truncate">
                        {`${user.prenom} ${user.nom}`}
                      </h3>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {/* Pagination */}
          {users.length > maxUsersPerPage && (
            <ButtonPagination
              currentPage={currentPage}
              totalPages={totalPages}
              goToNextPage={goToNextPage}
              goToPreviousPage={goToPreviousPage}
            />
          )}
        </div>
      </div>
    </>
  )
}
export default ContactCard
