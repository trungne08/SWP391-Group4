import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Button, Spin, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const { Title, Text } = Typography;

function FeePackage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        console.log("Fetching packages...");
        const data = await api.membership.getAllPackages();
        console.log("Received packages:", data);
        setPackages(data);
      } catch (error) {
        console.error('Error fetching packages:', error);
        message.error('Failed to load packages');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);
  const handlePackageSelect = async (selectedPackage) => {
    if (!isAuthenticated) {
      message.warning('Please login to subscribe to a package');
      navigate('/login');
      return;
    }
    
    try {
      const currentSubscriptions = await api.membership.getUserMembership();
      const activeSubscription = currentSubscriptions.find(sub => sub.status === 'Active');
      
      if (activeSubscription) {
        if (activeSubscription.packageName === 'Premium Plan') {
          message.info('You are already on Premium Plan');
          return;
        }
    
        if (selectedPackage.name === 'Basic Plan') {
          message.info('Cannot downgrade from Premium to Basic Plan');
          return;
        }
    
        const confirmed = window.confirm(
          'Do you want to upgrade to Premium Plan?'
        );
        
        if (!confirmed) {
          return;
        }
    
        // Thực hiện upgrade với subscription_id
        await api.membership.upgradeSubscription(activeSubscription.subscription_id);
        message.success('Successfully upgraded to Premium');
        navigate('/subscription-history?upgraded=true');
      } else {
        const packageId = selectedPackage.id;
        if (!packageId) {
          throw new Error('Invalid package ID');
        }
        
        // Đăng ký gói mới
        await api.membership.registerMembership(packageId);
        message.success('Successfully registered for new membership package');
        navigate('/subscription-history?upgraded=true');
      }
    } catch (error) {
      console.error('Error managing subscription:', error);
      message.error(error.message || 'Failed to manage subscription package');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}><Spin size="large" /></div>;
  }

  return (
    <div style={{ padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <Title level={1}>Sign up for premium now!</Title>
        <Text style={{ fontSize: '18px', color: '#666' }}>
          Keep track of your baby anytime, anywhere
        </Text>
      </div>

      <Row gutter={[24, 24]} justify="center">
        {packages.map((pkg, index) => (
          <Col xs={24} md={8} key={pkg.id}>
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
                {pkg.name}
              </Title>
              <Text style={{ color: index === 1 ? '#ccc' : '#666' }}>
                {pkg.description}
              </Text>
              <div style={{ margin: '24px 0' }}>
                <Text style={{ 
                  fontSize: '28px', 
                  fontWeight: 'bold', 
                  color: index === 1 ? 'white' : 'inherit',
                  display: 'block'
                }}>
                  {pkg.price} $
                </Text>
                <Text style={{ color: index === 1 ? 'white' : '#666' }}>/month</Text>
              </div>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                margin: '24px 0',
                flex: 1,
                textAlign: 'left' 
              }}>
                {pkg.features?.map((feature, idx) => (
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