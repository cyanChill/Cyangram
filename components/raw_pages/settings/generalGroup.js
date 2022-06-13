import { useState, useEffect } from "react";

import global from "../../../global";
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
      (name.trim() != prevData.name &&
        name.trim().length > 3 &&
        name.trim().length < 31) ||
      (username.trim() != prevData.username &&
        username.trim().length > 3 &&
        username.trim().length < 31) ||
      bio.trim() != prevData.bio
    ) {
      userDataStatus = true;
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

    if (res.ok) {
      global.alerts.actions.addAlert({
        type: global.alerts.types.success,
        content: data.message,
      });

      setError({ name: false, username: false });
      setPrevData({ name: name, username: username, bio: bio });
    } else {
      global.alerts.actions.addAlert({
        type: global.alerts.types.error,
        content: `An Error Has Occurred: ${data.message}`,
      });
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
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={checkValidField}
            errMsg="Name must be between 3 & 30 characters long."
            hasErr={error.name}
          />
        </InputGroup>
        <InputGroup>
          <Label>Username</Label>
          <FormInput
            name="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={checkValidField}
            errMsg="Username must be between 3 & 30 characters long."
            hasErr={error.username}
          />
        </InputGroup>
        <InputGroup ignoreAlign>
          <Label>Bio</Label>
          <FormInput
            type="textarea"
            rows={3}
            noResize
            required
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
