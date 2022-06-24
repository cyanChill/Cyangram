import { useRouter } from "next/router";
import { MdOutlineArrowBackIos } from "react-icons/md";

import classes from "./backHeader.module.css";

const BackHeader = ({ text, linkPath }) => {
  const router = useRouter();

  const textLink = () => {
    if (linkPath && linkPath.trim()) {
      router.push(linkPath);
    }
  };

  return (
    <header className={classes.header}>
      <MdOutlineArrowBackIos
        className={classes.backIcon}
        onClick={() => router.back()}
      />
      <span onClick={textLink}>{text}</span>
    </header>
  );
};

export default BackHeader;
