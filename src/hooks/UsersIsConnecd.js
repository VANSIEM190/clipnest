import {useEffect , useState} from "react";
import {auth} from "../services/firebaseconfig";

const  useUsersAreConnected = () =>{

  const [connectedUserIds, setConnectedUserIds] = useState([]);

   const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const socket = new WebSocket(`${protocol}://clipnest-ugfj.onrender.com`); 
  
    useEffect(() => {
      const user = auth.currentUser;
  
      if (user) {
        socket.onopen = () => {
          socket.send(
            JSON.stringify({
              type: "login",
              userId: user.uid,
            })
          );
        };
      }
    }, []);
  
    useEffect(() => {
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "userList") {
          setConnectedUserIds(message.users);
        }
      };
    }, []);

    return connectedUserIds;

}

export default useUsersAreConnected;