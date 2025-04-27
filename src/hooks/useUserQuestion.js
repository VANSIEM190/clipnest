// src/hooks/useUserQuestions.js
import { useEffect, useState, useCallback } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useUser } from "../Context/UserContext";
import { db } from "../services/firebaseconfig"; 

const useUserQuestions = () => {
  const { user } = useUser();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserQuestions = useCallback(async () => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      const q = query(
        collection(db, "messages"),  
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const userQuestions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuestions(userQuestions);
    } catch (error) {
      console.error("Erreur lors de la récupération des questions :", error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchUserQuestions();
  }, [fetchUserQuestions]);

  return { questions, loading, refetchQuestions: fetchUserQuestions };
};

export default useUserQuestions;
