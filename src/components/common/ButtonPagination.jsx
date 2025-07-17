
const ButtonPagination = ({ goToPreviousPage, goToPage, currentPage, goToNextPage, totalPages }) => {
  // Calcul dynamique du groupe de pages à afficher (max 3)
  const getPageNumbers = () => {
    if (totalPages <= 3) return Array.from({ length: totalPages }, (_, i) => i + 1);

    let start = currentPage - 1;
    let end = currentPage + 1;

    if (currentPage === 1) {
      start = 1;
      end = 3;
    } else if (currentPage === totalPages) {
      start = totalPages - 2;
      end = totalPages;
    }

    const range = [];
    for (let i = start; i <= end && i <= totalPages; i++) {
      if (i >= 1) range.push(i);
    }
    return range;
  };

  return (
    <div className="flex justify-center items-center mt-6 gap-2 flex-wrap px-2">
      <button
        onClick={goToPreviousPage}
        disabled={currentPage === 1}
        className="min-w-[60px] px-2 py-1 rounded-full text-xs font-semibold transition 
                  bg-blue-500 text-white disabled:opacity-40 hover:bg-blue-600"
      >
        ← Précédent
      </button>

      {getPageNumbers().map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => goToPage(pageNumber)}
          className={`min-w-[32px] h-[32px] rounded-full text-xs font-bold flex items-center justify-center transition
            ${
              currentPage === pageNumber
                ? "bg-blue-700 text-white"
                : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white hover:bg-gray-300"
            }`}
        >
          {pageNumber}
        </button>
      ))}

      <button
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
        className="min-w-[60px] px-2 py-1 rounded-full text-xs font-semibold transition 
                  bg-blue-500 text-white disabled:opacity-40 hover:bg-blue-600"
      >
        Suivant →
      </button>
    </div>
  );
};

export default ButtonPagination;