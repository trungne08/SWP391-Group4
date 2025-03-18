import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import "./AdminHeader.css";
import { UserOutlined, DashboardOutlined, TeamOutlined, FileTextOutlined, LogoutOutlined, HomeOutlined } from "@ant-design/icons";
import { Avatar, Menu, Dropdown } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonBreastfeeding } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import api from '../services/api';
import { MoneyCollectOutlined } from "@ant-design/icons"; // Add this import at the top

const AdminHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found');
          return;
        }
        const response = await api.user.getProfile(); // Thay đổi từ getCurrentUser sang getProfile
        setUserData(response);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

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
        <FontAwesomeIcon 
          icon={faPersonBreastfeeding} 
          className="logo-icon" 
          style={{ color: '#fff' }} // Added explicit color
        />
        <span className="logo-text">BaBy Care Center</span>
      </div>
      
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ 
          borderRight: 'none',
          marginTop: 0,
          background: 'transparent'
        }}
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
            key: '/admin/membership',
            icon: <MoneyCollectOutlined />,
            label: <Link to="/admin/membership">Membership Packages</Link>,
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
          <Avatar 
            size={40} 
            src={userData?.avatar}
            icon={!userData?.avatar && <UserOutlined />}
            style={{
              backgroundColor: '#1890ff',
              verticalAlign: 'middle'
            }}
          />
          <span className="admin-name">{userData?.username || 'Admin'}</span>
        </div>
      </Dropdown>
    </div>
  );
};

export default AdminHeader;