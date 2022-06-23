import Head from "next/head";
import { getSession } from "next-auth/react";

import InboxPage from "../../components/raw_pages/messaging/inbox";
import ErrorPage from "../../components/raw_pages/error/errorpage";

const Inbox = ({ errorCode, conversationUsers }) => {
  if (errorCode) {
    return <ErrorPage />;
  }

  return (
    <>
      <Head>
        <title>Inbox • Direct</title>
        <meta name="description" content="Inbox for all your messages." />
      </Head>
      <InboxPage conversationUsers={conversationUsers} />
    </>
  );
};

export default Inbox;

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  if (!session) {
    return { redirect: { destination: "/accounts/login" } };
  }

  // Fetch from server lists of conversations user is involved in
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${session.user.username}/conversations`
  );

  const errorCode = res.ok ? false : res.status;
  if (errorCode) {
    return { props: { errorCode } };
  }

  // Process the data fetched
  const data = await res.json();

  return { props: { conversationUsers: data.users } };
};
