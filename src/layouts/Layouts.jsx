import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Layout = () => {
  return (
    <>
      <Header />
      <main className="pt-16 p-4">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
