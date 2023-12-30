import { createContext, useContext, useEffect, useReducer } from "react";

const NewsContext = createContext();
const BASE_URL = "http://hn.algolia.com/api/v1/search?";

const initialState = {
  query: "",
  isLoading: false,
  nbPages: 0,
  page: 0,
  hits: [],
  hitsPerPage: 0,
};
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "news/loaded":
      return {
        ...state,
        isLoading: false,
        hits: action.payload.hits,
        nbPages: action.payload.nbPages,
        hitsPerPage: action.payload.hitsPerPage,
      };
    case "news/remove":
      return {
        ...state,
        hits: state.hits.filter((hit) => hit.objectID !== action.payload),
      };
    case "news/search":
      return { ...state, query: action.payload };

    case "news/getNextPage":
      if (state.page + 1 >= state.nbPages) return { ...state };

      return {
        ...state,
        page: state.page + 1,
      };
    case "news/getPrevPage":
      if (state.page - 1 < 0) return { ...state };

      return { ...state, page: state.page - 1 };
    case "news/handlePageClick":
      return {
        ...state,
        page: action.payload,
      };

    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    case "reset":
      return initialState;
  }
}

function NewsProvider({ children }) {
  const [{ query, hitsPerPage, page, nbPages, hits, isLoading }, dispatch] =
    useReducer(reducer, initialState);
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchData() {
        if (!query) {
          dispatch({ type: "reset" });
          return;
        }
        dispatch({ type: "loading" });
        try {
          const res = await fetch(`${BASE_URL}query=${query}&page=${page}`, {
            signal: controller.signal,
          });
          const data = await res.json();
          dispatch({
            type: "news/loaded",
            payload: {
              hits: data.hits,
              nbPages: data.nbPages,
              hitsPerPage: data.hitsPerPage,
            },
          });
        } catch (err) {
          dispatch({
            type: "rejected",
            payload: "There was an error loading data",
          });
        }
      }
      fetchData();
      return function () {
        controller.abort();
      };
    },
    [query, page]
  );

  function handleRemove(objectID) {
    dispatch({ type: "news/remove", payload: objectID });
  }

  function searchPost(searchQuery) {
    dispatch({ type: "news/search", payload: searchQuery });
  }
  function getNextPage() {
    dispatch({ type: "news/getNextPage" });
  }
  function getPrevPage() {
    dispatch({ type: "news/getPrevPage" });
  }
  function handlePageClick({ selected }) {
    dispatch({
      type: "news/handlePageClick",
      payload: selected,
    });
  }

  return (
    <NewsContext.Provider
      value={{
        getPrevPage,
        handlePageClick,
        getNextPage,
        searchPost,

        handleRemove,
        query,
        isLoading,
        nbPages,
        hitsPerPage,
        page,
        hits,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
}
function useNews() {
  const context = useContext(NewsContext);
  if (context === undefined)
    throw new Error("News context was used outside of the NewsProvider");
  return context;
}

export { NewsContext, NewsProvider, useNews };
