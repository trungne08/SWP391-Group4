import React, { useState, useEffect } from "react";
import { Card, Avatar, Button, Descriptions, Divider, Modal, Form, Input, message } from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from '../services/api';

const Profile = () => {
  const [userData, setUserData] = useState(null);
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
        
        // Decode token để lấy thông tin user
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const userData = {
          user_id: tokenData.user_id,
          username: tokenData.sub,
          email: tokenData.email,
          role: tokenData.role
        };
        setUserData(userData);
        
        try {
          const profileData = await api.user.getProfile();
          if (profileData) {
            setUserData(prev => ({
              ...prev,
              ...profileData
            }));
          }
        } catch (profileError) {
          console.error('Error fetching profile:', profileError);
          message.error('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        message.error('Failed to load user data');
      }
    };
    fetchUserData();
  }, [navigate]);
  const handleEdit = () => {
    if (!userData) return;
    
    form.setFieldsValue({
      full_name: userData.full_name || '',
      phone_number: userData.phone_number || ''
    });
    setIsModalVisible(true);
  };
  const handleUpdate = async (values) => {
    try {
      const response = await api.user.updateProfile({
        profile_id: userData.profile_id,
        user_id: userData.user_id,
        full_name: values.full_name,
        phone_number: values.phone_number,
        avatar: userData.avatar || ''
      });
      
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
    }
  };
  if (!userData) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  }
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px", marginBottom: "50px" }}>
      <Card style={{ width: 500, padding: "20px", borderRadius: "10px" }}>
        <div style={{ textAlign: "center" }}>
          <Avatar 
            size={80} 
            icon={<UserOutlined />}
          />
          <h2>{userData.username}</h2>
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
          <Descriptions.Item label="Full Name">{userData.full_name || 'Not set'}</Descriptions.Item>
          <Descriptions.Item label="Email">{userData.email}</Descriptions.Item>
          <Descriptions.Item label="Phone Number">{userData.phone_number || 'Not set'}</Descriptions.Item>
          <Descriptions.Item label="Role">{userData.role}</Descriptions.Item>
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
