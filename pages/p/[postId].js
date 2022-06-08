/*  Page to display the post, its comments, etc */
import { getSession } from "next-auth/react";

import PostPage from "../../components/posts/post";
import ErrorPage from "../../components/raw_pages/error/errorpage";

const UserPostPage = ({ errorCode, postData, ownPost, hasLiked, viewerId }) => {
  if (errorCode) {
    return <ErrorPage />;
  }

  return (
    <PostPage
      postData={postData}
      ownPost={ownPost}
      hasLiked={hasLiked}
      viewerId={viewerId}
    />
  );
};

export default UserPostPage;

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  const { postId } = context.params;
  // Fetch from server user profile data
  const res = await fetch(`${process.env.NEXTAUTH_URL}api/post/${postId}`);
  const errorCode = res.ok ? false : res.status;

  if (errorCode) {
    return { props: { errorCode } };
  }

  // Process the data fetched
  const data = await res.json();

  return {
    props: {
      postData: data.post,
      ownPost: session.user.dbId === data.posterId,
      hasLiked: !!data.post.likes.find(
        (likeInfo) => likeInfo.likerId === session.user.dbId
      ),
      viewerId: session.user.dbId,
    },
  };
};
