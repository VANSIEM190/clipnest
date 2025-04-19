import { useState } from "react";

const usePagination = (data = [], itemsPerPage = 5) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToPage = (page) => {
    const nombrePage = 1;
    if (page >= nombrePage  &&  page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    currentPage,
    totalPages,
    currentData,
    goToNextPage,
    goToPreviousPage,
    goToPage,
  };
};

export default usePagination;
