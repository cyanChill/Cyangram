import { getSession } from "next-auth/react";
import Head from "next/head";

import CreatePost from "../../components/pageLayouts/createPostPage/createPost";

const CreatePostPage = ({ userId }) => {
  return (
    <>
      <Head>
        <title>Create new post</title>
        <meta name="description" content="Create a new instagram post here!" />
      </Head>
      <CreatePost userId={userId} />
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
