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
  console.log("Package details in Payment:", packageDetails); // Add this log

  const handlePayment = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData?.user_id) {
        message.error('User information not found');
        return;
      }

      if (!packageDetails?.id) {
        message.error('Invalid package information');
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
        Back to Packages
      </Button>

      <Title level={2} style={{ textAlign: 'center', marginBottom: '16px' }}>
        Payment Details
      </Title>

      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Title level={4}>Package Information</Title>
          <Text strong>Package Name: </Text>
          <Text>{packageDetails?.name || 'N/A'}</Text>
          <br />
          <Text strong>Amount: </Text>
          <Text style={{ fontSize: '18px', color: '#52c41a' }}>
            {packageDetails?.price ? formatCurrency(packageDetails.price) : 'N/A'}
          </Text>
        </div>

        <Form onFinish={handlePayment} layout="vertical">
          <Form.Item
            name="orderDescription"
            label="Order Description"
            initialValue={`Payment for ${packageDetails?.name || 'subscription'}`}
            rules={[{ required: true, message: 'Please enter order description' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Title level={4}>Payment Method</Title>
            <Button 
              type="primary" 
              size="large" 
              block 
              htmlType="submit"
              loading={loading}
            >
              Pay with VNPay
            </Button>
          </div>
        </Form>
      </Card>

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <Text type="secondary">
          You will be redirected to VNPay to complete your payment
        </Text>
      </div>
    </div>
  );
}

export default Payment;