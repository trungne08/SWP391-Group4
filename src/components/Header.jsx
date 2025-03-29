import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonBreastfeeding } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Menu, Button } from "antd";
import { useAuth } from '../context/AuthContext';  // Import useAuth
import api from '../services/api';
import { useState, useEffect } from "react";
import { Box } from '@mui/material';
import NotificationBell from './NotificationBell';  // Remove curly braces

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [userData, setUserData] = useState(null);

  // Bỏ useEffect chuyển hướng ở đây
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
    sessionStorage.removeItem('welcomePopupShown'); // Add this line
    logout();
  };

  const authenticatedMenu = (
    <Menu>
      {/* Common menu items for all users */}
      <Menu.Item key="profile">
        <Link to="/profile">Hồ Sơ</Link>
      </Menu.Item>
      <Menu.Item key="reminder">
        <Link to="/reminder">Nhắc Nhở</Link>
      </Menu.Item>
      <Menu.Item key="membership">
        <Link to="/feepackage">Đăng Ký Thành Viên</Link>
      </Menu.Item>
      <Menu.Item key="subscriptionHistory">
        <Link to="/subscription-history">Lịch Sử Đăng Ký</Link>
      </Menu.Item>
      
      {/* Admin-only menu item */}
      {user?.role === 'ADMIN' && (
        <Menu.Item key="adminDashboard">
          <Link to="/admin/dashboard">Quản Lý Hệ Thống</Link>
        </Menu.Item>
      )}
      
      <Menu.Item key="logout" onClick={handleLogout}>
        Đăng Xuất
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
              <Link to="/" className={location.pathname === "/" ? "active" : ""}>
                Trang Chủ
              </Link>
            </li>
            <li>
              <Link to="/comunity" className={location.pathname === "/comunity" ? "active" : ""}>
                Cộng Đồng
              </Link>
            </li>
            <li>
              <Link to="/blog" className={location.pathname === "/blog" ? "active" : ""}>
                Blog
              </Link>
            </li>
            <li>
              <Link to="/baby" className={location.pathname === "/baby" ? "active" : ""}>
                Em Bé
              </Link>
            </li>
            <li>
              <Link to="/faq" className={location.pathname === "/faq" ? "active" : ""}>
                Hỏi Đáp
              </Link>
            </li>
          </div>
          <li className="nav-avatar">
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <NotificationBell />
                  {/* Other header items */}
                </Box>
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
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button type="primary">
                  <Link to="/login">Đăng Nhập</Link>
                </Button>
                <Button style={{ borderColor: '#FF69B4', color: '#FF69B4' }}>
                  <Link to="/register" style={{ color: '#FF69B4' }}>Đăng Ký</Link>
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
