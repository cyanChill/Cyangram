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
  IoSettingsSharp,
} from "react-icons/io5";
import { HiUserCircle, HiOutlineUserCircle } from "react-icons/hi";
import { RiSendPlaneFill, RiSendPlaneLine } from "react-icons/ri";

import global from "../../global";
import NavLink from "../misc/links/navLink";
import DropDownMenu from "../ui/dropdown/dropdown";
import DropDownItem from "../ui/dropdown/dropdownitem";
import AppLogo from "../ui/appLogo/appLogo";
import classes from "./mainNavigation.module.css";

const MainNavigation = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [ddDisplayStatus, setddDisplayStatus] = useState(false);
  const [smallScreen, setSmallScreen] = useState();

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

    window.addEventListener("resize", (e) => {
      setSmallScreen(window.innerWidth < 568);
    });

    setSmallScreen(window.innerWidth < 568);
  }, []);

  if (status !== "authenticated") {
    return null;
  }

  const handleLogout = async () => {
    signOut();
  };

  return (
    <nav className={classes.navbar}>
      <div className={classes.navWrapper}>
        <AppLogo
          className={`${classes.logo} ${
            router.asPath === "/" && classes.hidden
          }`}
          onClick={() => router.push("/")}
          overrideClass
        />

        <ul className={classes.navItems}>
          <li>
            <NavLink to="/" activeEl={<AiFillHome />}>
              <AiOutlineHome />
            </NavLink>
          </li>
          <li>
            <NavLink to="/direct/inbox" activeEl={<RiSendPlaneFill />}>
              <RiSendPlaneLine />
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
              openFromDirection={smallScreen ? "top" : "bottom"}
              display={ddDisplayStatus}
            >
              {/* Option to goto user's profile page */}
              <DropDownItem
                active={router.asPath === `/${session.user.username}`}
                noPad
              >
                <NavLink to={`/${session.user.username}`}>
                  <div className={classes.dropDownItem}>
                    <HiUserCircle /> <span>Profile</span>
                  </div>
                </NavLink>
              </DropDownItem>

              {/* User Settings */}
              <DropDownItem
                active={router.asPath === "/accounts/settings"}
                noPad
              >
                <div
                  className={classes.dropDownItem}
                  onClick={() => router.push(`/accounts/settings`)}
                >
                  <IoSettingsSharp /> <span>Settings</span>
                </div>
              </DropDownItem>

              {/* Option to change theme (light/dark) */}
              <DropDownItem noPad>
                <div
                  className={classes.dropDownItem}
                  onClick={global.theme.actions.toggleMode}
                >
                  <IoColorPalette /> <span>Change Theme</span>
                </div>
              </DropDownItem>

              {/* Option to Logout */}
              <DropDownItem noPad>
                <div
                  className={`${classes.dropDownItem} ${classes.logoutBtn}`}
                  onClick={() => handleLogout()}
                >
                  <IoLogOutOutline /> <span>Logout</span>
                </div>
              </DropDownItem>
            </DropDownMenu>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default MainNavigation;
