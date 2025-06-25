import useOnlineStatus from '../hooks/useOnelineStatus'

const UserStatus = ({ userId }) => {
  const { isOnline } = useOnlineStatus(userId)
  console.log(userId)

  return (
    <>
      {isOnline === true && (
        <div className=" w-2.5 h-2.5 rounded-full border-2 border-white bg-green-500"></div>
      )}

      {isOnline === false && (
        <div className=" w-2.5 h-2.5  rounded-full border-2 border-white bg-red-500"></div>
      )}
    </>
  )
}

const UserLastSeen = ({ uidUser }) => {
  const { lastSeen, isOnline } = useOnlineStatus(uidUser)

  return (
    <>
      <p className="text-sm">
        {isOnline === 'online'
          ? 'en ligne'
          : ` en ligne: ${new Date(lastSeen).toLocaleString()}`}
      </p>
    </>
  )
}

export { UserStatus, UserLastSeen }
