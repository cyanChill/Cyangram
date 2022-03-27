import Head from "next/head";

import ErrorPage from "../components/misc/errorpage";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Content Unavailable • Instagram</title>
        <meta
          name="description"
          content="The page you were looking for was not found."
        />
      </Head>
      <ErrorPage />
    </>
  );
}
