import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { MdOutlineArrowBack } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";

import FollowButton from "../../users/followbtn/followbtn";
import PostGrid from "../../posts/post_grid/post_grid";
import TextBreaker from "../../ui/textbreaker/textbreaker";

import classes from "./profilepage.module.css";

const UserProfilePage = ({ userData, ownProfile, viewerIsFollowing }) => {
  const router = useRouter();

  const { user, followingCnt, posts } = userData;
  const [followerCnt, setFollowerCnt] = useState();

  useEffect(() => {
    /* 
      If we only used useState, then if goto our profile after looking at
      someone else's profile page, we'll have the same followerCnt value
    */
    setFollowerCnt(userData.followerCnt);
  }, [userData]);

  const updateFollowCnt = (didFollow) => {
    setFollowerCnt((prev) => prev + (didFollow ? 1 : -1));
  };

  return (
    <div className={classes.wrapper}>
      {/* Header bar */}
      <header>
        {/* If this is the user's profile, don't show the back button*/}
        {!ownProfile && (
          <MdOutlineArrowBack
            className={classes.hoverCursor}
            onClick={() => router.back()}
          />
        )}

        <span className={classes.name}>{user.username}</span>
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
        <FollowButton
          username={user.username}
          viewerIsFollowing={viewerIsFollowing}
          updateFollowCount={updateFollowCnt}
        />
      )}

      {/* Posts */}
      <PostGrid posts={userData.posts} />
    </div>
  );
};

export default UserProfilePage;
