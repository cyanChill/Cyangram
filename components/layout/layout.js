import MainNavigation from "./main-navigation";
import classes from "./layout.module.css";

const Layout = (props) => {
  return (
    <>
      <MainNavigation />
      {/* Extra Actions Component - messages */}
      <main className={classes.children}>{props.children}</main>
    </>
  );
};

export default Layout;
