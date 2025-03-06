import React, { useState, useEffect } from 'react';
import { Typography, Button, Card, Avatar, Row, Col, Pagination, Modal, message } from 'antd';
import api from '../services/api';

const { Title, Text } = Typography;

function AdminMember() {
  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await api.user.getAllUsers();
      const filteredMembers = response.filter(user => user.role === 'MEMBER');
      setMembers(filteredMembers);
      setTotal(filteredMembers.length);
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
      fetchMembers(); // Refresh list
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

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <Title level={2}>Member Management</Title>
      
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>Member List</Title>
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
              <div style={{ marginTop: 16 }}>
                <Button 
                  size="small" 
                  danger
                  type="primary"
                  onClick={() => showDeleteConfirm(member)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}

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
