import Head from "next/head";
import { getSession } from "next-auth/react";

import Search from "../../components/pageLayouts/searchPage/search";

const SearchPage = () => {
  return (
    <>
      <Head>
        <title>Search</title>
        <meta name="description" content="Search for users here!" />
      </Head>
      <Search />
    </>
  );
};

export default SearchPage;

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  if (!session) {
    return { redirect: { destination: "/accounts/login" } };
  }

  return { props: {} };
};
