import { getSession } from "next-auth/react";

import HomeFeedPage from "../components/raw_pages/home_page/homepage";

const HomePage = ({ username }) => {
  return <HomeFeedPage username={username} />;
};

export default HomePage;

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  if (!session) {
    return { redirect: { destination: "/accounts/login" } };
  }

  return { props: { username: session.user.username } };
};
