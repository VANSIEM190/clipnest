import useOnlineStatus from '../hooks/useOnelineStatus'

const UserStatus = ({ uid }) => {
  const { isOnline, lastSeen } = useOnlineStatus(uid)

  return (
    <div className="flex items-center">
      <div
        className={`w-2 h-2 rounded-full ${
          isOnline
            ? 'bg-green-500' // Utilisateur actif
            : `vu ${new Date(lastSeen).toLocaleString()}`
        }`}
      />
    </div>
  )
}
export default UserStatus
