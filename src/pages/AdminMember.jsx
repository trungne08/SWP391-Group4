import React, { useState, useEffect } from 'react';
import { Typography, Button, Card, Avatar, Row, Col, Pagination, Modal, message, Form, Input, Select } from 'antd';
import api from '../services/api';

const { Title, Text } = Typography;

function AdminMember() {
  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  // Thêm state mới cho modal chi tiết
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  // Thêm state mới
  const [editModalVisible, setEditModalVisible] = useState(false);
  
  // Thêm hàm xử lý edit role
  const handleEditRole = async (userId, newRole) => {
    try {
      await api.user.updateUserRole(userId, newRole);
      message.success('User role updated successfully');
      fetchMembers(); // Refresh list
    } catch (error) {
      console.error('Error updating user role:', error);
      message.error('Failed to update user role');
    }
    setEditModalVisible(false);
  };
  // Thêm state cho form edit
  const [editForm] = Form.useForm();
  
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await api.user.getAllUsers();
      console.log('Users response:', response);
      const formattedMembers = response.map(user => ({
        ...user,
        user_id: user.id || user.user_id,
        role: user.role?.toUpperCase() || 'MEMBER' // Chuyển role thành chữ hoa
      }));
      setMembers(formattedMembers);
      setTotal(formattedMembers.length);
    } catch (error) {
      console.error('Error fetching members:', error);
      message.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMembers();
  }, []);
  
  const handleDelete = async (memberId) => {
    try {
      await api.user.deleteUser(memberId);
      message.success('Member deleted successfully');
      fetchMembers();
    } catch (error) {
      console.error('Error deleting member:', error);
      message.error('Failed to delete member');
    }
    setDeleteModalVisible(false);
  };
  
  const showDeleteConfirm = (member) => {
    setSelectedMember(member);
    setDeleteModalVisible(true);
  };
  
  // Thêm useEffect để cập nhật form khi selectedMember thay đổi
  useEffect(() => {
    if (selectedMember && editForm) {
      editForm.setFieldsValue({
        fullName: selectedMember.fullName || '',
        phoneNumber: selectedMember.phoneNumber || '',
        role: selectedMember.role
      });
    }
  }, [selectedMember, editForm]);
  const handleEditUser = async (values) => {
    try {
      // Đảm bảo đúng user_id được cập nhật
      const userId = selectedMember.user_id;
      console.log('Updating user:', userId, values);

      if (values.role !== selectedMember.role) {
        await api.user.updateUserRole(userId, values.role);
      }
      
      await api.user.updateProfile({
        userId: userId, // Sử dụng userId đã lưu
        fullName: values.fullName,
        phoneNumber: values.phoneNumber
      });
      
      message.success(`User ${selectedMember.username} updated successfully`);
      await fetchMembers();
      setEditModalVisible(false);
      editForm.resetFields();
    } catch (error) {
      console.error('Error updating user:', error);
      message.error(`Failed to update user ${selectedMember.username}`);
    }
  };
  return (
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        <Title level={2}>User Management</Title>
        
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Title level={4} style={{ margin: 0 }}>User List</Title>
        </Row>
  {members.map((member) => (
          <Card key={member.user_id} style={{ marginBottom: 16 }} loading={loading}>
            <div style={{ display: 'flex', gap: 16 }}>
              <Avatar size={64} src={member.avatar || `https://ui-avatars.com/api/?name=${member.username}`} />
              <div style={{ flex: 1 }}>
                <Title level={5} style={{ marginTop: 0 }}>{member.username}</Title>
                <Text>Email: {member.email}</Text>
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">Role: {member.role}</Text>
                </div>
                <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                  <Button
                    size="small"
                    onClick={() => {
                      setSelectedMember(member);
                      setDetailModalVisible(true);
                    }}
                  >
                    View Details
                  </Button>
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => {
                      setSelectedMember(member);
                      setEditModalVisible(true);
                    }}
                  >
                    Edit
                  </Button>
                  {member.role !== 'ADMIN' && (
                    <Button 
                      size="small" 
                      danger
                      type="primary"
                      onClick={() => showDeleteConfirm(member)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
  {/* Add Modal for user details */}
  <Modal
    title="User Details"
    open={detailModalVisible}
    onCancel={() => setDetailModalVisible(false)}
    footer={null}
    width={600}
  >
    {selectedMember && (
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <Avatar size={100} src={selectedMember.avatar || `https://ui-avatars.com/api/?name=${selectedMember.username}`} />
          <div style={{ marginLeft: '20px' }}>
            <Title level={3}>{selectedMember.username}</Title>
            <Text type="secondary">Role: {selectedMember.role}</Text>
          </div>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <Text strong>Email: </Text>
          <Text>{selectedMember.email}</Text>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <Text strong>Full Name: </Text>
          <Text>{selectedMember.fullName || 'Not set'}</Text>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <Text strong>Phone Number: </Text>
          <Text>{selectedMember.phoneNumber || 'Not set'}</Text>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <Text strong>User ID: </Text>
          <Text>{selectedMember.user_id}</Text>
        </div>
      </div>
    )}
  </Modal>
  
        <Modal
          title="Edit User"
          open={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          footer={null}
        >
          <Form
            form={editForm}
            onFinish={handleEditUser}
            layout="vertical"
            initialValues={{
              fullName: selectedMember?.fullName || '',
              phoneNumber: selectedMember?.phoneNumber || '',
              role: selectedMember?.role
            }}
          >
            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[
                { required: true, message: 'Please input full name!' },
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
            <Form.Item
              name="role"
              label="Role"
            >
              <Select>
                <Select.Option value="MEMBER">Member</Select.Option>
                <Select.Option value="ADMIN">Admin</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Update User
              </Button>
            </Form.Item>
          </Form>
        </Modal>
  
        <Modal
          title="Confirm Delete"
          open={deleteModalVisible}
          onOk={() => handleDelete(selectedMember?.user_id)}
          onCancel={() => setDeleteModalVisible(false)}
          okText="Delete"
          cancelText="Cancel"
        >
          <p>Are you sure you want to delete member {selectedMember?.username}?</p>
        </Modal>
  
        <Row justify="center" style={{ marginTop: 24 }}>
          <Pagination 
            current={currentPage}
            onChange={(page) => setCurrentPage(page)}
            total={total}
            showSizeChanger={false}
          />
        </Row>
      </div>
    );
}

export default AdminMember;
