import useOnlineStatus from '../../hooks/useOnelineStatus'

export const UserStatus = ({ userId }) => {
  const { isOnline } = useOnlineStatus(userId)

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