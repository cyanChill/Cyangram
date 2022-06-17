import { useState } from "react";
import Image from "next/image";
import { AiOutlineDown } from "react-icons/ai";

import global from "../../../global";
import DropDownMenu from "../../ui/dropdown/dropdown";
import DropDownItem from "../../ui/dropdown/dropdownitem";
import PostExcerpt from "../../posts/post_excerpt/post_excerpt";

import classes from "./homepage.module.css";

const HomeFeedPage = ({ ourFeed, discoverFeed }) => {
  const [ddDisplayStatus, setddDisplayStatus] = useState(false);
  const [feedType, setFeedType] = useState("ourFeed");

  const handleChangeFeed = (type) => {
    if (type !== "ourFeed" && type !== "discoverFeed") return;
    setFeedType(type);
    setddDisplayStatus(false);
  };

  return (
    <div>
      <header className={classes.header}>
        <div
          className={classes.selection}
          onClick={() => setddDisplayStatus((prev) => !prev)}
        >
          <Image
            className={classes.logo}
            src={`/images/assets/instagram-logo${
              global.theme.state === global.theme.types.DARK ? "-dark" : ""
            }.png`}
            alt="Instagram logo"
            width="150"
            height="50"
            responsive="true"
          />
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
    </div>
  );
};

export default HomeFeedPage;
