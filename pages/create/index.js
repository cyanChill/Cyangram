import { getSession } from "next-auth/react";
import Head from "next/head";

import NewPostPage from "../../components/raw_pages/new_post/newpostpage";

const CreatePostPage = ({ userId }) => {
  return (
    <>
      <Head>
        <title>Create new post</title>
        <meta name="description" content="Create a new instagram post here!" />
      </Head>
      <NewPostPage userId={userId} />
    </>
  );
};

export default CreatePostPage;

// Returns UserId
export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  if (!session) {
    return { redirect: { destination: "/accounts/login" } };
  }

  return { props: { userId: session.user.dbId } };
};
