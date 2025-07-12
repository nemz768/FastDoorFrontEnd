
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    setCurrentPage: (currentPage: number) => void;
}


export const Pagination = ({currentPage, totalPages, setCurrentPage}:PaginationProps) => {

    const handlePageChange = (newPage:number) => {
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
                {"<"}
            </button>
            <span className="pagination-info">
                Страница {currentPage + 1} из {totalPages}
            </span>
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="pagination-button"
            >
                {">"}
            </button>
        </div>
    );
};

