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
          style={{ color: '#FF69B4', fontSize: '24px' }}
        />
        <span className="logo-text">BaBy Care</span>
      </div>
      
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ 
          borderRight: 'none',
          background: 'transparent'
        }}
        items={[
          {
            key: '/admin/dashboard',
            icon: <DashboardOutlined style={{ color: '#FFB6C1' }} />,
            label: <Link to="/admin/dashboard">Dashboard</Link>,
          },
          {
            key: '/admin/members',
            icon: <TeamOutlined style={{ color: '#FFB6C1' }} />,
            label: <Link to="/admin/members">Members</Link>,
          },
          {
            key: '/admin/membership',
            icon: <MoneyCollectOutlined style={{ color: '#FFB6C1' }} />,
            label: <Link to="/admin/membership">Membership</Link>,
          },
          {
            key: '/admin/blog',
            icon: <FileTextOutlined style={{ color: '#FFB6C1' }} />,
            label: <Link to="/admin/blog">Blog</Link>,
          },
          {
            key: '/',
            icon: <HomeOutlined style={{ color: '#FFB6C1' }} />,
            label: <Link to="/">Back to Home</Link>,
          },
        ]}
      />

      <Dropdown menu={profileMenu} placement="topRight" trigger={['click']}>
        <div className="admin-profile">
          <Avatar 
            size={36}
            src={userData?.avatar}
            icon={!userData?.avatar && <UserOutlined />}
            style={{
              backgroundColor: '#FF69B4',
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