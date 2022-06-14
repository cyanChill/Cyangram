import { getSession } from "next-auth/react";

import Login from "../../components/authentication/login";

const LoginPage = () => {
  return (
    <>
      <Login />
    </>
  );
};

export default LoginPage;

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  if (session) {
    return { redirect: { destination: "/" } };
  }
};
