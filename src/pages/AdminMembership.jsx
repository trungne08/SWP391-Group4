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
} from 'antd';
import api from '../services/api'; // Add this import

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
          body: JSON.stringify({ price: parseInt(values.price) })
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
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Giá (VNĐ)',
      dataIndex: 'price',
      key: 'price',
      render: (price) => new Intl.NumberFormat('vi-VN').format(price),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEditPrice(record)}>
            Chỉnh sửa giá
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Quản lý Gói Membership">
      <Table
        columns={columns}
        dataSource={packages}
        rowKey="id"
        pagination={false}
      />

      <Modal
        title="Chỉnh sửa giá Membership"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleUpdatePrice}
          layout="vertical"
        >
          <Form.Item
            name="price"
            label="Giá mới"
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
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default AdminMembership;