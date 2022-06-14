/* 
  Profile Page:
    - # of Posts
    - # of Followers
    - # Following
*/
import { getSession } from "next-auth/react";

import ErrorPage from "../../components/raw_pages/error/errorpage";
import UserProfilePage from "../../components/raw_pages/profile/profilepage";

const ProfilePage = ({ errorCode, ...rest }) => {
  if (errorCode) {
    return <ErrorPage />;
  }

  return <UserProfilePage {...rest} />;
};

export default ProfilePage;

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  if (!session) {
    return { redirect: { destination: "/accounts/login" } };
  }

  const { username } = context.params;
  // Fetch from server user profile data
  const res = await fetch(`${process.env.NEXTAUTH_URL}api/users/${username}`);
  const errorCode = res.ok ? false : res.status;

  if (errorCode) {
    return { props: { errorCode } };
  }

  // Process the data fetched
  const { message, followerList, ...data } = await res.json();

  return {
    props: {
      userData: data,
      ownProfile: session.user.username === username,
      viewerIsFollowing: followerList.some(
        (follower) => follower.followerId === session.user.dbId
      ),
    },
  };
};
