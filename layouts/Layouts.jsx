import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer"; 

const Layout = () => {
  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #FFF5EE 0%, #FFF0F5 100%)'
    }}>
      <Header />
      <main style={{ 
        flex: 1,
        padding: '20px',
        marginTop: '64px',
        animation: 'fadeIn 0.5s ease-in-out'
      }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
