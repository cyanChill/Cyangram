/* 
  Group 1:
    - Change Profile Picture
    - Change Name
    - Change Username
    - Change Bio

  Group 2:
    - Change Password

  Group 3:
    - Delete Account
*/

import GeneralGroup from "./generalGroup";
import PasswordGroup from "./passwordGroup";
import DeleteGroup from "./deleteGroup";

import classes from "./settingspage.module.css";
import ProfilePicGroup from "./profilepicGroup";

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
