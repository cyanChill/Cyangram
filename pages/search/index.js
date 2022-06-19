import Head from "next/head";

import SearchBar from "../../components/raw_pages/search/search";

const Search = () => {
  return (
    <>
      <Head>
        <title>Search</title>
        <meta name="description" content="Search for users here!" />
      </Head>
      <SearchBar />
    </>
  );
};

export default Search;
