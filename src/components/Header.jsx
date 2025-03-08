import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonBreastfeeding } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Menu, Button } from "antd";
import { useAuth } from '../context/AuthContext';  // Import useAuth
import api from '../services/api';
import { useState, useEffect } from "react";
const Header = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user) {
          const response = await api.user.getProfile();
          setUserData(response);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  const authenticatedMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="membership">
        <Link to="/feepackage">Membership Registration</Link>
      </Menu.Item>
      <Menu.Item key="subscriptionHistory">
        <Link to="/subscription-history">Subscription History</Link>
      </Menu.Item>
      {user?.role === 'ADMIN' && (
        <Menu.Item key="dashboard">
          <Link to="/admin/dashboard">Dashboard</Link>
        </Menu.Item>
      )}
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
            {isAuthenticated ? (
              <Dropdown overlay={authenticatedMenu} trigger={["click"]}>
                <div style={{ cursor: 'pointer' }}>
                  <Avatar 
                    size={40} 
                    src={userData?.avatar} 
                    icon={<UserOutlined />}
                    style={{ 
                      backgroundColor: '#1890ff',
                      verticalAlign: 'middle'
                    }} 
                  />
                </div>
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
