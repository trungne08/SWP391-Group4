import { Link, useLocation } from "react-router-dom";
import "./AdminHeader.css";
<<<<<<< HEAD
import { UserOutlined, DashboardOutlined, TeamOutlined, FileTextOutlined } from "@ant-design/icons";
import { Avatar, Menu } from "antd";
=======
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Space } from "antd";
>>>>>>> 9f8570a96ab593c5ce98f66e0f03343c1e48acfe
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonBreastfeeding } from "@fortawesome/free-solid-svg-icons";

const AdminHeader = () => {
  const location = useLocation();

  return (
<<<<<<< HEAD
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

      <div className="admin-profile">
        <Avatar size={40} icon={<UserOutlined />} />
        <span className="admin-name">Admin</span>
      </div>
=======
    <div className="container-header">
      <nav className="navbar">
        <ul className="nav-list">
          <li className="nav-icon">
            <Link to="/admin/dashboard">
              <FontAwesomeIcon icon={faPersonBreastfeeding} />
            </Link>
          </li>
          <div className="nav-links" style={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
            <li>
              <Link to="/admin/dashboard" className={location.pathname === "/admin/dashboard" ? "active" : ""}>Dashboard</Link>
            </li>
            <li>
              <Link to="/admin/members" className={location.pathname === "/admin/members" ? "active" : ""}>Members</Link>
            </li>
            <li>
              <Link to="/admin/blog" className={location.pathname === "/admin/blog" ? "active" : ""}>Blog</Link>
            </li>
          </div>
          <li className="nav-avatar">
            <Space direction="vertical" size={16}>
              <Space wrap size={16}>
                <Avatar size={32} icon={<UserOutlined />} />
              </Space>
            </Space>
          </li>
        </ul>
      </nav>
>>>>>>> 9f8570a96ab593c5ce98f66e0f03343c1e48acfe
    </div>
  );
};

export default AdminHeader;