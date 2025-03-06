import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonBreastfeeding } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";
import { UserOutlined } from "@ant-design/icons";
import {  Avatar, Dropdown, Menu  } from "antd";


const Header = () => {
  const location = useLocation();

  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">Trang cá nhân</Link>
      </Menu.Item>
      <Menu.Item key="login">
        <Link to="/login">Đăng nhập</Link>
      </Menu.Item>
    </Menu>
  );



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

      

            <li>
              <Link to="/baby" className={location.pathname === "/baby" ? "active" : ""}>Baby</Link>
            </li>
            <li>
              <Link to="/faq" className={location.pathname === "/faq" ? "active" : ""}>FAQ</Link>
            </li>
          </div>
          <li className="nav-avatar">
  <Dropdown overlay={menu} trigger={["click"]}>
    <Avatar size={32} icon={<UserOutlined />} style={{ cursor: "pointer" }} />
  </Dropdown>
</li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
