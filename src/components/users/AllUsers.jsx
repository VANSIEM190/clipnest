import React, { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../../services/firebaseconfig'
import { useNavigate } from 'react-router-dom'
import { stringToColor } from '../../utils/StringToColor.js'
import { useDarkMode } from '../../context/DarkModeContext.jsx'
import usePagination from '../../hooks/usePagination.js'
import { ButtonPagination, FileurLoader } from '../common'
import { Navbar, Sidebar } from '../layout'
import { AutreUsersStatus } from './AutreUsersStatus.jsx'
import { ToastContainer, toast } from 'react-toastify'

const ContactCard = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const { isDarkMode } = useDarkMode()

  const navigate = useNavigate()
  const maxUsersPerPage = 40
  const {
    currentPage,
    totalPages,
    currentData: paginatedUsers,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(users, maxUsersPerPage)

  useEffect(() => {
    // Récupérer tous les utilisateurs de Firestore avec leur dernière connexion
    const fetchUsers = async () => {
      try {
        const collectionUsersRef = query(collection(db, 'users'), orderBy('lastSeen', 'desc'))
        const querySnapshot = await getDocs(collectionUsersRef)
        const userList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          lastSeen: doc.data().lastSeen?.toDate?.() || null,
        }))
        setUsers(userList)
        setLoading(false)
      } catch {
        toast.error('Erreur lors de la récupération des utilisateurs :')
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleNavigate = userId => {
    navigate(`/profil/${userId}`)
  }

  const filteredUsers = paginatedUsers.filter(user => {
    const fullName = `${user.prenom} ${user.nom}`.toLowerCase()
    return fullName.includes(search.toLowerCase())
  })

  return (
  <>
    <Navbar />
   
    <ToastContainer position="top-right" autoClose={3000} />
   {loading ? (
    <FileurLoader />
  ) : (
      <div
        className={`w-full min-h-full  flex justify-end pr-6 ${
          isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-900'
        }`}
      >
         <Sidebar />
        <div className="w-[80%] ">
            <h2 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4">
              Liste des utilisateurs
            </h2>
            <input
              type="text"
              placeholder="Recherche"
              onChange={e => setSearch(e.target.value)}
              value={search}
              className={` w-2/3  rounded-md bg-transparent px-3.5 py-2 text-sm sm:text-base ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              } outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-blue-500 mb-4`}
            />

            <div className=" grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
              {filteredUsers.map(user => {
                return (
                  <div
                    key={user.id}
                    title={`${user.prenom} ${user.nom}`}
                    className={`p-2 sm:p-5 rounded shadow relative cursor-pointer transition-all ${
                      isDarkMode
                        ? 'bg-gray-800 text-white hover:bg-gray-700'
                        : 'bg-white text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => handleNavigate(user.id)}
                    translate="no"
                  >
                    <div className="flex items-center">
                      <div className="relative">
                        <div
                          className=" relative  w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs sm:text-xl font-bold text-gray-700 mr-2 sm:mr-4"
                          style={{
                            backgroundColor: stringToColor(
                              `${user.prenom} ${user.nom}`
                            ),
                          }}
                          translate="no"
                        >
                          {`${user.prenom.charAt(0)}${user.nom.charAt(
                            0
                          )}`.toUpperCase()}
                          <div className="absolute -bottom-1.5 right-1 translate-x-1/2 -translate-y-1/2">
                            <AutreUsersStatus userId={user.id} />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h3 className="text-sm sm:text-base font-semibold truncate ">
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
    
  )}
</>
  )
}
export default ContactCard
