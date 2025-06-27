export const Pagination = ({currentPage, totalPages, setCurrentPage}) => {

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };


    return (
        <div className="pagination">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="pagination-button"
            >
                Предыдущая
            </button>
            <span className="pagination-info">
                Страница {currentPage + 1} из {totalPages}
            </span>
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="pagination-button"
            >
                Следующая
            </button>
        </div>
    );
};

