import GeneralGroup from "./generalGroup";
import PasswordGroup from "./passwordGroup";
import DeleteGroup from "./deleteGroup";
import ProfilePicGroup from "./profilepicGroup";
import classes from "./settingspage.module.css";

const UserSettingsPage = ({ userData }) => {
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

export default UserSettingsPage;
