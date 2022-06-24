import { getSession } from "next-auth/react";

import SignUp from "../../components/pageLayouts/authenticationPages/signup";

const SignUpPage = () => {
  return (
    <>
      <SignUp />
    </>
  );
};

export default SignUpPage;

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  if (session) {
    return { redirect: { destination: "/" } };
  }

  return { props: {} };
};
