import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { MdOutlineArrowBack } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";

import global from "../../../global";
import PostGrid from "../../posts/post_grid/post_grid";
import Button from "../../form_elements/button";
import TextBreaker from "../../ui/textbreaker/textbreaker";

import classes from "./profilepage.module.css";

const UserProfilePage = ({ userData, ownProfile, viewerIsFollowing }) => {
  const router = useRouter();

  const { user, followingCnt, posts } = userData;
  const [followerCnt, setFollowerCnt] = useState(userData.followerCnt);
  const [isFollowing, setIsFollowing] = useState(viewerIsFollowing);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    setLoading(true);
    const res = await fetch(`/api/users/${user.username}/follow`, {
      method: "POST",
    });
    const data = await res.json();

    global.alerts.actions.addAlert({
      type: global.alerts.types[res.ok ? "success" : "error"],
      content: data.message,
    });

    setIsFollowing(data.follow);
    setFollowerCnt((prev) => prev + (!!data.follow ? 1 : -1));
    setLoading(false);
  };

  return (
    <div className={classes.profile}>
      {/* Header bar */}
      <header>
        <div>
          {/* If this is the user's profile, don't show the back button*/}
          {!ownProfile && (
            <MdOutlineArrowBack
              className={classes.hoverCursor}
              onClick={() => router.back()}
            />
          )}

          <span className={classes.name}>{user.username}</span>
        </div>

        {ownProfile && (
          <IoSettingsSharp
            className={classes.setting}
            onClick={() => router.push(`/accounts/settings`)}
          />
        )}
      </header>

      {/* Profile Picture + User Stats */}
      <section>
        <Image
          src={user.profilePic.url}
          alt={`${user.name}'s Profile Picture`}
          width={80}
          height={80}
        />
        <div>
          <p>
            <span className={classes.num}>{posts.length}</span>
            <span className={classes.label}>Posts</span>
          </p>
          <p
            onClick={() => router.push(`${router.asPath}/followers`)}
            className={classes.link}
          >
            <span className={classes.num}>{followerCnt}</span>
            <span className={classes.label}>Followers</span>
          </p>
          <p
            onClick={() => router.push(`${router.asPath}/following`)}
            className={classes.link}
          >
            <span className={classes.num}>{followingCnt}</span>
            <span className={classes.label}>Following</span>
          </p>
        </div>
      </section>
      <p className={classes.name}>{user.name}</p>
      <TextBreaker className={classes.bio}>{user.bio}</TextBreaker>

      {/* Action Buttons */}
      {!ownProfile && (
        <div className={classes.actions}>
          <Button
            className={classes.noHover}
            onClick={handleFollow}
            disabled={loading}
          >
            {!isFollowing ? "Follow" : "Following"}
          </Button>

          <Button
            className={classes.onHover}
            onClick={handleFollow}
            disabled={loading}
            variant={!isFollowing ? "primary" : "error"}
          >
            {!isFollowing ? "Follow" : "Un-Follow"}
          </Button>
        </div>
      )}

      {/* Posts */}
      <PostGrid posts={userData.posts} />
    </div>
  );
};

export default UserProfilePage;
