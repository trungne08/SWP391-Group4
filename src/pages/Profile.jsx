import React, { useState, useEffect } from "react";
import { Card, Avatar, Button, Descriptions, Divider, Modal, Form, Input, message } from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from '../services/api';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserData(user);
          // Fetch additional profile data
          const profile = await api.user.getUserProfile(user.user_id);
          setProfileData(profile);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        message.error('Failed to load user data');
      }
    };

    fetchUserData();
  }, [navigate]);
  // Update Descriptions component
  <Descriptions title="Account Information" column={1} bordered>
      <Descriptions.Item label="Username">{userData?.username}</Descriptions.Item>
      <Descriptions.Item label="Full Name">{profileData?.full_name}</Descriptions.Item>
      <Descriptions.Item label="Email">{userData?.email}</Descriptions.Item>
      <Descriptions.Item label="Phone Number">{profileData?.phone_number}</Descriptions.Item>
      <Descriptions.Item label="Role">{userData?.role}</Descriptions.Item>
      <Descriptions.Item label="Member Since">
          {userData?.created_at ? new Date(userData.created_at).toLocaleDateString() : 'N/A'}
      </Descriptions.Item>
  </Descriptions>
  const handleEdit = () => {
    if (!userData || !profileData) return;
    
    form.setFieldsValue({
      username: userData.username,
      email: userData.email,
      full_name: profileData.full_name,
      phone_number: profileData.phone_number
    });
    setIsModalVisible(true);
  };

  const handleUpdate = async (values) => {
    try {
      await api.user.updateProfile(values);
      setUserData(prev => ({ ...prev, ...values }));
      setProfileData(prev => ({ ...prev, ...values }));
      message.success('Profile updated successfully');
      setIsModalVisible(false);
    } catch (error) {
      message.error('Failed to update profile');
    }
  };

  if (!userData || !profileData) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px", marginBottom: "50px" }}>
      <Card style={{ width: 500, padding: "20px", borderRadius: "10px" }}>
        <div style={{ textAlign: "center" }}>
          <Avatar 
            size={80} 
            src={profileData.avatar || null}
            icon={!profileData.avatar && <UserOutlined />} 
          />
          <h2>{profileData.full_name || userData.username}</h2>
          <p>Email: {userData.email}</p>
          <p>Role: {userData.role}</p>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={handleEdit}
            style={{ marginBottom: "10px" }}
          >
            Edit Profile
          </Button>
        </div>

        <Divider />

        <Descriptions title="Account Information" column={1} bordered>
          <Descriptions.Item label="Username">{userData.username}</Descriptions.Item>
          <Descriptions.Item label="Full Name">{profileData.full_name}</Descriptions.Item>
          <Descriptions.Item label="Email">{userData.email}</Descriptions.Item>
          <Descriptions.Item label="Phone Number">{profileData.phone_number}</Descriptions.Item>
          <Descriptions.Item label="Role">{userData.role}</Descriptions.Item>
          <Descriptions.Item label="Member Since">
            {userData.created_at ? new Date(userData.created_at).toLocaleDateString() : 'N/A'}
          </Descriptions.Item>
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
              name="full_name"
              label="Full Name"
              rules={[{ required: true, message: 'Please input your full name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phone_number"
              label="Phone Number"
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Update Profile
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default Profile;
