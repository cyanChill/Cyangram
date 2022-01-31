import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

import Button from "../form_elements/button";
import FormInput from "../form_elements/forminput";
import Card from "../ui/card";

import { isEmail } from "../../lib/validate";
import classes from "./authStyles.module.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [errors, setErrors] = useState({
    email: false,
    extraEmailMsg: null,
    username: false,
    extraUsernameMsg: null,
    password: false,
  });

  useEffect(() => {
    if (isEmail(email) && !!username.trim() && password.trim().length > 5) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [email, username, password]);

  const isUnused = async (e) => {
    const type = e.target.name;

    const identifier = type === "email" ? email.trim() : username.trim();
    const res = await fetch(`/api/users/${identifier}`);

    if (res.ok && type === "email") {
      setErrors((prev) => ({
        ...prev,
        email: true,
        extraEmailMsg: "This email has already been used.",
      }));
    } else if (res.ok && type === "username") {
      setErrors((prev) => ({
        ...prev,
        username: true,
        extraUsernameMsg: "This username has already been used.",
      }));
    } else if (res.status === 404) {
      return;
    } else {
      setErrors((prev) => ({
        ...prev,
        email: false,
        extraEmailMsg: null,
        username: false,
        extraUsernameMsg: null,
      }));
    }
  };

  const checkPassword = () => {
    setErrors((prev) => ({
      ...prev,
      password: !(password.trim().length >= 6),
    }));
  };

  const signupHandler = async (e) => {
    e.preventDefault();

    // Basic checks if user somehow messes with the page to submit (bypassing validation)
    if (!isEmail(email) || !username.trim() || password.trim().length < 6) {
      /* 
        Display an error (modal perhaps)
      */
      return;
    }

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        username: username.trim(),
        password: password.trim(),
      }),
    });
    const data = res.json();

    if (res.ok) {
      /* Login as the user & redirect to the home page */
    } else {
      /* Display an error (modal perhaps) [ie: please reverify your inputs] */
    }
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

        <form onSubmit={signupHandler}>
          <FormInput
            type="email"
            name="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={isUnused}
            errMsg={errors.extraEmailMsg || "Please enter a valid email."}
            hasErr={errors.email}
          />
          <FormInput
            type="text"
            name="username"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={isUnused}
            errMsg={errors.extraUsernameMsg || "Please enter a valid username."}
            hasErr={errors.username}
          />
          <FormInput
            type="password"
            name="password"
            placeholder="Password"
            minLength="6"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={checkPassword}
            errMsg="Please enter a password (min 6 characters)."
            hasErr={errors.password}
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
