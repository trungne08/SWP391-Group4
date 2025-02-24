import { Outlet } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex' }}>
      <AdminHeader />
      <main style={{ marginLeft: '250px', width: '100%', padding: '24px' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
