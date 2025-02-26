import React, { useState } from 'react';
import { Typography, Row, Col, Card, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

function FeePackage() {
  const navigate = useNavigate();
  const [billingType, setBillingType] = useState('monthly');

  const packages = [
    {
      title: "Basic Package",
      price: 500000,
      features: [
        "Basic pregnancy tracking",
        "Weekly updates",
        "Basic nutrition guide",
        "Community access",
        "Email support"
      ]
    },
    {
      title: "Premium Package",
      price: 1000000,
      features: [
        "Advanced pregnancy tracking",
        "Daily updates & tips",
        "Personalized nutrition plan",
        "Priority community access",
        "24/7 support"
      ]
    },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handlePackageSelect = (selectedPackage) => {
    navigate('/payment', { 
      state: { 
        packageDetails: selectedPackage,
        packageType: billingType 
      } 
    });
  };

  return (
    <div style={{ padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <Title level={1}>Sign up for premium now !</Title>
        <Text style={{ fontSize: '18px', color: '#666' }}>
          keep track of your baby anytime, anywhere
        </Text>
      </div>

      <Row gutter={[24, 24]} justify="center">
        {packages.map((pkg, index) => (
          <Col xs={24} md={8} key={index}>
            <Card
              style={{
                textAlign: 'center',
                height: '100%',
                backgroundColor: index === 1 ? '#2c2c2c' : 'white',
                color: index === 1 ? 'white' : 'inherit'
              }}
              bodyStyle={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <Title level={3} style={{ color: index === 1 ? 'white' : 'inherit' }}>
                {pkg.title}
              </Title>
              <div style={{ margin: '24px 0' }}>
                <Text style={{ 
                  fontSize: '28px', 
                  fontWeight: 'bold', 
                  color: index === 1 ? 'white' : 'inherit',
                  display: 'block'
                }}>
                  {formatCurrency(pkg.price)}
                </Text>
                <Text style={{ color: index === 1 ? 'white' : '#666' }}>/tháng</Text>
              </div>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                margin: '24px 0',
                flex: 1,
                textAlign: 'left' 
              }}>
                {pkg.features.map((feature, idx) => (
                  <li 
                    key={idx} 
                    style={{ 
                      marginBottom: '12px',
                      color: index === 1 ? 'white' : 'inherit'
                    }}
                  >
                    • {feature}
                  </li>
                ))}
              </ul>
              <Button 
                type={index === 1 ? 'default' : 'primary'}
                size="large"
                block
                style={{
                  backgroundColor: index === 1 ? 'white' : undefined,
                  color: index === 1 ? '#2c2c2c' : undefined
                }}
                onClick={() => handlePackageSelect(pkg)}
              >
                Get Started
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default FeePackage;