import Link from "next/link";

import classes from "./error.module.css";

const Error = () => {
  return (
    <div className={classes.pgwrap}>
      <h1>Sorry, this page isn&apos;t available.</h1>
      <p>
        The link you followed may be broken, or the page may have been removed.{" "}
        <span className={classes.link}>
          <Link href="/">Go back to Instagram.</Link>
        </span>
      </p>
    </div>
  );
};

export default Error;

export const ErrorOffline = () => {
  return (
    <div className={classes.pgwrap}>
      <h1>Sorry, this page isn&apos;t available.</h1>
      <p>
        Sorry, it seems like you are offline and the page was not found in the
        cache.{" "}
        <span className={classes.link}>
          <Link href="/">Go back to the home page which is cached.</Link>
        </span>
      </p>
    </div>
  );
};
