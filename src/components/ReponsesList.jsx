import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "../services/firebaseconfig";
import { useUser } from "../Context/UserContext";
import { useDarkMode } from "../Context/DarkModeContext";

const ResponseList = ({ messageId }) => {
  const [responses, setResponses] = useState([]);
  const [newResponse, setNewResponse] = useState("");
  const { user } = useUser();
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    if (!messageId) return;

    const q = query(
      collection(db, "responses"),
      where("messageId", "==", messageId),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const responseData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setResponses(responseData);
    });

    return () => unsubscribe();
  }, [messageId]);

  const handleSendResponse = async () => {
    if (!newResponse.trim()) return;

    await addDoc(collection(db, "responses"), {
      messageId,
      text: newResponse,
      userName: user?.fullName || "Anonyme",
      userId: user?.uid || null,
      timestamp: serverTimestamp(),
    });

    setNewResponse("");
  };

  return (
    <div className="mt-4 border-t pt-3 space-y-4">
      <h2 className="text-lg font-bold">
        {responses.length < 1
          ? `Réponse (${responses.length})`
          : `Réponses (${responses.length})`}
      </h2>

      <div className="space-y-2">
        {responses.map((response) => (
          <div key={response.id} className={` rounded p-2 text-sm
            ${
                isDarkMode
                ? "bg-gradient-to-br from-gray-800/90 via-gray-900/90 to-black/90 text-gray-100 backdrop-blur-sm"
                : "bg-white/80 backdrop-blur-sm text-gray-900"
              }
          `}>
            <p className="font-semibold">{response.userName}</p>
            <p>{response.text}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        <input
          type="text"
          value={newResponse}
          onChange={(e) => setNewResponse(e.target.value)}
          placeholder="Votre réponse..."
          className="flex-1 px-3 py-1.5 border rounded text-sm"
        />
        <button
          onClick={handleSendResponse}
          className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-600"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default ResponseList;
