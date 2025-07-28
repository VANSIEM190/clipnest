# Système de Notifications Push - Documentation

## Vue d'ensemble

Ce projet implémente un système complet de notifications push utilisant Firebase Cloud Messaging (FCM) avec un backend Node.js/Express et un frontend React.

## Architecture

### Backend (Node.js/Express)
- **`Back-end/index.js`** : Point d'entrée du serveur Express
- **`Back-end/routes/firebaseRoute.js`** : Route pour l'envoi de notifications
- **`Back-end/controllers/firebaseController.js`** : Contrôleur pour gérer les requêtes
- **`Back-end/services/NotificationService.js`** : Service pour envoyer les notifications via Firebase Admin SDK
- **`Back-end/util/firebase.js`** : Configuration Firebase Admin SDK

### Frontend (React)
- **`src/hooks/useFCMToken.js`** : Hook personnalisé pour gérer les tokens FCM
- **`src/utils/notification-utils.js`** : Utilitaires pour l'envoi de notifications
- **`src/utils/firebase-utils.js`** : Configuration Firebase côté client
- **`public/firebase-messaging-sw.js`** : Service Worker pour les notifications en arrière-plan

## Fonctionnalités

### 1. Récupération et Stockage des Tokens FCM
- Demande automatique de permission de notification
- Récupération du token FCM unique par utilisateur
- Stockage du token dans Firestore avec l'ID utilisateur
- Mise à jour automatique du token si nécessaire

### 2. Envoi de Notifications
- **Notifications locales** : Affichées quand le navigateur est ouvert
- **Notifications push** : Envoyées même si le navigateur est fermé (via Service Worker)
- Support pour l'envoi à un utilisateur spécifique
- Support pour l'envoi à plusieurs utilisateurs

### 3. Gestion des Permissions
- Vérification automatique des permissions
- Demande de permission si nécessaire
- Gestion des cas où les notifications ne sont pas supportées

## Utilisation

### Dans un composant React

```jsx
import { useFCMToken } from '../hooks'
import { sendPushNotification } from '../utils/notification-utils'

const MonComposant = () => {
  const { fcmToken, isLoading, error } = useFCMToken()
  
  const envoyerNotification = async () => {
    if (fcmToken) {
      const success = await sendPushNotification(
        fcmToken,
        'Titre de la notification',
        'Contenu de la notification'
      )
      
      if (success) {
        console.log('Notification envoyée avec succès')
      }
    }
  }
  
  return (
    <button onClick={envoyerNotification}>
      Envoyer une notification
    </button>
  )
}
```

### Envoi depuis le backend

```javascript
// POST /api/firebase/send-notification
{
  "deviceToken": "token_fcm_de_l_utilisateur",
  "title": "Titre de la notification",
  "body": "Contenu de la notification"
}
```

## Configuration

### Variables d'environnement Backend
```env
FIREBASE_PROJECT_ID=ton-projet-id
FIREBASE_CLIENT_EMAIL=ton-client-email
FIREBASE_PRIVATE_KEY=ta-cle-privee
```

### Configuration Firebase Frontend
- VAPID Key configurée dans `firebase-utils.js`
- Service Worker configuré dans `public/firebase-messaging-sw.js`

## Flux de fonctionnement

1. **Au chargement de l'app** :
   - Le hook `useFCMToken` est appelé
   - Demande de permission de notification
   - Récupération du token FCM
   - Stockage dans Firestore

2. **Lors de l'envoi d'une notification** :
   - Récupération du token depuis Firestore
   - Envoi au backend via l'API
   - Le backend utilise Firebase Admin SDK pour envoyer la notification
   - La notification s'affiche sur l'appareil cible

3. **Réception des notifications** :
   - Si l'app est ouverte : via `onMessageListener`
   - Si l'app est fermée : via le Service Worker

## Support des plateformes

- ✅ **Desktop** (Chrome, Firefox, Edge, Safari)
- ✅ **Android** (Chrome, Firefox, Edge)
- ⚠️ **iOS** (Safari - support limité, iOS 16.4+)

## Dépannage

### Problèmes courants

1. **Token FCM non disponible** :
   - Vérifier que l'utilisateur a accordé la permission
   - Vérifier la configuration VAPID Key
   - Vérifier que le Service Worker est bien enregistré

2. **Notifications non reçues** :
   - Vérifier que le token est bien stocké dans Firestore
   - Vérifier la configuration Firebase Admin SDK
   - Vérifier les logs du backend

3. **Erreurs de permission** :
   - Vérifier que le site est en HTTPS (requis pour les notifications)
   - Vérifier que l'utilisateur n'a pas bloqué les notifications

## Sécurité

- Les credentials Firebase Admin SDK restent côté serveur
- Les tokens FCM sont stockés de manière sécurisée dans Firestore
- Validation des données côté serveur avant envoi
- Gestion des erreurs et des cas limites 