import { useSession } from "next-auth/react";
import {
  AiFillHome,
  AiOutlineHome,
  AiFillHeart,
  AiOutlineHeart,
} from "react-icons/ai";
import { IoSearchOutline, IoSearchSharp } from "react-icons/io5";
import { HiUserCircle, HiOutlineUserCircle } from "react-icons/hi";
import NavLink from "../misc/navlink";

import classes from "./main-navigation.module.css";

const MainNavigation = (props) => {
  const { data: session, status } = useSession();

  if (status !== "authenticated") {
    return null;
  }

  return (
    <nav className={classes.navbar}>
      <ul>
        <li>
          <NavLink to="/" activeEl={<AiFillHome />}>
            <AiOutlineHome />
          </NavLink>
        </li>
        <li>
          <NavLink to="/search" activeEl={<IoSearchSharp />}>
            <IoSearchOutline />
          </NavLink>
        </li>
        <li>
          <NavLink to="/follow-requests" activeEl={<AiFillHeart />}>
            <AiOutlineHeart />
          </NavLink>
        </li>
        <li>
          {/* activeEl will be the profile picture wrapped with a class
          that gives a border*/}
          <NavLink to={`/${session.user.username}`} activeEl={<HiUserCircle />}>
            {/* Profile Picture */}
            <HiOutlineUserCircle />
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default MainNavigation;
