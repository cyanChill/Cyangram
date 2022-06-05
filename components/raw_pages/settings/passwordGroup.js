import { useState, useEffect } from "react";

import Button from "../../form_elements/button";
import Label from "../../form_elements/label";
import FormInput from "../../form_elements/forminput";
import InputGroup from "../../form_elements/inputGroup";

import classes from "./settingspage.module.css";

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
    let newPasswordStatus = false;
    if (newPassword !== confirmPassword) {
      newPasswordStatus = true;
    }

    setError(newPasswordStatus);
  };

  // Main Functions
  const updatePasswordHandler = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/account/update-password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oldPassword: password,
        newPassword: newPassword,
        confirmedNewPassword: confirmPassword,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      /* TODO: Add Success modal/alert */
      console.log(`Success!: ${data.message}`);

      // Clear fields
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError(false);
    } else {
      console.log(`An Error Has Occurred: ${data.message}`);
      /* TODO: Add error modal/alert */
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
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <Label>New Password</Label>
          <FormInput
            type="password"
            minLength="6"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onBlur={checkNewPassword}
          />
        </InputGroup>
        <InputGroup>
          <Label>Confirm New Password</Label>
          <FormInput
            type="password"
            minLength="6"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={checkNewPassword}
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
