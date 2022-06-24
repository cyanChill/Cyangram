import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

import global from "../../../global";
import { loginInFirebase } from "../../../lib/firebaseHelpers";
import { usernameFriendly } from "../../../lib/validate";
import Button from "../../formElements/button";
import FormInput from "../../formElements/formInput";
import Card from "../../ui/card/card";
import AppLogo from "../../ui/appLogo/appLogo";
import classes from "./authStyles.module.css";

const Login = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    if (usernameFriendly(username) && password.trim().length > 5) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [username, password]);

  const loginHandler = async (e) => {
    e.preventDefault();
    /* Final Client-Side Checks before attempt submission to backend */
    if (!usernameFriendly(username) || password.trim().length < 6) {
      global.alerts.actions.addAlert({
        type: global.alerts.types.error,
        content: "Invalid inputs.",
      });
      setCanSubmit(false);
      return;
    }

    const userInfoObj = { username: username, password: password.trim() };

    const result = await signIn("credentials", {
      redirect: false,
      ...userInfoObj,
    });

    if (!result.error) {
      try {
        // Successfully logged in & redirect
        await loginInFirebase();
        router.replace("/");
        return;
      } catch (err) {
        // Failed to log into firebase
        await signOut();
      }
    }

    global.alerts.actions.addAlert({
      type: global.alerts.types.error,
      content: "Failed to log in.",
    });
  };

  return (
    <div className={classes.containerWrap}>
      <div className={classes.wrapper}>
        <Card className={classes["main-content-wrapper"]}>
          <AppLogo />

          <form onSubmit={loginHandler}>
            <FormInput
              type="text"
              placeholder="Username"
              minLength="8"
              maxLength="30"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())}
            />
            <FormInput
              type="password"
              placeholder="Password"
              minLength="6"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value.trimStart())}
              onBlur={() => setUsername((prev) => prev.trimEnd())}
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
