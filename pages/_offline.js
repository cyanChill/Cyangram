import Head from "next/head";

import {ErrorOffline} from "../components/pageLayouts/errorPage/error";

export default function _Offline() {
  return (
    <>
      <Head>
        <title>Content Unavailable • Instagram</title>
        <meta
          name="description"
          content="The page you were looking for was not found in the cache."
        />
      </Head>
      <ErrorOffline />
    </>
  );
}
