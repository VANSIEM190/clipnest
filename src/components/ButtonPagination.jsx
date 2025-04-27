
const ButtonPagination = ({goToPreviousPage ,goToPage, currentPage, goToNextPage , totalPages}) => {
  return ( 
    <div className="flex justify-center items-center mt-6 space-x-2 flex-wrap">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Précédent
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => goToPage(pageNumber)}
                  className={`px-3 py-1 rounded ${
                    currentPage === pageNumber
                      ? "bg-blue-700 text-white"
                      : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white"
                  }`}
                >
                  {pageNumber}
                </button>
              )
            )}

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Suivant
            </button>
            </div>
  );
}
export default ButtonPagination;