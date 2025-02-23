import React from 'react';
import { Result, Button, Card, Typography, Descriptions } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

function Confirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { packageDetails } = location.state || {};

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <Result
        icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
        title="Payment Successful!"
        subTitle="Thank you for your purchase. Your transaction has been completed."
        extra={[
          <Button type="primary" key="home" onClick={handleBackHome}>
            Back to Home
          </Button>
        ]}
      />

      <Card style={{ marginTop: '24px' }}>
        <Title level={4}>Payment Details</Title>
        <Descriptions column={1}>
          <Descriptions.Item label="Package">
            {packageDetails?.title || 'Premium Package'}
          </Descriptions.Item>
          <Descriptions.Item label="Amount">
            {packageDetails?.price ? formatCurrency(packageDetails.price) : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Transaction ID">
            {`TXN${Date.now()}`}
          </Descriptions.Item>
          <Descriptions.Item label="Date">
            {new Date().toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <Text type="secondary">
          A confirmation email has been sent to your registered email address
        </Text>
      </div>
    </div>
  );
}

export default Confirm;