import MainNavigation from "./main-navigation";
import classes from "./layout.module.css";

const Layout = (props) => {
  return (
    <div className={classes.layout}>
      <MainNavigation />
      {/* Extra Actions Component - messages */}
      <main className={classes.children}>{props.children}</main>
    </div>
  );
};

export default Layout;
