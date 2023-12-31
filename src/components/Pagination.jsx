import ReactPaginate from "react-paginate";
import { useNews } from "../contexts/NewsContext";

function Pagination() {
  const {
    nbPages,

    hits,

    handlePageClick,
  } = useNews();

  if (hits.length)
    return (
      <div className="pagination">
        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={nbPages}
          containerClassName="paginationContainer"
          activeClassName="activePage"
          previousLabel="< previous"
          // renderOnZeroPageCount={null}
        />
      </div>
    );
}

export default Pagination;
