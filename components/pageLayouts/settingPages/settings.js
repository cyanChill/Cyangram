import GeneralGroup from "./generalGroup";
import PasswordGroup from "./passwordGroup";
import DeleteGroup from "./deleteGroup";
import ProfilePicGroup from "./profilepicGroup";
import classes from "./settings.module.css";

const Settings = ({ userData }) => {
  return (
    <div className={classes.wrapper}>
      <h1>Settings</h1>
      <ProfilePicGroup userData={userData} />
      <hr />
      <GeneralGroup userData={userData} />
      <hr />
      <PasswordGroup />
      <hr />
      <DeleteGroup />
    </div>
  );
};

export default Settings;
