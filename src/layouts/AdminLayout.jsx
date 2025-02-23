import { Outlet } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import Footer from "../components/Footer";

const AdminLayout = () => {
  return (
    <>
      {/* Header */}
      <AdminHeader />
      
      {/* Main Content */}
      <main className="pt-16 p-4">
        <Outlet />
      </main>
      
      {/* Footer */}
      <Footer />
    </>
  );
};

export default AdminLayout;
