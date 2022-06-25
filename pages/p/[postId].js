import Head from "next/head";
import { getSession } from "next-auth/react";

import Error from "../../components/pageLayouts/errorPage/error";
import Post from "../../components/pageLayouts/postPage/post";

const UserPostPage = ({ errorCode, postData, ownPost, hasLiked, viewerId }) => {
  if (errorCode) {
    return <Error />;
  }

  return (
    <>
      <Head>
        <title>
          {postData.posterInfo.name} (@{postData.posterInfo.username})
        </title>
        <meta name="description" content="Create a new instagram post here!" />
      </Head>
      <Post
        postData={postData}
        ownPost={ownPost}
        hasLiked={hasLiked}
        viewerId={viewerId}
      />
    </>
  );
};

export default UserPostPage;

/* Server-Side Imports */
import { getPostInfo } from "../../lib/backendHelpers";

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  if (!session) {
    return { redirect: { destination: "/accounts/login" } };
  }

  const { postId } = context.params;

  /* Get Data From Server On User */
  try {
    const data = await getPostInfo(postId);

    return {
      props: {
        postData: data.post,
        ownPost: session.user.dbId === data.post.posterId,
        hasLiked: !!data.post.likes.find(
          (likeInfo) => likeInfo.likerId === session.user.dbId
        ),
        viewerId: session.user.dbId,
      },
    };
  } catch (err) {
    console.log("[Error]", err.message);
    return { props: { errorCode: 404 } };
  }
};
