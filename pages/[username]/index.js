/* 
  Profile Page:
    - # of Posts
    - # of Followers
    - # Following
*/
import { getSession } from "next-auth/react";

import ErrorPage from "../../components/misc/errorpage";
import UserProfilePage from "../../components/profile/profilepage";

const ProfilePage = ({ errorCode, userData, ownProfile }) => {
  if (errorCode) {
    return <ErrorPage />;
  }

  return <UserProfilePage userData={userData} ownProfile={ownProfile} />;
};

export default ProfilePage;

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  const { username } = context.params;
  // Fetch from server user profile data
  const res = await fetch(`${process.env.NEXTAUTH_URL}api/users/${username}`);
  const errorCode = res.ok ? false : res.status;

  // Process the data fetched
  const data = await res.json();
  console.log(data);

  // Dummy profile data:
  const userData = {
    user: {
      name: "Test User",
      username: "TestUser",
      image: "https://randomuser.me/api/portraits/women/19.jpg",
      bio: "This is a test bio for the user. This is a test bio for the user. This is a test bio for the user. This is a test bio for the user.",
    },
    followerCnt: 1337,
    followingCnt: 69,
    posts: [],
  };

  /* 
    Each post data should be minimum:
      - Num comments
      - Num likes
      - Cover Image
      - Post Id
  */

  return {
    props: {
      errorCode,
      userData,
      ownProfile: session.user.username === username,
    },
  };
};
