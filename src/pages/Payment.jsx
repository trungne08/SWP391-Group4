import React from 'react';
import { Typography, Card, Form, Input, Button, Row, Col } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { packageDetails } = location.state || {};
  const [form] = Form.useForm();

  const onFinish = (values) => {
    // After successful form submission, navigate to confirm page
    navigate('/confirm', { 
      state: { 
        packageDetails,
        paymentDetails: values
      } 
    });
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
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="Card Number"
            name="cardNumber"
            rules={[{ required: true, message: 'Please enter your card number' }]}
          >
            <Input placeholder="1234 5678 9012 3456" maxLength={19} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Expiry Date"
                name="expiryDate"
                rules={[{ required: true, message: 'Please enter expiry date' }]}
              >
                <Input placeholder="MM/YY" maxLength={5} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="CVV"
                name="cvv"
                rules={[{ required: true, message: 'Please enter CVV' }]}
              >
                <Input placeholder="123" maxLength={3} type="password" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Cardholder Name"
            name="cardholderName"
            rules={[{ required: true, message: 'Please enter cardholder name' }]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block size="large">
            Pay Now
          </Button>
        </Form>
      </Card>

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <Text type="secondary">
          Your payment information is secure and encrypted
        </Text>
      </div>
    </div>
  );
}

export default Payment;