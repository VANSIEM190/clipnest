const formatLastSeen = timestamp => {
  if (!timestamp) return 'Jamais connecté'

  const now = new Date()
  const lastSeenDate = new Date(timestamp)
  const diffInMinutes = Math.floor((now - lastSeenDate) / (1000 * 60))
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInMinutes < 1) return "À l'instant"
  if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`
  if (diffInHours < 24) return `Il y a ${diffInHours}h`
  if (diffInDays === 1) return 'Hier'
  if (diffInDays < 7) return `Il y a ${diffInDays} jours`

  return lastSeenDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default formatLastSeen
