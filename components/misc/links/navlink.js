import Link from "next/link";
import { useRouter } from "next/router";

import classes from "./navLink.module.css";

const NavLink = (props) => {
  const router = useRouter();
  const isActive = router.asPath == props.to;

  if (isActive && props.activeEl) {
    return (
      <Link href={props.to} passHref>
        <a>{props.activeEl}</a>
      </Link>
    );
  }

  return (
    <Link href={props.to} passHref>
      <a className={router.pathname == props.to ? classes.active : ""}>
        {props.children}
      </a>
    </Link>
  );
};

export default NavLink;
