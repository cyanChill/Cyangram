import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { AiOutlinePlus } from "react-icons/ai";

import { storage } from "../../../firebase.config";
import { deleteImg } from "../../../lib/firebaseHelpers";
import FormInput from "../../form_elements/forminput";
import InputGroup from "../../form_elements/inputGroup";
import Button from "../../form_elements/button";

import classes from "./newpostpage.module.css";

const NewPostPage = ({ userId }) => {
  const router = useRouter();

  const [imageUpload, setImageUpload] = useState(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const imgInput = document.getElementById("imgInput");
    imgInput.addEventListener("change", function () {
      if (this.files.length === 0) return;

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const uploadedImg = reader.result;
        document.getElementById(
          "postImg"
        ).style.backgroundImage = `url(${uploadedImg})`;

        document.getElementById("add-icon").style.display = "none";
      });
      reader.readAsDataURL(this.files[0]);
    });
  }, []);

  const createPost = async () => {
    if (imageUpload == null) return;

    // Access a folder for the given userId in Firebase
    const imgIdentifier = uuidv4();
    const imgRef = ref(storage, `${userId}/${imgIdentifier}`);
    const imgUploadRes = await uploadBytes(imgRef, imageUpload);
    const downloadURL = await getDownloadURL(imgUploadRes.ref);

    const res = await fetch("/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: description,
        imgInfo: { url: downloadURL, identifier: imgIdentifier },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      await deleteImg(userId, imgIdentifier);
      console.log("Failed to create post");
      return;
    }

    console.log("Successfully created post");
    router.replace(`/p/${data.postId}`);
  };

  return (
    <div className={classes.wrapper}>
      <h2>Create a New Post</h2>
      <button
        id="postImg"
        className={classes.selectImg}
        onClick={() => document.getElementById("imgInput").click()}
      >
        <AiOutlinePlus id="add-icon" className={classes.iconSize} />
      </button>
      <input
        type="file"
        id="imgInput"
        accept="image/jpeg, image/png, image/jpg"
        className={classes.selectImgInput}
        onChange={(e) => {
          if (e.target.files.length > 0) {
            setImageUpload(e.target.files[0]);
          }
        }}
      />

      <InputGroup ignoreAlign className={classes.descriptionGroup}>
        <label className={classes.label}>Description:</label>
        <FormInput
          type="textarea"
          rows={3}
          noResize
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </InputGroup>

      <div className={classes.alignRight}>
        <Button onClick={createPost} disabled={!imageUpload}>
          Create New Post
        </Button>
      </div>
    </div>
  );
};

export default NewPostPage;
