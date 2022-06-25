import { useState, useEffect, useRef } from "react";

import global from "../../../global";
import FormInput from "../../formElements/formInput";
import classes from "./admin.module.css";

const Admin = () => {
  const deleteItemById = async (id, type) => {
    const res = await fetch(`/api/admin/delete?type=${type}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    });
    return res.ok;
  };

  const deletePostById = async (id) => {
    const res = await fetch(`/api/post/${id}`, { method: "DELETE" });
    return res.ok;
  };

  return (
    <div className={classes.wrapper}>
      <h1>Admin Panel</h1>
      <div className={classes.important}>
        You will be permanently deleting that user, post, or comment when you
        click the submit button.
      </div>

      <DeleteCategory type="user" handleFunc={deleteItemById} />
      <DeleteCategory type="post" handleFunc={deletePostById} />
      <DeleteCategory type="comment" handleFunc={deleteItemById} />
    </div>
  );
};

export default Admin;

const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const DeleteCategory = ({ type, handleFunc }) => {
  const confirmRef = useRef(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const [id, setId] = useState("");

  const useHandler = async () => {
    if (!id.trim() || !confirmRef.current.checked) {
      global.alerts.actions.addAlert({
        type: global.alerts.types.error,
        content:
          "Make sure that the input isn't empty and we accepted the disclaimer.",
      });
      return;
    }

    /* Handle response for deletion */
    const statusOk = await handleFunc(id.trim(), type.toLowerCase());
    global.alerts.actions.addAlert({
      type: global.alerts.types[statusOk ? "success" : "error"],
      content: `${statusOk ? "Successfully" : "Failed to"} delete${
        !statusOk ? "d" : ""
      } ${type.toLowerCase()}.`,
    });

    if (statusOk) {
      setCanSubmit(false);
      setId("");
    }
  };

  useEffect(() => {
    if (!id.trim()) {
      confirmRef.current.checked = false;
      setCanSubmit(false);
    }
  }, [id]);

  return (
    <>
      <h3>Delete {capitalizeFirstLetter(type)} By Id:</h3>
      <div className={classes.inputContainer}>
        <FormInput
          type="text"
          required
          placeholder={`${capitalizeFirstLetter(type)} ID`}
          value={id}
          onChange={(e) => setId(e.target.value.trim())}
          noExternalPadding
        />
        <button
          className={classes.confirmBtn}
          disabled={!canSubmit}
          onClick={useHandler}
        >
          Confirm Deletion
        </button>
      </div>
      <div className={classes.disclaimer}>
        <input
          type="checkbox"
          disabled={!id.trim()}
          ref={confirmRef}
          onChange={(e) => setCanSubmit(e.target.checked)}
        />
        <label>
          I understand that I will be permanently deleting this{" "}
          <span className={classes.bold}>{type.toUpperCase()}</span> when I
          click the &quot;Confirm Deletion&quot; button.
        </label>
      </div>
    </>
  );
};
