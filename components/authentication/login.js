import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";

import Button from "../form_elements/button";
import FormInput from "../form_elements/forminput";
import Card from "../ui/card/card";

import classes from "./authStyles.module.css";

const Login = () => {
  const router = useRouter();

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

  const loginHandler = async (e) => {
    e.preventDefault();

    /*  Do some validation? */

    const result = await signIn("credentials", {
      redirect: false,
      username: username,
      password: password,
    });

    if (!result.error) {
      // Successfully logged in & redirect
      console.log("No error");
      router.replace("/");
      return;
    }

    console.log("Failed to log in");
  };

  return (
    <div className={classes.containerWrap}>
      <div className={classes.wrapper}>
        <Card className={classes["main-content-wrapper"]}>
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
              placeholder="Username"
              minLength="3"
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
            <Button
              type="submit"
              disabled={!canSubmit}
              style={{ margin: "1rem 0" }}
            >
              Log in
            </Button>
          </form>
        </Card>

        <Card className={classes.redirect}>
          <p className="center">
            Don&apos;t have an account?{" "}
            <Link href="/accounts/signup">
              <a className={classes.link}>Sign up</a>
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Login;
