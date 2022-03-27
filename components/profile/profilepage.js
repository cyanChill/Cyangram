import { useRouter } from "next/router";
import Image from "next/image";
import { MdOutlineArrowBack } from "react-icons/md";

import PostGrid from "../../components/posts/post_grid/post_grid";
import Button from "../../components/form_elements/button";
import classes from "./profilepage.module.css";

const UserProfilePage = ({ userData, ownProfile }) => {
  const router = useRouter();
  console.log(router);

  const { user, followerCnt, followingCnt, posts } = userData;

  return (
    <div className={classes.profile}>
      {/* Header bar */}
      <header>
        {/* If this is the user's profile, don't show the back button*/}
        {!ownProfile && <MdOutlineArrowBack onClick={() => router.back()} />}

        <span className={classes.name}>{user.username}</span>
      </header>

      {/* Profile Picture + User Stats */}
      <section>
        <Image
          src={user.image}
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
      <p className={classes.bio}>{user.bio}</p>

      {/* Action Buttons */}
      <div className={classes.actions}>
        <Button>Follow</Button>
        <Button variant="transparent" outline>
          Message
        </Button>
      </div>

      {/* Posts */}
      <PostGrid posts={userData.posts} />
    </div>
  );
};

export default UserProfilePage;
