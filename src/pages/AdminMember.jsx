import React, { useState, useEffect } from 'react';
import { Typography, Button, Card, Avatar, Row, Col, Pagination, Modal, message, Form, Input, Select, Spin } from 'antd';
import api from '../services/api';

const { Title, Text } = Typography;

function AdminMember() {
  const [members, setMembers] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();

  // Di chuyển các hàm xử lý vào đây
  const showDeleteConfirm = (member) => {
    setSelectedMember(member);
    setDeleteModalVisible(true);
  };

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

  const handleEditUser = async (values) => {
    try {
      await api.user.updateProfile({
        fullName: values.fullName,
        phoneNumber: values.phoneNumber
      });
      
      message.success('User updated successfully');
      await fetchMembers();
      setEditModalVisible(false);
      editForm.resetFields();
    } catch (error) {
      console.error('Error updating user:', error);
      message.error('Failed to update user');
    }
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await api.user.getAllUsers();
      console.log('Users response:', response);
      
      const formattedMembers = response.map(user => ({
        ...user,
        user_id: user.id || user.user_id,
        role: user.role?.toUpperCase() || 'MEMBER',
        key: user.id || user.user_id
      }));

      // Phân trang
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedMembers = formattedMembers.slice(startIndex, endIndex);
      
      setMembers(paginatedMembers);
      setTotal(formattedMembers.length);
    } catch (error) {
      console.error('Error fetching members:', error);
      message.error('Failed to load members');
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Update useEffect to depend on pagination changes
  useEffect(() => {
    fetchMembers();
  }, [currentPage, pageSize]);
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <Title level={2}>User Management</Title>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
            <Title level={4} style={{ margin: 0 }}>User List</Title>
          </Row>
  {/* Cards mapping */}
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
              phoneNumber: selectedMember?.phoneNumber || ''
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
  {/* Pagination */}
          <Row justify="center" style={{ marginTop: 24 }}>
            <Pagination 
              current={currentPage}
              pageSize={pageSize}
              total={total}
              onChange={(page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              }}
              showSizeChanger
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
            />
          </Row>
        </>
      )}
    </div>
  );
}

export default AdminMember;
