import Link from "next/link";

import classes from "./usernameLink.module.css";

const Username = ({ username, className }) => {
  return (
    <span className={className}>
      <Link href={`/${username}`}>
        <a className={classes.text}>{username}</a>
      </Link>
    </span>
  );
};

export default Username;
