import { Outlet, useLocation } from "react-router-dom";
import Header from "../pages/user/Header";
import Footer from "../pages/user/Footer";
import Categoryslider from "../pages/user/Categoryslider";

const Layout = () => {
  const location = useLocation();

  const currentPath = location.pathname.toLowerCase();
  const hideOnRoutes = ["/signin", "/signup"];

  return (
    <>
      <Header />
      {!hideOnRoutes.includes(currentPath) && <Categoryslider />}
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
