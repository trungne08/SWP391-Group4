import React from 'react';
import { Typography, Card, Button, Row, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Title, Text } = Typography;

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { packageDetails } = location.state || {};

  const handlePayment = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData?.user_id) {
        message.error('User information not found');
        return;
      }

      // Kiểm tra packageDetails
      if (!packageDetails || !packageDetails.id) {
        message.error('Package information is invalid');
        console.error('Package details:', packageDetails);
        return;
      }

      // Thêm returnUrl cho VNPay callback
      const returnUrl = `${window.location.origin}/payment-return`;
      
      console.log('Creating payment with:', {
        userId: userData.user_id,
        packageId: packageDetails.id,
        returnUrl
      });

      // Gọi API tạo thanh toán với returnUrl
      const response = await api.payment.createPayment(
        userData.user_id,
        packageDetails.id,
        returnUrl
      );

      console.log('Payment response:', response);

      if (response && response.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        message.error('Invalid payment response from server');
        console.error('Payment response:', response);
      }
    } catch (error) {
      console.error('Payment error:', error);
      message.error(error.message || 'Payment failed');
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

      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={4} style={{ margin: 0 }}>Amount to Pay</Title>
        <Text style={{ fontSize: '24px', color: '#52c41a' }}>
          {packageDetails?.price ? formatCurrency(packageDetails.price) : 'N/A'}
        </Text>
      </div>

      <Card>
        <div style={{ textAlign: 'center' }}>
          <Title level={4}>Payment Method</Title>
          <img 
            src="/vnpay-logo.png" 
            alt="VNPay" 
            style={{ height: '50px', marginBottom: '20px' }}
          />
          <Button 
            type="primary" 
            size="large" 
            block 
            onClick={handlePayment}
          >
            Pay with VNPay
          </Button>
        </div>
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