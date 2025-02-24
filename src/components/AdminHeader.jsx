import { Link, useLocation } from "react-router-dom";
import "./AdminHeader.css";
import { UserOutlined, DashboardOutlined, TeamOutlined, FileTextOutlined } from "@ant-design/icons";
import { Avatar, Menu } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonBreastfeeding } from "@fortawesome/free-solid-svg-icons";

const AdminHeader = () => {
  const location = useLocation();

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
    </div>
  );
};

export default AdminHeader;