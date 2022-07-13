import { useEffect } from "react";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";

import global from "../global";
import useAlert from "../hooks/useAlert";
import useTheme from "../hooks/useTheme";
import Layout from "../components/layout/layout";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  /*
    Prevent redundent checking of session (getSession will return this
    session value)
  */
  global.alerts = useAlert();
  global.theme = useTheme();

  /* Service Worker Registration */
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/files/sw.js")
        .then(() => {
          console.log("[Service Worker] Registration successful.");
        })
        .catch((err) => {
          console.log("[Service Worker] Registration failed: ", err);
        });
    }
  }, []);

  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <title>Next-Instagram</title>
        <meta name="description" content="Mock Instagram App using NextJS." />
        <link
          rel="shortcut icon"
          href="/images/icons/favicon.ico"
          type="image/x-icon"
        />
        <link rel="manifest" href="/files/manifest.json" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

export default MyApp;
