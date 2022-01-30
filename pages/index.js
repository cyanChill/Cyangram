/* 
  This page represents either:
    - The feed (WHEN LOGGED IN)
    - The login page (WHEN NOT LOGGED IN)
*/
import Login from "../components/authentication/login";

const HomePage = () => {
  return (
    <>
      <Login />
    </>
  );
};

export default HomePage;
