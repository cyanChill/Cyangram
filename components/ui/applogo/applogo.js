import Image from "next/image";

import global from "../../../global";
import classes from "./appLogo.module.css";

const AppLogo = ({ className, overrideClass, ...rest }) => {
  const appClassName = overrideClass
    ? className
    : `${classes.logo} ${className}`;

  return (
    <div className={appClassName} {...rest}>
      <Image
        src={`/images/assets/instagram-logo${
          global.theme.state === global.theme.types.DARK ? "-dark" : ""
        }.png`}
        alt="Instagram logo"
        width="150"
        height="50"
        responsive="true"
      />
    </div>
  );
};

export default AppLogo;
