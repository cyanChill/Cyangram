import { getSession } from "next-auth/react";

import HomeFeedPage from "../components/raw_pages/home_page/homepage";

const HomePage = (props) => {
  return <HomeFeedPage {...props} />;
};

export default HomePage;

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  if (!session) {
    return { redirect: { destination: "/accounts/login" } };
  }

  /* Get home feed for posts from people we follow */
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${session.user.username}/yourfeed`
  );
  const data = await res.json();
  // console.log("-=-=- Feed Of People We're Following -=-=-");
  // console.log(data.feedPosts);

  /* Get home feed for posts from people we don't follow (discover) */
  const res2 = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${session.user.username}/globalfeed`
  );
  const data2 = await res2.json();
  // console.log("-=-=- Feed Of People We're Not Following -=-=-");
  // console.log(data2.feedPosts);

  return {
    props: {
      ourFeed: data.feedPosts,
      discoverFeed: data2.feedPosts,
    },
  };
};
