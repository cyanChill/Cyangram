import { useState } from "react";

import global from "../../../global";
import Button from "../../form_elements/button";

import classes from "./followbtn.module.css";

const FollowButton = ({
  username,
  viewerIsFollowing,
  updateFollowCount,
  className,
}) => {
  const [isFollowing, setIsFollowing] = useState(viewerIsFollowing);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    setLoading(true);
    const res = await fetch(`/api/users/${username}/follow`, {
      method: "POST",
    });
    const data = await res.json();

    global.alerts.actions.addAlert({
      type: global.alerts.types[res.ok ? "success" : "error"],
      content: data.message,
    });

    // If the like request was successfully, update client-side info
    if (res.ok) {
      setIsFollowing(data.follow);
      updateFollowCount(!!data.follow);
    }

    setLoading(false);
  };

  return (
    <div className={`${classes.actions} ${className}`}>
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
  );
};

export default FollowButton;
