import Head from "next/head";
import { getSession } from "next-auth/react";

import Error from "../../components/pageLayouts/errorPage/error";
import Settings from "../../components/pageLayouts/settingPages/settings";

const SettingsPage = ({ errorCode, userData }) => {
  if (errorCode) {
    return <Error />;
  }

  return (
    <>
      <Head>
        <title>Settings</title>
        <meta name="description" content="Settings page." />
      </Head>
      <Settings userData={userData} />
    </>
  );
};

export default SettingsPage;

/* Server-Side Imports */
import { getMinimalUserInfo } from "../../lib/backendHelpers";

// Fetches username, name, and bio of user for settings page
export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  if (!session) {
    return { redirect: { destination: "/accounts/login" } };
  }

  /* Get Data From Server On User */
  try {
    const { user } = await getMinimalUserInfo(session.user.dbId);

    return { props: { userData: { userId: user._id, ...user } } };
  } catch (err) {
    console.log("[Error]", err.message);
    return { props: { errorCode: 404 } };
  }
};
