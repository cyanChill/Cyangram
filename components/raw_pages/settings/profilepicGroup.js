import { useState, useEffect } from "react";
import Image from "next/image";

import global from "../../../global";
import { callApiWithAppCheck } from "../../../lib/firebaseHelpers";
import Button from "../../form_elements/button";

import classes from "./profilepicGroup.module.css";

const ProfilePicGroup = ({ userData: { profilePic, name } }) => {
  const [imageUpload, setImageUpload] = useState(null);
  const [currImg, setCurrImg] = useState(profilePic);

  /* Handles when we want to set a new profile picture */
  useEffect(() => {
    if (imageUpload == null) return;

    const setNewProfilePic = async () => {
      // Data we'll pass to backend
      const formData = new FormData();
      formData.append("action", "SET");
      formData.append("uploadedImg", imageUpload);

      const route = "/api/account/update-pic";

      const res = await callApiWithAppCheck(route, "PATCH", {}, formData);
      const data = await res.json();

      if (!res.ok) {
        global.alerts.actions.addAlert({
          type: global.alerts.types.error,
          content: `Failed to update profile picture [${data.message}]`,
        });
        return;
      }

      setCurrImg(data.newProfilePic);

      global.alerts.actions.addAlert({
        type: global.alerts.types.success,
        content: "Successfully updated profile picture.",
      });
      setImageUpload(null);
    };

    setNewProfilePic();
  }, [imageUpload]);

  const removeProfilePic = async () => {
    // Data we'll pass to backend
    const formData = new FormData();
    formData.append("action", "REMOVE");

    const route = "/api/account/update-pic";

    const res = await callApiWithAppCheck(route, "PATCH", {}, formData);
    const data = await res.json();

    if (!res.ok) {
      global.alerts.actions.addAlert({
        type: global.alerts.types.error,
        content: "Failed to remove profile picture.",
      });
      return;
    }

    setCurrImg(data.newProfilePic);

    global.alerts.actions.addAlert({
      type: global.alerts.types.success,
      content: "Successfully removed profile picture.",
    });
  };

  return (
    <>
      <h2>Update Profile Picture Settings</h2>
      <div className={classes.profileContainer}>
        <div className={classes.imgContainer}>
          <Image
            src={currImg.url}
            alt={`${name}'s profile pic`}
            layout="responsive"
            width="500"
            height="500"
            priority
          />
        </div>

        <div className={classes.profileActions}>
          <Button
            onClick={() => document.getElementById("profileImgInput").click()}
          >
            Set New Profile Picture
          </Button>
          <input
            type="file"
            id="profileImgInput"
            accept="image/jpeg, image/png, image/jpg"
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files.length > 0) {
                setImageUpload(e.target.files[0]);
              }
            }}
          />
          <Button
            variant="error"
            onClick={removeProfilePic}
            disabled={currImg.identifier === "default_profile_picture"}
          >
            Remove Profile Picture
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProfilePicGroup;
