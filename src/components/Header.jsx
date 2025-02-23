import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonBreastfeeding } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Space } from "antd";

const Header = () => {
  const location = useLocation();

  return (
    <div className="container-header">
      <nav className="navbar">
        <ul className="nav-list">
          <li className="nav-icon">
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              <FontAwesomeIcon icon={faPersonBreastfeeding} />
            </Link>
          </li>
          <div className="nav-links">
            <li>
              <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
            </li>
            <li>
              <Link to="/comunity" className={location.pathname === "/comunity" ? "active" : ""}>Community</Link>
            </li>
            <li>
              <Link to="/blog" className={location.pathname === "/blog" ? "active" : ""}>Blog</Link>
            </li>
            {/* <li>
              <Link to="/mom" className={location.pathname === "/mom" ? "active" : ""}>Mom</Link>
            </li> */}
            <li>
              <Link to="/baby" className={location.pathname === "/baby" ? "active" : ""}>Baby</Link>
            </li>
            <li>
              <Link to="/faq" className={location.pathname === "/faq" ? "active" : ""}>FAQ</Link>
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

export default Header;
