import React, { useState, useEffect } from 'react';
import { Typography, Button, Card, Avatar, Row, Col, Pagination, Modal, message, Form, Input, Spin } from 'antd';
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

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 300);
  }, [currentPage, pageSize]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await api.user.getAllUsers();
      const formattedMembers = response.map(user => ({
        ...user,
        user_id: user.id || user.user_id,
        key: user.id || user.user_id
      }));
      setMembers(formattedMembers);
      setTotal(formattedMembers.length);
    } catch (error) {
      console.error('Error fetching members:', error);
      message.error('Failed to load members');
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.user.deleteUser(selectedMember.user_id);
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
      if (!selectedMember?.user_id) {
        message.error("User ID not found");
        return;
      }

      await api.user.updateProfile({
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        user_id: selectedMember.user_id
      });

      message.success("User updated successfully");
      await fetchMembers();
      setEditModalVisible(false);
      editForm.resetFields();
    } catch (error) {
      console.error("Error updating user:", error);
      message.error("Failed to update user");
    }
  };

  useEffect(() => {
    if (selectedMember) {
      editForm.setFieldsValue({
        fullName: selectedMember.fullName || '',
        phoneNumber: selectedMember.phoneNumber || ''
      });
    }
  }, [selectedMember, editForm]);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <Title level={2}>Quản Lý Người Dùng</Title>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
            <Title level={4} style={{ margin: 0 }}>Danh Sách Người Dùng</Title>
          </Row>
          {members.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((member) => (
            <Card key={member.user_id} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <Avatar size={64} src={member.avatar || `https://ui-avatars.com/api/?name=${member.username || 'User'}`} />
                <div style={{ flex: 1 }}>
                  <Title level={5} style={{ marginTop: 0 }}>{member.username}</Title>
                  <Text>Email: {member.email}</Text>
                  <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                    <Button size="small" onClick={() => { setSelectedMember(member); setDetailModalVisible(true); }}>Xem Chi Tiết</Button>
                    <Button size="small" type="primary" onClick={() => { setSelectedMember(member); setEditModalVisible(true); }}>Chỉnh Sửa</Button>
                    <Button size="small" danger type="primary" onClick={() => { setSelectedMember(member); setDeleteModalVisible(true); }}>Xóa</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          <Modal title="Chi Tiết Người Dùng" open={detailModalVisible} onCancel={() => setDetailModalVisible(false)} footer={null} width={600}>
            {selectedMember && (
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <Avatar size={100} src={selectedMember.avatar || `https://ui-avatars.com/api/?name=${selectedMember.username || 'User'}`} />
                  <div style={{ marginLeft: '20px' }}>
                    <Title level={3} style={{ margin: 0 }}>{selectedMember.username}</Title>
                    <Text type="secondary">{selectedMember.role}</Text>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <Text strong>Email: </Text>
                    <Text>{selectedMember.email}</Text>
                  </div>
                  <div>
                    <Text strong>Họ và tên: </Text>
                    <Text>{selectedMember.fullName || 'Chưa cập nhật'}</Text>
                  </div>
                  <div>
                    <Text strong>Số điện thoại: </Text>
                    <Text>{selectedMember.phoneNumber || 'Chưa cập nhật'}</Text>
                  </div>
                  <div>
                    <Text strong>Mã người dùng: </Text>
                    <Text>{selectedMember.user_id}</Text>
                  </div>
                  <div>
                    <Text strong>Trạng thái: </Text>
                    <Text>{selectedMember.status || 'Đang hoạt động'}</Text>
                  </div>
                </div>
              </div>
            )}
          </Modal>
          <Modal title="Chỉnh Sửa Người Dùng" open={editModalVisible} onCancel={() => setEditModalVisible(false)} footer={null}>
            <Form form={editForm} onFinish={handleEditUser} layout="vertical">
              <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="phoneNumber" label="Số điện thoại">
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>Cập Nhật</Button>
              </Form.Item>
            </Form>
          </Modal>
          <Modal title="Xác Nhận Xóa" open={deleteModalVisible} onOk={handleDelete} onCancel={() => setDeleteModalVisible(false)} okText="Xóa" cancelText="Hủy">
            <p>Bạn có chắc chắn muốn xóa người dùng {selectedMember?.username}?</p>
          </Modal>
          <Row justify="center" style={{ marginTop: 24 }}>
            <Pagination current={currentPage} pageSize={pageSize} total={total} onChange={(page, size) => { setCurrentPage(page); setPageSize(size); }} showSizeChanger />
          </Row>
        </>
      )}
    </div>
  );
}
export default AdminMember;