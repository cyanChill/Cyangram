import Link from "next/link";
import Image from "next/image";

import Button from "../form_elements/button";
import FormInput from "../form_elements/forminput";
import Card from "../ui/card";

import classes from "./login.module.css";

/* 
  Component to purely handle logins
    - Have some custom logic to make sure that the login button is disabled if the username & password fiels are empty
*/

const Login = () => {
  const loginHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div className={classes.login}>
      <Card className={classes["login-actions"]}>
        <div className={classes.logo}>
          <Image
            className={classes.logo}
            src="/images/assets/instagram-logo.png"
            alt="Instagram logo"
            width="210"
            height="75"
            responsive="true"
          />
        </div>

        <form onSubmit={loginHandler}>
          <FormInput type="text" placeholder="Username or Email" required />
          <FormInput type="password" placeholder="Password" required />
          <Button type="submit">Login</Button>
        </form>
      </Card>

      <Card className={classes.signup}>
        <p className="center">
          Don&apos;t have an account?{" "}
          <Link href="/accounts/emailsignup">
            <a className={classes.link}>Sign up</a>
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;
