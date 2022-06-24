import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";

import global from "../../../global";
import { callApiWithAppCheck } from "../../../lib/firebaseHelpers";
import { isImage, validImageSize } from "../../../lib/validate";
import FormInput from "../../formElements/formInput";
import Button from "../../formElements/button";
import classes from "./createPost.module.css";

const CreatePost = () => {
  const router = useRouter();

  const postImgRef = useRef(null);
  const imgInputRef = useRef(null);
  const iconRef = useRef(null);
  const [imageUpload, setImageUpload] = useState(null);
  const [description, setDescription] = useState("");
  const [disableSubmit, setDisableSubmit] = useState(false);

  useEffect(() => {
    imgInputRef.current.addEventListener("change", function () {
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
        postImgRef.current.style.backgroundImage = `url(${uploadedImg})`;

        iconRef.current.style.display = "none";
      });
      reader.readAsDataURL(this.files[0]);
    });
  }, []);

  const handlePostCreation = async () => {
    if (
      imageUpload == null ||
      !isImage(imageUpload) ||
      description.trim().length > 200
    ) {
      return;
    }

    setDisableSubmit(true);

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
      setDisableSubmit(false);
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
          className={classes.selectImg}
          onClick={() => imgInputRef.current.click()}
          ref={postImgRef}
        >
          <p className={classes.iconSize} ref={iconRef}>
            <AiOutlinePlus />
          </p>
        </button>
        <input
          type="file"
          accept="image/jpeg, image/png, image/jpg"
          className={classes.selectImgInput}
          onChange={(e) => {
            if (e.target.files.length === 0) return;
            if (isImage(e.target.files[0])) {
              setImageUpload(e.target.files[0]);
            }
          }}
          ref={imgInputRef}
        />

        <div className={classes.actions}>
          <section className={classes.descriptionGroup}>
            <label className={classes.label}>Description:</label>
            <FormInput
              type="textarea"
              maxLength="200"
              rows={5}
              noResize
              value={description}
              onChange={(e) => setDescription(e.target.value.trimStart())}
              onBlur={() => setDescription((prev) => prev.trimEnd())}
            />
          </section>

          <div className={classes.alignRight}>
            <Button
              onClick={handlePostCreation}
              disabled={!imageUpload || disableSubmit}
            >
              Create New Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
