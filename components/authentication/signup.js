import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

import Button from "../form_elements/button";
import FormInput from "../form_elements/forminput";
import Card from "../ui/card";

import { isEmail } from "../../helpers/validate";
import classes from "./authStyles.module.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    if (isEmail(email) && username && password.length > 5) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [email, username, password]);

  const loginHandler = (e) => {
    e.preventDefault();

    /* 
      Some validation
    */

    console.log(email, username, password);
  };

  return (
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

        <p className={`center ${classes["catch-phrase"]}`}>
          Sign up to see photos and videos from your friends.
        </p>

        <form onSubmit={loginHandler}>
          <FormInput
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormInput
            type="text"
            placeholder="Username"
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
            Sign up
          </Button>
        </form>
      </Card>

      <Card className={classes.redirect}>
        <p className="center">
          Have an account?{" "}
          <Link href="/">
            <a className={classes.link}>Log in</a>
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default SignUp;
