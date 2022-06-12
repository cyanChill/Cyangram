import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";

import { loginInFirebase } from "../../lib/firebaseHelpers";
import global from "../../global";
import { usernameFriendly } from "../../lib/validate";
import Button from "../form_elements/button";
import FormInput from "../form_elements/forminput";
import Card from "../ui/card/card";

import classes from "./authStyles.module.css";

const SignUp = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [errors, setErrors] = useState({
    username: false,
    extraUsernameMsg: null,
    password: false,
  });

  useEffect(() => {
    // 30 >= username length >= 3 & password length >= 6
    if (
      username.trim().length > 2 &&
      username.trim().length < 31 &&
      password.trim().length > 5 &&
      !errors.username &&
      !errors.password
    ) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [username, password, errors]);

  const isUnused = async (e) => {
    const type = e.target.name;

    const identifier = username.trim();

    if (!identifier) return;

    const res = await fetch(`/api/users/${identifier}`);

    if (res.ok && type === "username") {
      setErrors((prev) => ({
        ...prev,
        username: true,
        extraUsernameMsg: "This username has already been used.",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        username: false,
        extraUsernameMsg: null,
      }));
    }
  };

  const checkPassword = () => {
    setErrors((prev) => ({
      ...prev,
      password: !(password.trim().length > 5),
    }));
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    let trimUser = username.trim();

    // Basic checks if user somehow messes with the page to submit (bypassing validation)
    if (!usernameFriendly(trimUser) || password.trim().length < 6) {
      global.alerts.actions.addAlert({
        type: global.alerts.types.error,
        content: "Invalid inputs.",
      });
      return;
    }

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.trim(),
        password: password.trim(),
      }),
    });

    if (res.ok) {
      const result = await signIn("credentials", {
        redirect: false,
        username: username.trim(),
        password: password.trim(),
      });

      if (!result.error) {
        // Successfully logged in & redirect
        await loginInFirebase();
        router.replace("/");
        return;
      }
    } else {
      global.alerts.actions.addAlert({
        type: global.alerts.types.error,
        content: "Please re-verify your inputs.",
      });
    }
  };

  return (
    <div className={classes.containerWrap}>
      <div className={classes.wrapper}>
        <Card className={classes["main-content-wrapper"]}>
          <div className={classes.logo}>
            <Image
              className={classes.logo}
              src={`/images/assets/instagram-logo${
                global.theme.state === global.theme.types.DARK ? "-dark" : ""
              }.png`}
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
              type="text"
              name="username"
              placeholder="Username"
              minLength="3"
              maxLength="30"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={isUnused}
              errMsg={
                errors.extraUsernameMsg || "Please enter a valid username."
              }
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
    </div>
  );
};

export default SignUp;
