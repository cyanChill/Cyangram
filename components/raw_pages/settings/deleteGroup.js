import { signOut } from "next-auth/react";
import { useState } from "react";

import { logoutFirebase } from "../../../lib/firebaseHelpers";
import Button from "../../form_elements/button";
import Label from "../../form_elements/label";
import InputGroup from "../../form_elements/inputGroup";
import Modal from "../../ui/modal/modal";

import classes from "./settingspage.module.css";

const DeleteGroup = () => {
  const [modalActive, setModalActive] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteAccount = async () => {
    setIsDeleting(true);
    const res = await fetch("/api/account/delete", { method: "DELETE" });

    if (res.ok) {
      alert("Account Successfully Deleted.");
      await signOut();
    }
  };

  return (
    <>
      <InputGroup>
        <Label>Permanently Delete Account?</Label>
        <div className={classes.alignRight}>
          <Button
            type="submit"
            variant="error"
            sizeFit
            onClick={() => setModalActive(true)}
          >
            Delete Account
          </Button>
        </div>
      </InputGroup>

      {/* Delete confirmation modal */}
      <Modal active={modalActive}>
        <p className={classes.modalText}>Confirm Account Deletion?</p>
        <span className={classes.important}>
          This will delete all content related to your account and{" "}
          <span className={classes.bold}>IS NOT REVERSIBLE.</span>
        </span>
        <div className={classes.modalActions}>
          <Button
            className={classes.modalBtn}
            onClick={() => setModalActive(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            className={classes.modalBtn}
            onClick={deleteAccount}
            disabled={isDeleting}
            variant="error"
          >
            Ok
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default DeleteGroup;
