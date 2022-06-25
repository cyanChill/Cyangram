import Head from "next/head";
import { getSession } from "next-auth/react";

import Error from "../../components/pageLayouts/errorPage/error";
import Conversation from "../../components/pageLayouts/messagingPages/conversation";

const Inbox = ({ errorCode, ...rest }) => {
  if (errorCode) {
    return <Error />;
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
      <Conversation {...rest} />
    </>
  );
};

export default Inbox;

/* Server-Side Imports */
import { getMinimalUserInfo } from "../../lib/backendHelpers";

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  if (!session) {
    return { redirect: { destination: "/accounts/login" } };
  }

  const { userId } = context.params;

  /* Get Data From Server On User */
  try {
    const data = await getMinimalUserInfo(userId);

    return {
      props: {
        conversationUser: data.user,
        currUser: session.user,
      },
    };
  } catch (err) {
    console.log("[Error]", err.message);
    return { props: { errorCode: 404 } };
  }
};
