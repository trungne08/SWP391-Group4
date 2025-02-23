import { Link, useLocation } from "react-router-dom";
import "./AdminHeader.css";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Space } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonBreastfeeding } from "@fortawesome/free-solid-svg-icons";

const AdminHeader = () => {
  const location = useLocation();

  return (
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
    </div>
  );
};

export default AdminHeader;