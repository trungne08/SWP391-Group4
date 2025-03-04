import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonBreastfeeding } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Menu, Button } from "antd";
import { useState, useEffect } from "react";

const Header = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in by looking for token
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    // You might want to redirect to home page here
  };

  const authenticatedMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        Logout
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
              <Link to="/comunity" className={location.pathname === "/comunity" ? "active" : ""}>Comunity</Link>
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
            {isLoggedIn ? (
              <Dropdown overlay={authenticatedMenu} trigger={["click"]}>
                <Avatar size={32} icon={<UserOutlined />} style={{ cursor: "pointer" }} />
              </Dropdown>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button type="primary">
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
