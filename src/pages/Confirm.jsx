import React, { useEffect, useState } from 'react';
import { Result, Button, Card, Typography, Descriptions, Spin, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

const { Title, Text } = Typography;

function Confirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [transactionDetails, setTransactionDetails] = useState(null);

  useEffect(() => {
    const handlePaymentResult = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const vnp_ResponseCode = queryParams.get('vnp_ResponseCode');

        if (vnp_ResponseCode === '00') {
          const result = await api.payment.processPaymentReturn(queryParams);
          
          if (result.success) {
            setPaymentStatus('success');
            setTransactionDetails({
              packageName: result.packageName,
              amount: parseInt(queryParams.get('vnp_Amount')) / 100,
              transactionId: queryParams.get('vnp_TransactionNo'),
              paymentDate: queryParams.get('vnp_PayDate'),
              bankCode: queryParams.get('vnp_BankCode'),
              startDate: result.startDate,
              endDate: result.endDate
            });
            message.success('Payment successful! Your subscription has been activated.');
          } else {
            throw new Error(result.message || 'Payment verification failed');
          }
        } else {
          setPaymentStatus('failed');
          message.error('Payment failed: Transaction declined');
        }
      } catch (error) {
        console.error('Payment processing error:', error);
        setPaymentStatus('failed');
        message.error(error.message || 'An error occurred while processing payment.');
      }
    };

    if (location.search) {
      handlePaymentResult();
    } else {
      navigate('/feepackage');
    }
  }, [location.search, navigate]);

  const handleBackHome = () => {
    navigate('/');
  };

  const handleViewSubscription = () => {
    navigate('/subscription-history');
  };

  if (!paymentStatus) {
    return <div style={{ textAlign: 'center', padding: '40px' }}><Spin size="large" /></div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <Result
        icon={paymentStatus === 'success' ? 
          <CheckCircleOutlined style={{ color: '#52c41a' }} /> : 
          <CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
        title={paymentStatus === 'success' ? "Payment Successful!" : "Payment Failed"}
        subTitle={paymentStatus === 'success' ? 
          "Thank you for your purchase. Your transaction has been completed." :
          "Sorry, the payment could not be completed. Please try again."}
        extra={[
          <Button type="primary" key="home" onClick={handleBackHome}>
            Back to Home
          </Button>,
          paymentStatus === 'success' && (
            <Button key="subscription" onClick={handleViewSubscription}>
              View Subscription History
            </Button>
          )
        ]}
      />

      {paymentStatus === 'success' && transactionDetails && (
        <Card style={{ marginTop: '24px' }}>
          <Title level={4}>Payment Details</Title>
          <Descriptions column={1}>
            <Descriptions.Item label="Package">
              {transactionDetails.packageName}
            </Descriptions.Item>
            <Descriptions.Item label="Amount">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(transactionDetails.amount)}
            </Descriptions.Item>
            <Descriptions.Item label="Transaction ID">
              {transactionDetails.transactionId}
            </Descriptions.Item>
            <Descriptions.Item label="Bank">
              {transactionDetails.bankCode}
            </Descriptions.Item>
            <Descriptions.Item label="Payment Time">
              {new Date(transactionDetails.paymentDate).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Subscription Period">
              {`${new Date(transactionDetails.startDate).toLocaleDateString()} - ${new Date(transactionDetails.endDate).toLocaleDateString()}`}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </div>
  );
}

export default Confirm;