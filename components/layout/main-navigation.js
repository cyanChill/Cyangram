import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import {
  IoSearchOutline,
  IoSearchSharp,
  IoCreateOutline,
  IoCreate,
  IoColorPalette,
  IoLogOutOutline,
} from "react-icons/io5";
import { HiUserCircle, HiOutlineUserCircle } from "react-icons/hi";

import { logoutFirebase } from "../../lib/firebaseHelpers";
import global from "../../global";
import NavLink from "../misc/links/navlink";
import DropDownMenu from "../ui/dropdown/dropdown";
import DropDownItem from "../ui/dropdown/dropdownitem";
import classes from "./main-navigation.module.css";

const MainNavigation = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [ddDisplayStatus, setddDisplayStatus] = useState(false);

  /* Close dropdown if we click off the dropdown menu*/
  useEffect(() => {
    window.addEventListener("click", (e) => {
      if (e.target.id === "navDDBtn") return;

      let node = e.target;
      while (!!node && node.tagName !== "HTML") {
        if (node.id === "navDDBtn") return;
        node = node.parentNode;
      }
      setddDisplayStatus(false);
    });
  }, []);

  if (status !== "authenticated") {
    return null;
  }

  const handleLogout = async () => {
    await logoutFirebase();
    signOut();
  };

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
          <NavLink to="/create" activeEl={<IoCreate />}>
            <IoCreateOutline />
          </NavLink>
        </li>

        <li
          id="navDDBtn"
          className={`${classes.ddBtn}`}
          onClick={() => setddDisplayStatus((prev) => !prev)}
        >
          {router.asPath === `/${session.user.username}` ? (
            <HiUserCircle />
          ) : (
            <HiOutlineUserCircle />
          )}

          <DropDownMenu
            arrowPosition="right"
            openFromDirection="top"
            display={ddDisplayStatus}
          >
            {/* Option to goto user's profile page */}
            <DropDownItem
              active={router.asPath === `/${session.user.username}`}
            >
              <NavLink to={`/${session.user.username}`}>
                <div className={classes.alignCenter}>
                  <HiUserCircle /> <span>Profile</span>
                </div>
              </NavLink>
            </DropDownItem>

            {/* Option to change theme (light/dark) */}
            <DropDownItem>
              <div
                className={classes.alignCenter}
                onClick={global.theme.actions.toggleMode}
              >
                <IoColorPalette /> <span>Change Theme</span>
              </div>
            </DropDownItem>

            {/* Option to Logout */}
            <DropDownItem>
              <div
                className={`${classes.alignCenter} ${classes.logoutBtn}`}
                onClick={() => handleLogout()}
              >
                <IoLogOutOutline /> <span>Logout</span>
              </div>
            </DropDownItem>
          </DropDownMenu>
        </li>
      </ul>
    </nav>
  );
};

export default MainNavigation;
