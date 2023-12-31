import { useState } from "react";
import NavBar from "./components/NavBar";
import Search from "./components/Search";
import SearchResultList from "./components/SearchResultList";
import Pagination from "./components/Pagination";
import Header from "./components/Header.JSX";

function App() {
  return (
    <>
      <Header />
      <NavBar>
        <Search />
      </NavBar>
      <Pagination />
      <SearchResultList />
    </>
  );
}

export default App;
