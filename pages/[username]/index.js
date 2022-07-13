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

/* Server-Side Imports */
import { getUserInfo } from "../../lib/backendHelpers";

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  if (!session) {
    return { redirect: { destination: "/accounts/login" } };
  }

  const { username } = context.params;

  /* Get Data From Server On User */
  try {
    const { followerCnt, followingCnt, followerList, ...data } =
      await getUserInfo(username);

    return {
      props: {
        userData: data,
        ownProfile:
          session.user.username.toLowerCase() === username.toLowerCase(),
        viewerIsFollowing: followerList.some(
          (follower) => follower.followerId === session.user.dbId
        ),
        followerCnt: followerCnt,
        followingCnt: followingCnt,
        viewerInfo: session.user,
      },
    };
  } catch (err) {
    console.log("[Error]", err.message);
    return { props: { errorCode: 404 } };
  }
};
