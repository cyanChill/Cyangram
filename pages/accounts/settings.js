/* 
  Simple settings page (a bit different than what Instagram actually uses)
*/
import { getSession } from "next-auth/react";

import UserSettingsPage from "../../components/raw_pages/settings/settingspage";

const SettingsPage = ({ userData }) => {
  return <UserSettingsPage userData={userData} />;
};

export default SettingsPage;

// Fetches username, name, and bio of user for settings page
export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: { destination: "/accounts/login" },
    };
  }

  // Fetch from server user profile data
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}api/users/${session.user.username}`
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
