import { useState, useEffect } from "react";
import Router from "next/router";

import global from "../../../global";
import { nameFriendly, usernameFriendly } from "../../../lib/validate";
import Button from "../../form_elements/button";
import Label from "../../form_elements/label";
import FormInput from "../../form_elements/forminput";
import InputGroup from "../../form_elements/inputGroup";

import classes from "./settingspage.module.css";

const GeneralGroup = ({ userData }) => {
  const [prevData, setPrevData] = useState({ ...userData });
  const [name, setName] = useState(userData.name);
  const [username, setUsername] = useState(userData.username);
  const [bio, setBio] = useState(userData.bio);
  const [canSubmit, setCanSubmit] = useState(false);
  const [error, setError] = useState({
    name: false,
    username: false,
  });

  // Check to see if we can submit updates
  useEffect(() => {
    let userDataStatus = false;

    if (
      name.trim() !== prevData.name ||
      username !== prevData.username ||
      bio !== prevData.bio
    ) {
      if (
        nameFriendly(name) &&
        usernameFriendly(username) &&
        bio.length <= 200
      ) {
        userDataStatus = true;
      }
    }

    setCanSubmit(userDataStatus);
  }, [name, username, bio, prevData]);

  // Helper Functions
  const checkValidField = (e) => {
    let status = false;
    if (e.target.value.length < 3 || e.target.value.length > 30) {
      status = true;
    }

    setError((prev) => ({
      ...prev,
      [e.target.name]: status,
    }));
  };

  // Main Function
  const updateGeneralHandler = async (e) => {
    e.preventDefault();
    // Revalidate inputs
    if (
      name !== prevData.name ||
      username !== prevData.username ||
      bio !== prevData.bio
    ) {
      if (
        nameFriendly(name) &&
        usernameFriendly(username) &&
        bio.length <= 200
      ) {
        setCanSubmit(false);
        return;
      }
    }

    const res = await fetch("/api/account/update-profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        newName: name,
        newUsername: username,
        newBio: bio,
      }),
    });
    const data = await res.json();

    global.alerts.actions.addAlert({
      type: global.alerts.types[res.ok ? "success" : "error"],
      content: data.message,
    });

    // Refresh session data if we updated profile info
    if (res.ok) {
      Router.reload();
    }
  };

  return (
    <>
      <h2>General Settings</h2>
      <form onSubmit={updateGeneralHandler}>
        <InputGroup>
          <Label>Name</Label>
          <FormInput
            name="name"
            type="text"
            minLength="3"
            maxLength="30"
            required
            value={name}
            onChange={(e) => setName(e.target.value.trimStart())}
            onBlur={(e) => {
              setName((prev) => prev.trimEnd());
              checkValidField(e);
            }}
            errMsg="Name must be between 3 & 30 characters long."
            hasErr={error.name}
          />
        </InputGroup>
        <InputGroup>
          <Label>Username</Label>
          <FormInput
            name="username"
            type="text"
            minLength="3"
            maxLength="30"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value.trim())}
            onBlur={checkValidField}
            errMsg="Username must be between 3 & 30 characters long."
            hasErr={error.username}
          />
        </InputGroup>
        <InputGroup ignoreAlign>
          <Label>Bio</Label>
          <FormInput
            type="textarea"
            maxLength="200"
            rows={3}
            noResize
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </InputGroup>

        <div className={classes.alignRight}>
          <Button type="submit" disabled={!canSubmit}>
            Update Profile Info
          </Button>
        </div>
      </form>
    </>
  );
};

export default GeneralGroup;
