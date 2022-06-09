import { SessionProvider } from "next-auth/react";

import global from "../global";
import useAlert from "../hooks/useAlert";
import Layout from "../components/layout/layout";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  /*
    Prevent redundent checking of session (getSession will return this
    session value)
  */
  global.alerts = useAlert();
  return (
    <SessionProvider session={pageProps.session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

export default MyApp;
