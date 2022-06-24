import Head from "next/head";
import { getSession } from "next-auth/react";

import Error from "../../components/pageLayouts/errorPage/error";
import Profile from "../../components/pageLayouts/profilePage/profile";

const ProfilePage = ({ errorCode, ...rest }) => {
  if (errorCode) {
    return <Error />;
  }

  return (
    <>
      <Head>
        <title>
          {rest.userData.user.name} (@{rest.userData.user.username})
        </title>
        <meta name="description" content="Create a new instagram post here!" />
      </Head>
      <Profile {...rest} />
    </>
  );
};

export default ProfilePage;

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  if (!session) {
    return { redirect: { destination: "/accounts/login" } };
  }

  const { username } = context.params;
  // Fetch from server user profile data
  const userDataRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}`
  );

  const errorCode = userDataRes.ok ? false : userDataRes.status;
  if (errorCode) {
    return { props: { errorCode } };
  }

  // Process the data fetched
  const { message, followerCnt, followingCnt, followerList, ...data } =
    await userDataRes.json();

  return {
    props: {
      userData: data,
      ownProfile: session.user.username === username,
      viewerIsFollowing: followerList.some(
        (follower) => follower.followerId === session.user.dbId
      ),
      followerCnt: followerCnt,
      followingCnt: followingCnt,
      viewerInfo: session.user,
    },
  };
};
