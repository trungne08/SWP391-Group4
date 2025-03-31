import React, { useState } from 'react';
import { Typography, Card, Button, Row, message, Form, Input } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Title, Text } = Typography;

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { packageDetails } = location.state || {};

  const handlePayment = async (values) => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('user'));
      
      if (!userData?.user_id || !packageDetails?.id) {
        message.error('Invalid user or package information');
        return;
      }

      const result = await api.payment.createPaymentUrl(
        userData.user_id,
        packageDetails.id
      );

      if (result?.paymentUrl) {
        window.location.href = result.paymentUrl;
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      message.error('Cannot create payment. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleBack = () => {
    navigate('/feepackage');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={handleBack}
        style={{ marginBottom: '24px' }}
      >
        Quay Lại Gói Dịch Vụ
      </Button>

      <Title level={2} style={{ textAlign: 'center', marginBottom: '16px' }}>
        Chi Tiết Thanh Toán
      </Title>

      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Title level={4}>Thông Tin Gói Dịch Vụ</Title>
          <Text strong>Tên Gói: </Text>
          <Text>{packageDetails?.name || 'N/A'}</Text>
          <br />
          <Text strong>Số Tiền: </Text>
          <Text style={{ fontSize: '18px', color: '#52c41a' }}>
            {packageDetails?.price ? formatCurrency(packageDetails.price) : 'N/A'}
          </Text>
        </div>

        <Form onFinish={handlePayment} layout="vertical">
          <Form.Item
            name="orderDescription"
            label="Mô Tả Đơn Hàng"
            initialValue={`Thanh toán cho ${packageDetails?.name || 'gói dịch vụ'}`}
            rules={[{ required: true, message: 'Vui lòng nhập mô tả đơn hàng' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Title level={4}>Phương Thức Thanh Toán</Title>
            <Button 
              type="primary" 
              size="large" 
              block 
              htmlType="submit"
              loading={loading}
            >
              Thanh Toán với VNPay
            </Button>
          </div>
        </Form>
      </Card>

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <Text type="secondary">
          Bạn sẽ được chuyển đến VNPay để hoàn tất thanh toán
        </Text>
      </div>
    </div>
  );
}

export default Payment;