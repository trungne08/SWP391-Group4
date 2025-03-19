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
      <Menu.Item key="reminder">
        <Link to="/reminder">Reminder</Link>
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
              <FontAwesomeIcon 
                icon={faPersonBreastfeeding} 
                style={{ 
                  filter: 'drop-shadow(0 2px 4px rgba(255,105,180,0.3))'
                }}
              />
            </Link>
          </li>
          <div className="nav-links">
            <li>
              <Link 
                to="/" 
                className={location.pathname === "/" ? "active" : ""}
                style={{ textDecoration: 'none' }}  // Add this line
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/comunity" 
                className={location.pathname === "/comunity" ? "active" : ""}
                style={{ textDecoration: 'none' }}  // Add this line
              >
                Community
              </Link>
            </li>
            <li>
              <Link 
                to="/blog" 
                className={location.pathname === "/blog" ? "active" : ""}
                style={{ textDecoration: 'none' }}  // Add this line
              >
                Blog
              </Link>
            </li>
            <li>
              <Link 
                to="/baby" 
                className={location.pathname === "/baby" ? "active" : ""}
                style={{ textDecoration: 'none' }}  // Add this line
              >
                Baby
              </Link>
            </li>
            <li>
              <Link 
                to="/faq" 
                className={location.pathname === "/faq" ? "active" : ""}
                style={{ textDecoration: 'none' }}  // Add this line
              >
                FAQ
              </Link>
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
                      backgroundColor: '#FF69B4',
                      verticalAlign: 'middle',
                      border: '2px solid #FFB6C1',
                      boxShadow: '0 2px 8px rgba(255,105,180,0.2)'
                    }} 
                  />
                </div>
              </Dropdown>
            ) : (
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button type="primary">
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button style={{ borderColor: '#FF69B4', color: '#FF69B4' }}>
                  <Link to="/register" style={{ color: '#FF69B4' }}>Sign Up</Link>
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
