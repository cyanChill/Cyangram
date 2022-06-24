import { getSession } from "next-auth/react";

import Home from "../components/pageLayouts/homePage/home";

const HomePage = ({ username }) => {
  return <Home username={username} />;
};

export default HomePage;

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  if (!session) {
    return { redirect: { destination: "/accounts/login" } };
  }

  return { props: { username: session.user.username } };
};
