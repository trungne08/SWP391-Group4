import { Outlet } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
<<<<<<< HEAD

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex' }}>
      <AdminHeader />
      <main style={{ marginLeft: '250px', width: '100%', padding: '24px' }}>
        <Outlet />
      </main>
    </div>
=======
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
>>>>>>> 9f8570a96ab593c5ce98f66e0f03343c1e48acfe
  );
};

export default AdminLayout;
