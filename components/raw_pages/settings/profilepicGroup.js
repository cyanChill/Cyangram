import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Image from "next/image";

import { storage } from "../../../firebase.config";
import { deleteImg } from "../../../lib/firebaseHelpers";
import Button from "../../form_elements/button";

import classes from "./profilepicGroup.module.css";

const ProfilePicGroup = ({ userData: { profilePic, userId, name } }) => {
  const [imageUpload, setImageUpload] = useState(null);
  const [currImg, setCurrImg] = useState(profilePic);

  /* Handles when we want to set a new profile picture */
  useEffect(() => {
    if (imageUpload == null) return;

    const setNewProfilePic = async () => {
      // Access a folder for the given userId in Firebase
      const imgIdentifier = uuidv4();
      const imgRef = ref(storage, `${userId}/${imgIdentifier}`);
      const imgUploadRes = await uploadBytes(imgRef, imageUpload);
      const downloadURL = await getDownloadURL(imgUploadRes.ref);

      const res = await fetch("/api/account/update-pic", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "SET",
          imgInfo: { url: downloadURL, identifier: imgIdentifier },
        }),
      });

      if (!res.ok) {
        await deleteImg(userId, imgIdentifier);
        console.log("Failed to update profile picture");
        return;
      }

      /* Remove previous profile picture from database (if not default) & update displayed image*/
      if (currImg.identifier !== "default_profile_picture") {
        await deleteImg(userId, currImg.identifier);
      }
      setCurrImg({
        url: downloadURL,
        identifier: imgIdentifier,
      });

      console.log("Successfully updated profile picture");
      /* Some sort of success alert. */
      setImageUpload(null);
    };

    setNewProfilePic();
  }, [imageUpload]);

  const removeProfilePic = async () => {
    const res = await fetch("/api/account/update-pic", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "REMOVE",
      }),
    });

    if (!res.ok) {
      await deleteImg(userId, imgIdentifier);
      console.log("Failed to remove profile picture");
      return;
    }

    /* Remove previous profile picture from database (if not default) & update displayed image*/
    if (currImg.identifier !== "default_profile_picture") {
      await deleteImg(userId, currImg.identifier);
    }
    setCurrImg({
      url: `${process.env.NEXT_PUBLIC_DEFAULT_PROFILEPIC_URL}`,
      identifier: "default_profile_picture",
    });

    console.log("Successfully removed profile picture");
    /* Some sort of success alert. */
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
