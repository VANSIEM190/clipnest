import { useMemo } from "react";

const useSortedQuestions = (questions) => {
  const sortedQuestions = useMemo(() => {
    if (!questions) return [];
    return questions
      .slice()
      .sort((a, b) => b.timestamp?.toDate() - a.timestamp?.toDate());
  }, [questions]);

  return sortedQuestions;
};

export default useSortedQuestions;
