import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Card,
  Avatar,
  Row,
  Col,
  Pagination,
  Modal,
  message,
  Form,
  Input,
  Select,
  Spin,
} from "antd";
import { UserOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import api from "../services/api";

const { Title, Text } = Typography;

// Định nghĩa các styles
const containerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "20px",
  animation: "fadeIn 0.5s ease-in-out"
};

const cardStyle = {
  marginBottom: "16px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  transition: "all 0.3s ease",
  border: "none",
  ":hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
  }
};

const buttonStyle = {
  borderRadius: "6px",
  display: "flex",
  alignItems: "center",
  gap: "4px"
};

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
      message.success("Member deleted successfully");
      fetchMembers();
    } catch (error) {
      console.error("Error deleting member:", error);
      message.error("Failed to delete member");
    }
    setDeleteModalVisible(false);
  };

  const handleEditUser = async (values) => {
    try {
      await api.user.updateProfile({
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
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

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await api.user.getAllUsers();
      console.log("Users response:", response);

      const formattedMembers = response.map((user) => ({
        ...user,
        user_id: user.id || user.user_id,
        role: user.role?.toUpperCase() || "MEMBER",
        key: user.id || user.user_id,
      }));

      // Phân trang
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedMembers = formattedMembers.slice(startIndex, endIndex);

      setMembers(paginatedMembers);
      setTotal(formattedMembers.length);
    } catch (error) {
      console.error("Error fetching members:", error);
      message.error("Failed to load members");
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
    <div style={containerStyle}>
      <Title level={2} style={{
        color: "#1a3353",
        marginBottom: "30px",
        position: "relative",
        paddingBottom: "10px"
      }}>
        User Management
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "60px",
          height: "3px",
          background: "#1890ff",
          borderRadius: "2px"
        }}/>
      </Title>

      {loading ? (
        <div style={{ 
          textAlign: "center", 
          padding: "50px",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
            <Title level={4} style={{ margin: 0, color: "#1a3353" }}>
              User List
            </Title>
          </Row>

          {members.map((member) => (
            <Card key={member.user_id} style={cardStyle} hoverable>
              <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                <Avatar
                  size={80}
                  src={member.avatar || `https://ui-avatars.com/api/?name=${member.username}&background=random`}
                  style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                />
                <div style={{ flex: 1 }}>
                  <Title level={4} style={{ margin: "0 0 8px 0", color: "#1a3353" }}>
                    {member.username}
                  </Title>
                  <Text style={{ fontSize: "16px", display: "block", marginBottom: "4px" }}>
                    {member.email}
                  </Text>
                  <Text type="secondary" style={{ fontSize: "14px" }}>
                    Role: <span style={{ 
                      color: member.role === "ADMIN" ? "#1890ff" : "#52c41a",
                      fontWeight: 500 
                    }}>{member.role}</span>
                  </Text>
                  <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
                    <Button
                      icon={<EyeOutlined />}
                      style={buttonStyle}
                      onClick={() => {
                        setSelectedMember(member);
                        setDetailModalVisible(true);
                      }}
                    >
                      View
                    </Button>
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      style={buttonStyle}
                      onClick={() => {
                        setSelectedMember(member);
                        setEditModalVisible(true);
                      }}
                    >
                      Edit
                    </Button>
                    {member.role !== "ADMIN" && (
                      <Button
                        danger
                        type="primary"
                        icon={<DeleteOutlined />}
                        style={buttonStyle}
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

          <Modal
            title={<div style={{ 
              borderBottom: "2px solid #f0f0f0",
              paddingBottom: "16px",
              marginBottom: "20px"
            }}>User Details</div>}
            open={detailModalVisible}
            onCancel={() => setDetailModalVisible(false)}
            footer={null}
            width={600}
            style={{ top: 20 }}
          >
            {selectedMember && (
              <div style={{ padding: "20px" }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "30px",
                  background: "#f8f9fa",
                  padding: "20px",
                  borderRadius: "12px"
                }}>
                  <Avatar
                    size={120}
                    src={selectedMember.avatar || `https://ui-avatars.com/api/?name=${selectedMember.username}&background=random`}
                    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                  />
                  <div style={{ marginLeft: "24px" }}>
                    <Title level={3} style={{ margin: "0 0 8px 0" }}>{selectedMember.username}</Title>
                    <Text type="secondary" style={{ fontSize: "16px" }}>
                      Role: <span style={{ 
                        color: selectedMember.role === "ADMIN" ? "#1890ff" : "#52c41a",
                        fontWeight: 500 
                      }}>{selectedMember.role}</span>
                    </Text>
                  </div>
                </div>

                {/* User details info */}
                <div style={{ 
                  display: "grid", 
                  gap: "20px",
                  background: "#fff",
                  padding: "20px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                }}>
                  <InfoItem label="Email" value={selectedMember.email} />
                  <InfoItem label="Full Name" value={selectedMember.fullName || "Not set"} />
                  <InfoItem label="Phone Number" value={selectedMember.phoneNumber || "Not set"} />
                  <InfoItem label="User ID" value={selectedMember.user_id} />
                </div>
              </div>
            )}
          </Modal>

          {/* Style the edit modal */}
          <Modal
            title={<div style={{ 
              borderBottom: "2px solid #f0f0f0",
              paddingBottom: "16px",
              marginBottom: "20px"
            }}>Edit User</div>}
            open={editModalVisible}
            onCancel={() => setEditModalVisible(false)}
            footer={null}
            style={{ top: 20 }}
          >
            <Form
              form={editForm}
              onFinish={handleEditUser}
              layout="vertical"
              initialValues={{
                fullName: selectedMember?.fullName || "",
                phoneNumber: selectedMember?.phoneNumber || "",
              }}
            >
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[
                  { required: true, message: "Please input full name!" },
                  { max: 50, message: "Full name cannot exceed 50 characters!" },
                ]}
              >
                <Input size="large" />
              </Form.Item>
              <Form.Item
                name="phoneNumber"
                label="Phone Number"
                rules={[
                  { pattern: /^\d{10}$/, message: "Please enter a valid 10-digit phone number!" },
                ]}
              >
                <Input size="large" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block size="large">
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
            okButtonProps={{ danger: true }}
          >
            <p style={{ fontSize: "16px" }}>
              Are you sure you want to delete member <strong>{selectedMember?.username}</strong>?
            </p>
          </Modal>

          <Row justify="center" style={{ marginTop: 24 }}>
            <Pagination
              current={currentPage}
              pageSize={5}
              total={total}
              onChange={(page) => setCurrentPage(page)}
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
              style={{
                padding: "12px",
                background: "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}
            />
          </Row>
        </>
      )}
    </div>
  );
}

// Helper component for user details
const InfoItem = ({ label, value }) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    <Text strong style={{ minWidth: "120px", fontSize: "15px" }}>{label}: </Text>
    <Text style={{ fontSize: "15px" }}>{value}</Text>
  </div>
);

export default AdminMember;
