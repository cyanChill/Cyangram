import MainNavigation from "./main-navigation";

const Layout = (props) => {
  return (
    <>
      <MainNavigation />
      {/* Extra Actions Component - messages */}
      <main>{props.children}</main>
    </>
  );
};

export default Layout;
