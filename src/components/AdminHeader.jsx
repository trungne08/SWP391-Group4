import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminHeader.css";
import { UserOutlined, DashboardOutlined, TeamOutlined, FileTextOutlined, LogoutOutlined, HomeOutlined } from "@ant-design/icons";
import { Avatar, Menu, Dropdown } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonBreastfeeding } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";

const AdminHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const profileMenu = {
    items: [
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Logout',
        onClick: handleLogout,
      },
    ],
  };
  
  return (
    <div className="admin-sidebar">
      <div className="logo-container">
        <FontAwesomeIcon icon={faPersonBreastfeeding} className="logo-icon" />
        <span className="logo-text">BaBy Care Center</span>
      </div>
      
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={[
          {
            key: '/',
            icon: <HomeOutlined />,
            label: <Link to="/">Home</Link>,
          },
          {
            key: '/admin/dashboard',
            icon: <DashboardOutlined />,
            label: <Link to="/admin/dashboard">Dashboard</Link>,
          },
          {
            key: '/admin/members',
            icon: <TeamOutlined />,
            label: <Link to="/admin/members">Members</Link>,
          },
          {
            key: '/admin/blog',
            icon: <FileTextOutlined />,
            label: <Link to="/admin/blog">Blog</Link>,
          },
        ]}
      />

      <Dropdown menu={profileMenu} placement="topRight" trigger={['click']}>
        <div className="admin-profile" style={{ cursor: 'pointer' }}>
          <Avatar size={40} icon={<UserOutlined />} />
          <span className="admin-name">{user?.username || 'Admin'}</span>
        </div>
      </Dropdown>
    </div>
  );
};

export default AdminHeader;