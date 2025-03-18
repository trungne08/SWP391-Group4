import { Outlet } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";

const AdminLayout = () => {
  return (
    <div style={{ 
      display: 'flex',
      background: '#f0f2f5',
      minHeight: '100vh'
    }}>
      <AdminHeader />
      <main style={{ 
        marginLeft: '250px', 
        width: '100%', 
        padding: '0', // Removed padding
        transition: 'all 0.3s ease',
        animation: 'fadeIn 0.5s ease-in-out'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 20px', // Changed padding to only horizontal
          borderRadius: '8px',
        }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;