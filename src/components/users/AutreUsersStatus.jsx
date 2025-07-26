import useUserStatus from '../../hooks/useUserStatus.js'

const AutreUsersStatus = ({ userId }) => {
  const { state } = useUserStatus(userId)

  return (
    <>
      {state === 'online' && (
        <div className=" w-2.5 h-2.5 rounded-full border-2 border-white bg-green-500"></div>
      )}
      {state === 'inactive' && (
        <div className=" w-2.5 h-2.5 rounded-full border-2 border-white bg-orange-500"></div>
      )}
      {state === 'offline' && (
        <div className=" w-2.5 h-2.5  rounded-full border-2 border-white bg-red-500"></div>
      )}
    </>
  )
}

const UserLastSeen = ({ uidUser }) => {
  const { lastSeen, state } = useUserStatus(uidUser)

  return (
    <>
      <p className="text-sm">
        {state === 'online'
          ? 'en ligne'
          : ` en ligne: ${new Date(lastSeen).toLocaleString()}`}
      </p>
    </>
  )
}

export { AutreUsersStatus, UserLastSeen }
