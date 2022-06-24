import { useState } from "react";
import { AiOutlineDown } from "react-icons/ai";

import useLazyFetch from "../../../hooks/useLazyFetch";
import DropDownMenu from "../../ui/dropdown/dropdown";
import DropDownItem from "../../ui/dropdown/dropdownitem";
import PostExcerpt from "../../posts/postExcerpt/postExcerpt";
import AppLogo from "../../ui/appLogo/appLogo";
import LoadingSpinner from "../../ui/spinners/loadingSpinner";
import classes from "./home.module.css";

const FETCH_AMOUNT = 9;

const Home = ({ username }) => {
  const [ddDisplayStatus, setddDisplayStatus] = useState(false);
  const [feedType, setFeedType] = useState("ourFeed");

  const { loading, results: ourFeed } = useLazyFetch(
    `/api/users/${username}/feed?type=follow&`,
    FETCH_AMOUNT
  );
  const { loading: loading2, results: discoverFeed } = useLazyFetch(
    `/api/users/${username}/feed?type=discover&`,
    FETCH_AMOUNT
  );

  const handleChangeFeed = (type) => {
    if (type !== "ourFeed" && type !== "discoverFeed") return;
    setFeedType(type);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <header className={classes.header}>
        <div
          className={classes.selection}
          onClick={() => setddDisplayStatus((prev) => !prev)}
        >
          <AppLogo />
          <AiOutlineDown />
          <div>
            <DropDownMenu
              arrowPosition="right"
              openFromDirection="bottom"
              display={ddDisplayStatus}
              className={classes.dropDown}
            >
              <DropDownItem
                onClick={() => handleChangeFeed("ourFeed")}
                active={feedType === "ourFeed"}
              >
                <span>Our Feed</span>
              </DropDownItem>
              <DropDownItem
                onClick={() => handleChangeFeed("discoverFeed")}
                active={feedType === "discoverFeed"}
              >
                <span>Discover</span>
              </DropDownItem>
            </DropDownMenu>
          </div>
        </div>
      </header>

      <div className={classes.content}>
        {feedType === "ourFeed" ? (
          <>
            {ourFeed.map((post) => (
              <PostExcerpt key={post._id} post={post} />
            ))}
            {loading && (
              <div className={classes.spinnerContainer}>
                <LoadingSpinner />
              </div>
            )}
          </>
        ) : (
          <>
            {discoverFeed.map((post) => (
              <PostExcerpt key={post._id} post={post} />
            ))}
            {loading2 && (
              <div className={classes.spinnerContainer}>
                <LoadingSpinner />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Home;
