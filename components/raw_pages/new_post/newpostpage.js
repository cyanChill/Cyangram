import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";

import global from "../../../global";
import { callApiWithAppCheck } from "../../../lib/firebaseHelpers";
import { isImage, validImageSize } from "../../../lib/validate";
import FormInput from "../../form_elements/forminput";
import Button from "../../form_elements/button";
import classes from "./newpostpage.module.css";

const NewPostPage = () => {
  const router = useRouter();

  const [imageUpload, setImageUpload] = useState(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const imgInput = document.getElementById("imgInput");
    imgInput.addEventListener("change", function () {
      if (this.files.length === 0 || !isImage(this.files[0])) {
        global.alerts.actions.addAlert({
          type: global.alerts.types.error,
          content: "File must be an image.",
        });
        return;
      }

      /* Validate Upload Image is <5MB in size */
      if (!validImageSize(this.files[0].size, 5)) {
        setImageUpload(null);
        global.alerts.actions.addAlert({
          type: global.alerts.types.error,
          content: "Image must be <5MB in size.",
        });
        return;
      }

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
    if (
      imageUpload == null ||
      !isImage(imageUpload) ||
      description.trim().length > 200
    ) {
      return;
    }

    // Data we'll pass to backend
    const formData = new FormData();
    formData.append("description", description.trim());
    formData.append("uploadedImg", imageUpload);

    const res = await callApiWithAppCheck("/api/post", "POST", {}, formData);
    const data = await res.json();

    if (!res.ok) {
      global.alerts.actions.addAlert({
        type: global.alerts.types.error,
        content: `Failed to create post [${data.message}]`,
      });
    } else {
      global.alerts.actions.addAlert({
        type: global.alerts.types.success,
        content: "Successfully created post.",
      });
      router.replace(`/p/${data.postId}`);
    }
  };

  return (
    <div className={classes.wrapper}>
      <h2 className={classes.header}>Create new post</h2>
      <div className={classes.content}>
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
            if (e.target.files.length === 0) return;
            if (isImage(e.target.files[0])) {
              setImageUpload(e.target.files[0]);
            }
          }}
        />

        <div className={classes.actions}>
          <section className={classes.descriptionGroup}>
            <label className={classes.label}>Description:</label>
            <FormInput
              type="textarea"
              maxLength="200"
              rows={3}
              noResize
              value={description}
              onChange={(e) => setDescription(e.target.value.trimStart())}
              onBlur={() => setDescription((prev) => prev.trimEnd())}
            />
          </section>

          <div className={classes.alignRight}>
            <Button onClick={createPost} disabled={!imageUpload}>
              Create New Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPostPage;
