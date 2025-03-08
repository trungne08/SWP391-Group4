import React, { useState, useEffect } from "react";
import { Card, Avatar, Button, Descriptions, Divider, Modal, Form, Input, message, Spin } from "antd";
import { UserOutlined, EditOutlined, LockOutlined } from "@ant-design/icons"; // Thêm LockOutlined vào đây
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
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!user) {
          navigate('/login');
          return;
        }
        
        setLoading(true);
        const profileData = await api.user.getProfile();
        
        if (profileData) {
          const updatedUserData = {
            id: profileData.id,
            username: profileData.username,
            email: profileData.email,
            role: profileData.role,
            fullName: profileData.fullName,
            phoneNumber: profileData.phoneNumber,
            avatar: profileData.avatar
          };
          console.log("Profile Data:", profileData);
          setUserData(updatedUserData);
        } else {
          setUserData(user);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        message.error('Failed to load profile data');
        setUserData(user);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user, navigate]);
  
  const handleEdit = () => {
    if (!userData) return;
    
    form.setFieldsValue({
      fullName: userData.fullName || '',
      phoneNumber: userData.phoneNumber || ''
    });
    setIsModalVisible(true);
  };
  
  const handleUpdate = async (values) => {
    try {
      setLoading(true);
      const updateData = {
        userId: userData.id, // Thêm userId vào request
        fullName: values.fullName,
        phoneNumber: values.phoneNumber
      };
      
      const response = await api.user.updateProfile(updateData);
      
      if (response) {
        setUserData(prev => ({
          ...prev,
          ...response
        }));
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
          <Avatar 
            size={100} 
            src={userData.avatar || null}
            icon={!userData.avatar && <UserOutlined />}
            style={{ marginBottom: "16px" }}
          />
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
      </Card>
    </div>
  );
}
export default Profile;
