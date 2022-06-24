import { useState, useEffect } from "react";

import global from "../../../global";
import Button from "../../formElements/button";
import Label from "../../formElements/label";
import FormInput from "../../formElements/formInput";
import InputGroup from "../../formElements/inputGroup";
import classes from "./settings.module.css";

const PasswordGroup = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [error, setError] = useState(false);

  // Check to see if we can submit updates
  useEffect(() => {
    let passwordStatus = false;
    if (
      password.trim().length > 5 &&
      newPassword.trim().length > 5 &&
      confirmPassword.trim().length > 5 &&
      password !== newPassword &&
      newPassword === confirmPassword
    ) {
      passwordStatus = true;
    }

    setCanSubmit(passwordStatus);
  }, [password, newPassword, confirmPassword]);

  // Helper Functions
  const checkNewPassword = () => {
    setError(newPassword !== confirmPassword);
  };

  // Main Functions
  const updatePasswordHandler = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (
      password.trim().length < 6 &&
      newPassword.trim().length < 6 &&
      confirmPassword.trim().length < 6 &&
      password === newPassword &&
      newPassword !== confirmPassword
    ) {
      global.alerts.actions.addAlert({
        type: global.alerts.types.error,
        content: "There was a problem with one of your inputs.",
      });
      setCanSubmit(false);
      return;
    }

    const res = await fetch("/api/account/update-password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        oldPassword: password.trim(),
        newPassword: newPassword.trim(),
        confirmedNewPassword: confirmPassword.trim(),
      }),
    });
    const data = await res.json();

    global.alerts.actions.addAlert({
      type: global.alerts.types[res.ok ? "success" : "error"],
      content: data.message,
    });

    // Clear fields if we updated password
    if (res.ok) {
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError(false);
    }
  };

  return (
    <>
      <h2>Update Password</h2>
      <form onSubmit={updatePasswordHandler}>
        <InputGroup>
          <Label>Old Password</Label>
          <FormInput
            type="password"
            minLength="6"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value.trimStart())}
            onBlur={() => setPassword((prev) => prev.trimEnd())}
          />
        </InputGroup>
        <InputGroup>
          <Label>New Password</Label>
          <FormInput
            type="password"
            minLength="6"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value.trimStart())}
            onBlur={() => {
              setNewPassword((prev) => prev.trimEnd());
              checkNewPassword();
            }}
          />
        </InputGroup>
        <InputGroup>
          <Label>Confirm New Password</Label>
          <FormInput
            type="password"
            minLength="6"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value.trimStart())}
            onBlur={() => {
              setConfirmPassword((prev) => prev.trimEnd());
              checkNewPassword();
            }}
            errMsg="New & Confirmed Passwords are not the same."
            hasErr={error}
          />
        </InputGroup>
        <div className={classes.alignRight}>
          <Button type="submit" disabled={!canSubmit}>
            Update Password
          </Button>
        </div>
      </form>
    </>
  );
};

export default PasswordGroup;
