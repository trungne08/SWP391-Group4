import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
  Card,
  Typography
} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import api from '../services/api'; // Add this import

const { Title } = Typography;

// Add styles
const pageStyle = {
  animation: 'fadeIn 0.5s ease-in-out',
  padding: '24px',
  background: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
};

const tableStyle = {
  marginTop: '16px',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
};

const buttonStyle = {
  borderRadius: '6px',
  fontWeight: 500
};

const AdminMembership = () => {
  const [packages, setPackages] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [form] = Form.useForm();

  // Lấy danh sách các gói membership
  const fetchPackages = async () => {
    try {
      const response = await api.membership.getAllPackages();
      setPackages(response);
    } catch (error) {
      message.error('Không thể tải danh sách gói membership');
      console.error('Error:', error);
    }
  };

  // Cập nhật giá membership
  const handleUpdatePrice = async (values) => {
    try {
      console.log('Updating package:', selectedPackage, 'with price:', values.price);
      
      // Kiểm tra xem selectedPackage có id không
      if (!selectedPackage) {
        throw new Error('Không tìm thấy gói membership');
      }
      
      // Sử dụng trực tiếp fetch API thay vì gọi qua service
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'https://hare-causal-prawn.ngrok-free.app'}/api/membership/packages/${selectedPackage.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ price: parseInt(values.price) }) // Multiply by 1000 to convert to thousands
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update package price");
      }
      
      message.success('Cập nhật giá thành công');
      setIsModalVisible(false);
      fetchPackages();
    } catch (error) {
      console.error('Update price error details:', error);
      message.error('Không thể cập nhật giá: ' + (error.message || 'Đã có lỗi xảy ra'));
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Mở modal chỉnh sửa giá
  const handleEditPrice = (record) => {
    setSelectedPackage(record);
    form.setFieldsValue({ price: record.price });
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: 'Tên Gói',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span style={{ fontWeight: 500, color: '#1a3353' }}>{text}</span>
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (text) => <span style={{ color: '#666' }}>{text}</span>
    },
    {
      title: 'Giá (VNĐ)',
      dataIndex: 'price',
      key: 'price',
      render: (price) => (
        <span style={{ color: '#52c41a', fontWeight: 500 }}>
          {new Intl.NumberFormat('vi-VN').format(price)}
        </span>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            onClick={() => handleEditPrice(record)}
            style={buttonStyle}
            icon={<EditOutlined />}
          >
            Chỉnh sửa giá
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={pageStyle}>
      <Title 
        level={2} 
        style={{
          marginBottom: '24px',
          color: '#1a3353',
          fontSize: '24px',
          fontWeight: '600',
          position: 'relative',
          paddingBottom: '12px'
        }}
      >
        Quản Lý Gói Thành Viên
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '50px',
          height: '3px',
          background: '#1890ff',
          borderRadius: '2px'
        }}/>
      </Title>

      <Table
        columns={columns}
        dataSource={packages}
        rowKey="id"
        pagination={false}
        style={tableStyle}
      />

      <Modal
        title={
          <div style={{ 
            borderBottom: '2px solid #f0f0f0',
            paddingBottom: '16px',
            marginBottom: '24px',
            fontSize: '18px',
            fontWeight: 500
          }}>
            Chỉnh Sửa Giá Gói Thành Viên
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={500}
        style={{ top: 20 }}
        bodyStyle={{ padding: '24px' }}
      >
        <Form
          form={form}
          onFinish={handleUpdatePrice}
          layout="vertical"
        >
          <Form.Item
            name="price"
            label={<span style={{ fontSize: '16px' }}>Giá Mới</span>}
            rules={[
              { required: true, message: 'Vui lòng nhập giá' },
              { 
                validator: async (_, value) => {
                  if (!value) return;
                  if (value <= 0) {
                    throw new Error('Giá phải lớn hơn 0 VNĐ');
                  }
                  if (!Number.isInteger(Number(value))) {
                    throw new Error('Giá phải là số nguyên');
                  }
                }
              }
            ]}
          >
            <Input 
              type="number" 
              placeholder="Nhập giá mới (VNĐ)" 
              min="1"
              style={{ 
                height: '40px', 
                borderRadius: '6px',
                fontSize: '16px'
              }}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button 
              type="primary" 
              htmlType="submit"
              style={{
                ...buttonStyle,
                height: '40px',
                padding: '0 24px',
                fontSize: '16px'
              }}
            >
              Cập Nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminMembership;