import Head from "next/head";
import { getSession } from "next-auth/react";

import Error from "../../components/pageLayouts/errorPage/error";
import Inbox from "../../components/pageLayouts/messagingPages/inbox";

const InboxPage = ({ errorCode, conversationUsers }) => {
  if (errorCode) {
    return <Error />;
  }

  return (
    <>
      <Head>
        <title>Inbox • Direct</title>
        <meta name="description" content="Inbox for all your messages." />
      </Head>
      <Inbox conversationUsers={conversationUsers} />
    </>
  );
};

export default InboxPage;

/* Server-Side Imports */
import { getConversationList } from "../../lib/backendHelpers";

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  if (!session) {
    return { redirect: { destination: "/accounts/login" } };
  }

  /* Get Data From Server On User */
  try {
    const data = await getConversationList(session.user.dbId);

    return { props: { conversationUsers: data.users } };
  } catch (err) {
    console.log("[Error]", err.message);
    return { props: { errorCode: 404 } };
  }
};
