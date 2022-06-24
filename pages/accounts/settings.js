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

// Fetches username, name, and bio of user for settings page
export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  if (!session) {
    return { redirect: { destination: "/accounts/login" } };
  }

  // Fetch from server user profile data
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${session.user.username}`
  );

  const errorCode = res.ok ? false : res.status;
  if (errorCode) {
    return { props: { errorCode } };
  }

  const data = await res.json();

  return {
    props: {
      userData: {
        userId: data.user._id,
        username: data.user.username,
        name: data.user.name,
        bio: data.user.bio,
        profilePic: data.user.profilePic,
      },
    },
  };
};
