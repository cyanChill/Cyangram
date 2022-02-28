import { getSession, signOut } from "next-auth/react";

const HomePage = (props) => {
  return (
    <>
      <div>
        <h1>This is the home feed</h1>
        <button onClick={signOut}>Sign Out</button>
      </div>
    </>
  );
};

export default HomePage;

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/accounts/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
