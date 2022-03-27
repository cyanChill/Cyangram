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
    posts: [
      {
        postId: "p1",
        coverImg:
          "https://images.unsplash.com/photo-1625648479569-19a271140966?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
        likeCnt: 100,
        commentCnt: 19,
      },
      {
        postId: "p2",
        coverImg:
          "https://images.unsplash.com/photo-1648405679817-325c7da58074?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        likeCnt: 180,
        commentCnt: 39,
      },
    ],
  };

  return {
    props: {
      errorCode,
      userData,
      ownProfile: session.user.username === username,
    },
  };
};
