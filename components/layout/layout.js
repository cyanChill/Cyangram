import MainNavigation from "./main-navigation";
import Alerts from "./alerts";
import classes from "./layout.module.css";

const Layout = (props) => {
  return (
    <div className={classes.layout}>
      <MainNavigation />
      <Alerts />
      {/* Extra Actions Component - messages */}
      <main className={classes.children}>{props.children}</main>
    </div>
  );
};

export default Layout;
