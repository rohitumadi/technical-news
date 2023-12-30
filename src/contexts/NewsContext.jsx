import { createContext, useContext, useEffect, useReducer } from "react";

const NewsContext = createContext();
const BASE_URL = "http://hn.algolia.com/api/v1/search?";

const initialState = {
  query: "",
  isLoading: false,
  nbPages: 0,
  page: 0,
  hits: [],
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
      //   let pageInc = state.page + 1;
      //   if (pageInc >= state.nbPages) pageInc = 0;

      return {
        ...state,
        page: state.page + 1,
      };
    case "news/getPrevPage":
      if (state.page - 1 < 0) return { ...state };
      //   let pageDec = state.page - 1;
      //   if (pageDec <= 0) pageDec = 0;

      return { ...state, page: state.page - 1 };

    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
  }
}

function NewsProvider({ children }) {
  const [{ query, page, nbPages, hits, isLoading }, dispatch] = useReducer(
    reducer,
    initialState
  );
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchData() {
        if (!query) return;
        dispatch({ type: "loading" });
        try {
          const res = await fetch(`${BASE_URL}query=${query}&page=${page}`, {
            signal: controller.signal,
          });
          const data = await res.json();
          console.log(data);
          // const filteredUsers = data.users.filter((user) =>
          //   user.firstName.toLowerCase().includes(query)
          // );
          dispatch({
            type: "news/loaded",
            payload: {
              hits: data.hits,
              nbPages: data.nbPages,
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

  return (
    <NewsContext.Provider
      value={{
        getPrevPage,
        getNextPage,
        searchPost,
        handleRemove,
        query,
        isLoading,
        nbPages,
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
