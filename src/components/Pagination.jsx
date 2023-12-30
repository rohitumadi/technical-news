import { useNews } from "../contexts/NewsContext";

function Pagination() {
  const { page, nbPages, getPrevPage, getNextPage, hits } = useNews();

  if (hits.length)
    return (
      <div className="pagination">
        <button className="btn" onClick={getPrevPage}>
          Prev
        </button>

        <span>
          {page + 1} of {nbPages}
        </span>
        <button className="btn" onClick={getNextPage}>
          Next
        </button>
      </div>
    );
}

export default Pagination;
