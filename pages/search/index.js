import Head from "next/head";
import { getSession } from "next-auth/react";

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

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  if (!session) {
    return { redirect: { destination: "/accounts/login" } };
  }

  return { props: {} };
};
