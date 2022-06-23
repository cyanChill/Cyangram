import Head from "next/head";
import { getSession } from "next-auth/react";

import ConversationPage from "../../components/raw_pages/messaging/conversation";
import ErrorPage from "../../components/raw_pages/error/errorpage";

const Inbox = ({ errorCode, ...rest }) => {
  if (errorCode) {
    return <ErrorPage />;
  }

  return (
    <>
      <Head>
        <title>Instagram • Inbox</title>
        <meta
          name="description"
          content="Page where we have a conversation with a specific user."
        />
      </Head>
      <ConversationPage {...rest} />
    </>
  );
};

export default Inbox;

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  if (!session) {
    return { redirect: { destination: "/accounts/login" } };
  }

  const { userId } = context.params;
  // Fetch from server lists of conversations user is involved in
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${session.user.dbId}/minimal/${userId}`
  );

  const errorCode = res.ok ? false : res.status;
  if (errorCode) {
    return { props: { errorCode } };
  }

  // Process the data fetched
  const data = await res.json();

  return {
    props: {
      conversationUser: data.user,
      currUser: session.user,
    },
  };
};
