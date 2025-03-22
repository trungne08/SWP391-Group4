import { Outlet } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";

const AdminLayout = () => {
  return (
    <div style={{ 
      display: 'flex',
      minHeight: '100vh',
      margin: 0,
      padding: 0,
      background: 'linear-gradient(135deg, #FFF5EE 0%, #FFF0F5 100%)'
    }}>
      <AdminHeader />
      <main style={{ 
        flex: 1,
        marginLeft: '250px',
        minHeight: '100vh',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)'
      }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;