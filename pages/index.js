/* 
  This page represents either:
    - The feed (WHEN LOGGED IN)
    - The login page (WHEN NOT LOGGED IN)
*/
import Login from "../components/login/login";

export default function Home() {
  return (
    <>
      <Login />
    </>
  );
}
