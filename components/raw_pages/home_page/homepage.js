import { useState } from "react";
import { AiOutlineDown } from "react-icons/ai";

import DropDownMenu from "../../ui/dropdown/dropdown";
import DropDownItem from "../../ui/dropdown/dropdownitem";
import PostExcerpt from "../../posts/post_excerpt/post_excerpt";
import AppLogo from "../../ui/applogo/applogo";
import classes from "./homepage.module.css";

const HomeFeedPage = ({ ourFeed, discoverFeed }) => {
  const [ddDisplayStatus, setddDisplayStatus] = useState(false);
  const [feedType, setFeedType] = useState("ourFeed");

  const handleChangeFeed = (type) => {
    if (type !== "ourFeed" && type !== "discoverFeed") return;
    setFeedType(type);
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
        {feedType === "ourFeed"
          ? ourFeed.map((post) => <PostExcerpt key={post._id} post={post} />)
          : discoverFeed.map((post) => (
              <PostExcerpt key={post._id} post={post} />
            ))}
      </div>
    </>
  );
};

export default HomeFeedPage;
