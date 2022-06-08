import { getSession } from "next-auth/react";
import PostExcerpt from "../components/posts/post_excerpt/post_excerpt";

const DUMMY_POST = {
  postId: "p1",
  uploader: {
    username: "testUser",
    profilePic: "https://randomuser.me/api/portraits/women/19.jpg",
  },
  postImg:
    "https://d279m997dpfwgl.cloudfront.net/wp/2020/05/pencil-standardized-test.jpg",
  /*
  postImgs: [
    "https://d279m997dpfwgl.cloudfront.net/wp/2020/05/pencil-standardized-test.jpg",
  ],
  */
  description: "This is a test post",
  likeCnt: 100,
};

const HomePage = (props) => {
  return (
    <>
      <div>
        <h1>This is the home feed</h1>
        <PostExcerpt post={DUMMY_POST} />
      </div>
    </>
  );
};

export default HomePage;

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  if (!session) {
    return { redirect: { destination: "/accounts/login" } };
  }

  return {
    props: { session },
  };
};
