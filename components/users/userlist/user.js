import Link from "next/link";

import FollowButton from "../followbtn/followbtn";
import LoadImage from "../../ui/loadimage/loadimage";

import classes from "./userlist.module.css";

const User = ({ user, showActions, updateFollowCount }) => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.infoContainer}>
        <div className={classes.img}>
          <LoadImage
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
          updateFollowCount={updateFollowCount}
          className={classes.action}
        />
      )}
    </div>
  );
};

export default User;
