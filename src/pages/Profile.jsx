import React, { useState, useEffect } from "react";
import { Card, Avatar, Button, Descriptions, Divider, Modal, Form, Input, message, Spin, Dropdown } from "antd";
import { UserOutlined, EditOutlined, LockOutlined, CameraOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

  const handleEdit = () => {
    if (!userData) return;
    
    form.setFieldsValue({
      fullName: userData.fullName || '',
      phoneNumber: userData.phoneNumber || '',
      avatar: userData.avatar || ''
    });
    setAvatarUrl(userData.avatar || '');
    setIsModalVisible(true);
  };

  const avatarMenuItems = {
    items: [
      {
        key: '1',
        label: 'View Profile Picture',
        icon: <UserOutlined />,
        onClick: () => setIsAvatarModalVisible(true),
      },
      {
        key: '2',
        label: 'Change Profile Picture',
        icon: <CameraOutlined />,
        onClick: handleEdit,
      },
    ],
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = JSON.parse(localStorage.getItem('user'));
        
        if (!token || !storedUser) {
          navigate('/login');
          return;
        }
        
        setLoading(true);
        const profileData = await api.user.getProfile();
        
        if (profileData) {
          setUserData(profileData);
        } else {
          setUserData(storedUser);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        message.error('Failed to load profile data');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleUpdate = async (values) => {
    try {
      setLoading(true);
      const updateData = {
        fullName: values.fullName?.trim(),
        phoneNumber: values.phoneNumber?.trim(),
        avatar: values.avatar?.trim()
      };
      
      const response = await api.user.updateProfile(updateData);
      
      if (response) {
        setUserData(response);
        message.success('Profile updated successfully');
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error('Update error:', error);
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }
  if (!userData) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>No user data available</div>;
  }
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
      <Card style={{ width: 600, borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Dropdown menu={avatarMenuItems} trigger={['click']}>
            <div style={{ display: 'inline-block', position: 'relative', cursor: 'pointer' }}>
              <Avatar 
                size={100} 
                src={userData.avatar || null}
                icon={!userData.avatar && <UserOutlined />}
                style={{ marginBottom: "16px" }}
              />
              <div style={{
                position: 'absolute',
                bottom: 16,
                right: 0,
                background: '#fff',
                borderRadius: '50%',
                padding: 4,
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                <CameraOutlined style={{ fontSize: '16px' }} />
              </div>
            </div>
          </Dropdown>
          <h2 style={{ margin: "8px 0" }}>{userData.fullName || userData.username}</h2>
          <p style={{ color: "#666" }}>{userData.email}</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
              Edit Profile
            </Button>
            <Button icon={<LockOutlined />} onClick={() => navigate('/change-password')}>
              Change Password
            </Button>
          </div>
        </div>
        <Divider />
        <Descriptions title="Account Information" column={1} bordered>
          <Descriptions.Item label="Username">{userData.username}</Descriptions.Item>
          <Descriptions.Item label="Full Name">{userData.fullName || 'Not set'}</Descriptions.Item>
          <Descriptions.Item label="Email">{userData.email}</Descriptions.Item>
          <Descriptions.Item label="Phone Number">{userData.phoneNumber || 'Not set'}</Descriptions.Item>
        </Descriptions>
        <Modal
          title="Edit Profile"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            onFinish={handleUpdate}
            layout="vertical"
          >
            <Form.Item
              name="avatar"
              label="Avatar URL"
              rules={[
                { type: 'url', message: 'Please enter a valid URL!' }
              ]}
            >
              <Input 
                placeholder="Enter image URL"
                onChange={(e) => setAvatarUrl(e.target.value)}
              />
            </Form.Item>
            {avatarUrl && (
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <Avatar 
                  size={100} 
                  src={avatarUrl}
                  icon={!avatarUrl && <UserOutlined />}
                />
              </div>
            )}
            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[
                { required: true, message: 'Please input your full name!' },
                { max: 50, message: 'Full name cannot exceed 50 characters!' }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[
                { pattern: /^\d{10}$/, message: 'Please enter a valid 10-digit phone number!' }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Update Profile
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        {/* Add Avatar View Modal */}
        <Modal
          title="Profile Picture"
          open={isAvatarModalVisible}
          onCancel={() => setIsAvatarModalVisible(false)}
          footer={null}
        >
          <div style={{ textAlign: 'center' }}>
            <img
              src={userData.avatar || ''}
              alt="Profile"
              style={{
                maxWidth: '100%',
                maxHeight: '500px',
                objectFit: 'contain'
              }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400?text=No+Image';
              }}
            />
          </div>
        </Modal>
      </Card>
    </div>
  );
}
export default Profile;
