import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const Layout = () => {
  return (
    <>
      <Header />
      <main className="pt-16 p-4">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
