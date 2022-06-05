import { getSession } from "next-auth/react";

import NewPostPage from "../../components/raw_pages/new_post/newpostpage";

const CreatePostPage = ({ userId }) => {
  return <NewPostPage userId={userId} />;
};

export default CreatePostPage;

// Returns UserId
export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: { destination: "/accounts/login" },
    };
  }

  return { props: { userId: session.user.dbId } };
};
