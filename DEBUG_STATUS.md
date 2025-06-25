# Guide de débogage - Statut en ligne des utilisateurs

## Problèmes identifiés et solutions

### 1. Vérification de la structure des données Firebase

Vérifiez dans votre console Firebase que la structure des données est correcte :

**Firebase Realtime Database** devrait avoir cette structure :
```
/status
  /userId1
    - isActivelyUsing: true/false
    - lastActivity: "2024-01-01T12:00:00.000Z"
    - state: "online"/"offline"
  /userId2
    - isActivelyUsing: true/false
    - lastActivity: "2024-01-01T12:00:00.000Z"
    - state: "online"/"offline"
```

### 2. Vérification des règles de sécurité

Assurez-vous que vos règles Firebase permettent la lecture des statuts :

```json
{
  "rules": {
    "status": {
      ".read": "auth != null",
      ".write": "auth != null && auth.uid == $key"
    }
  }
}
```

### 3. Étapes de débogage

1. **Ouvrez la console du navigateur** (F12)
2. **Vérifiez les logs** - vous devriez voir :
   - "Statuts en ligne reçus: {...}"
   - Les informations de chaque utilisateur
3. **Vérifiez les erreurs** dans la console

### 4. Test du hook useOnlineStatus

Le composant affiche maintenant le statut de l'utilisateur actuel. Pour tester :

1. Remplacez `'test-user-id'` par l'ID d'un utilisateur réel
2. Vérifiez que le statut s'affiche correctement
3. Testez la déconnexion/reconnexion

### 5. Problèmes courants

- **Aucun statut affiché** : Vérifiez que les utilisateurs utilisent le hook `useOnlineStatus`
- **Statut toujours hors ligne** : Vérifiez les règles de sécurité Firebase
- **Délai dans l'affichage** : Normal, Firebase a un délai de synchronisation

### 6. Améliorations apportées

- ✅ Gestion des cas où les données n'existent pas
- ✅ Logs de débogage ajoutés
- ✅ Vérification de multiples propriétés de statut
- ✅ Affichage du statut de l'utilisateur actuel
- ✅ Gestion des erreurs Firebase

### 7. Prochaines étapes

1. Testez avec un utilisateur réel
2. Vérifiez les logs dans la console
3. Ajustez les règles Firebase si nécessaire
4. Testez la fonctionnalité de déconnexion automatique 