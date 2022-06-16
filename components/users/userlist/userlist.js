import Image from "next/image";
import Link from "next/link";

import FollowButton from "../followbtn/followbtn";

import classes from "./userlist.module.css";

const UserList = ({ shared, notShared }) => {
  const sharedUsers = shared.map((user) => <User key={user._id} user={user} />);

  const notSharedUsers = notShared.map((user) => (
    <User key={user._id} user={user} showActions />
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
    <div className={classes.wrapper}>
      <div className={classes.infoContainer}>
        <div className={classes.img}>
          <Image
            src={user.profilePic.url}
            alt={`${user.name}'s Profile Picture`}
            width="500"
            height="500"
            layout="responsive"
            className={classes.rounded}
          />
        </div>

        <div className={classes.userInfo}>
          <Link href={`/${user.username}`}>
            <a>{user.name}</a>
          </Link>
          <p>@{user.username}</p>
        </div>
      </div>

      {showActions && (
        <FollowButton
          username={user.username}
          viewerIsFollowing={false}
          updateFollowCount={() => {}}
          className={classes.action}
        />
      )}
    </div>
  );
};
