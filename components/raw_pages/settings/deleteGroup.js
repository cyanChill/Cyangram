import Button from "../../form_elements/button";
import Label from "../../form_elements/label";
import InputGroup from "../../form_elements/inputGroup";

import classes from "./settingspage.module.css";

const DeleteGroup = () => {
  const deleteAccount = (e) => {
    e.preventDefault();
    /* 
      TODO: Make modal appear for confirmation before deletion
    */
    console.log("Confirmation of Deletion?");
  };

  return (
    <form onSubmit={deleteAccount}>
      <InputGroup>
        <Label>Permanently Delete Account?</Label>
        <div className={classes.alignRight}>
          <Button type="submit" variant="error" sizeFit>
            Delete Account
          </Button>
        </div>
      </InputGroup>
    </form>
  );
};

export default DeleteGroup;
