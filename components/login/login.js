import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

import Button from "../form_elements/button";
import FormInput from "../form_elements/forminput";
import Card from "../ui/card";

import classes from "./login.module.css";

/* 
  Component to purely handle logins
    - Have some custom logic to make sure that the login button is disabled if the username & password fiels are empty ✅
    
    - Min password length of 6
*/

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    if (username && password.length > 5) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [username, password]);

  const loginHandler = (e) => {
    e.preventDefault();

    /* 
      Some validation
    */

    console.log(username, password);
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
          <FormInput
            type="text"
            placeholder="Username or Email"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <FormInput
            type="password"
            placeholder="Password"
            minLength="6"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" disabled={!canSubmit}>
            Login
          </Button>
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
