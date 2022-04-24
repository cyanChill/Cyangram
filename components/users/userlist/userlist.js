import Image from "next/image";
import Link from "next/link";

import classes from "./userlist.module.css";

const UserList = ({ shared, notShared }) => {
  const sharedUsers = shared.map((user) => (
    <User key={user.userId} user={user} />
  ));

  const notSharedUsers = notShared.map((user) => (
    <User key={user.userId} user={user} showActions />
  ));

  return (
    <div>
      {sharedUsers}
      {notSharedUsers}
    </div>
  );
};

export default UserList;

const User = ({ user, showActions }) => {
  return (
    <div className={classes.userContainer}>
      <div className={classes.infoContainer}>
        <img
          src={user.profileImg}
          alt={`${user.name}'s Profile Picture`}
          className={classes.img}
        />

        <div className={classes.userInfo}>
          <Link href={`/${user.username}`}>
            <a>{user.name}</a>
          </Link>
          <p>@{user.username}</p>
        </div>
      </div>

      {showActions && <div className={classes.actions}>Follow</div>}
    </div>
  );
};
