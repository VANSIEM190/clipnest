const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

// 🚀 Express + WebSocket
const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Set();
const connectedUsers = new Map(); // userId -> WebSocket

app.get("/", (req, res) => {
  res.send("WebSocket server is running.");
});

wss.on('connection', (ws) => {
  console.log('🟢 Client connecté');
  clients.add(ws);

  // 🔔 Envoi d'une notification après connexion
  setTimeout(() => {
    const notif = {
      type: 'notification',
      title: 'Nouveau message',
      message: 'Quelqu’un vous a envoyé un message !',
      img: '',
    };
    ws.send(JSON.stringify(notif));
  }, 500);

  ws.on('message', (message) => {
    try {
      const parsed = JSON.parse(message);
      console.log('📨 Message reçu:', parsed);

      switch (parsed.type) {
        case 'login':
          // Associer le userId à la socket
          connectedUsers.set(parsed.userId, ws);
          broadcastUserList();
          break;

        case 'notify':
          broadcastNotification(parsed);
          break;

        default:
          console.warn('⚠️ Type de message inconnu');
      }
    } catch (err) {
      console.error('❌ Erreur de parsing:', err.message);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);

    // Retirer l'utilisateur de la map
    for (const [userId, socket] of connectedUsers.entries()) {
      if (socket === ws) {
        connectedUsers.delete(userId);
        break;
      }
    }

    broadcastUserList();
    console.log('🔴 Client déconnecté');
  });
});

// 🔔 Diffuser une notification personnalisée
function broadcastNotification(data) {
  const payload = JSON.stringify({
    type: 'notification',
    title: data.title || 'Notification',
    message: data.message || '',
    img: data.img || '',
  });

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

// 📡 Diffuser la liste des utilisateurs connectés
function broadcastUserList() {
  const userList = Array.from(connectedUsers.keys());

  const payload = JSON.stringify({
    type: 'userList',
    users: userList,
  });

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

// 🚀 Lancer le serveur
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 WebSocket Server en ligne sur le port ${PORT}`);
});
