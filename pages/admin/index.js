import Head from "next/head";
import { getSession } from "next-auth/react";

import Admin from "../../components/pageLayouts/adminPage/admin";

const AdminPage = () => {
  return (
    <>
      <Head>
        <title>Admin Panel</title>
      </Head>
      <Admin />
    </>
  );
};

export default AdminPage;

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  if (!session) {
    return { redirect: { destination: "/accounts/login" } };
  }

  if (session.user.dbId !== process.env.ADMIN_ID) {
    return { redirect: { destination: "/" } };
  }

  return { props: {} };
};
