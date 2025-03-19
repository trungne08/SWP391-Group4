import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Button, Spin, message, Modal } from 'antd';
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
        setLoading(true);
        console.log("Fetching packages...");
        const data = await api.membership.getAllPackages();
        console.log("Received packages:", data);
        
        // Kiểm tra và xử lý dữ liệu trước khi set state
        if (Array.isArray(data) && data.length > 0) {
          setPackages(data);
        } else {
          // Nếu không có dữ liệu, set default packages
          setPackages([
            {
              id: 1,
              name: "Basic Plan",
              description: "Essential features for getting started",
              price: 0,
              features: ["Basic tracking features", "Limited storage", "Email support"]
            },
            {
              id: 2,
              name: "Premium Plan",
              description: "Advanced features for power users",
              price: 250000,  // Changed to VND
              features: ["All basic features", "Unlimited storage", "Priority support", "Advanced analytics"]
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
        message.error('Failed to load packages');
        // Set default packages khi có lỗi
        setPackages([
          {
            id: 1,
            name: "Basic Plan",
            description: "Basic plan for new users",
            price: 150000,
            features: ["Basic tracking features", "Limited storage", "Email support"]
          },
          {
            id: 2,
            name: "Premium Plan",
            description: "Premium plan with more features",
            price: 300000,
            features: ["All basic features", "Unlimited storage", "Priority support", "Advanced analytics"]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);
  // Add state for modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPackageData, setSelectedPackageData] = useState(null);
  
  const handlePackageSelect = async (selectedPackage) => {
    if (!isAuthenticated) {
      message.warning('Please login to subscribe to a package');
      navigate('/login');
      return;
    }
    
    try {
      const response = await api.membership.getUserMembership();
      console.log("User membership response:", response);
      console.log("Selected package:", selectedPackage); // Add this log
      
      const activeSubscription = response.find(sub => sub.status === 'Active');
      
      if (activeSubscription) {
        if (activeSubscription.packageName === 'Premium Plan' && selectedPackage.name === 'Basic Plan') {
          message.info('Cannot downgrade from Premium to Basic Plan');
          return;
        }
      }

      // Make sure we pass the correct price
      navigate('/payment', {
        state: {
          packageDetails: {
            id: selectedPackage.id,
            name: selectedPackage.name,
            price: selectedPackage.price, // This should be 150000 for Basic Plan
            description: selectedPackage.description
          }
        }
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      message.error('Failed to process package selection');
    }
  };

  // Remove handleModalConfirm and isModalVisible since we're not using modal anymore
  const handleModalConfirm = async () => {
    try {
      await api.membership.upgradeSubscription(selectedPackageData.subscription.subscription_id);
      message.success('Successfully upgraded to Premium');
      navigate('/subscription-history?upgraded=true');
    } catch (error) {
      message.error(error.message || 'Failed to upgrade subscription');
    } finally {
      setIsModalVisible(false);
      setSelectedPackageData(null);
    }
  };

  return (
    <div style={{ 
      padding: '60px 20px',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
      minHeight: '100vh'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <Title level={1} style={{
          fontSize: '72px',
          fontFamily: "'Comic Sans MS', cursive",
          fontWeight: 800,
          color: '#2c3e50',
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
          letterSpacing: '2px',
          position: 'relative',
          marginBottom: '30px',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-15px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '120px',
            height: '4px',
            background: 'linear-gradient(45deg, #FF69B4, #FFB6C1)',
            borderRadius: '2px'
          }
        }}>
          Sign up for premium now!
        </Title>
        <Text style={{ 
          fontSize: '1.5rem', 
          color: '#666',
          fontWeight: 500
        }}>
          Keep track of your baby anytime, anywhere
        </Text>
      </div>

      <Row gutter={[32, 32]} justify="center">
        {packages.map((pkg, index) => (
          <Col xs={24} md={8} key={pkg.id}>
            <Card
              style={{
                textAlign: 'center',
                height: '100%',
                backgroundColor: index === 1 ? '#2c2c2c' : 'white',
                color: index === 1 ? 'white' : 'inherit',
                borderRadius: '20px',
                boxShadow: index === 1 
                  ? '0 20px 40px rgba(255,105,180,0.3)' 
                  : '0 10px 30px rgba(0,0,0,0.1)',
                transform: index === 1 ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.3s ease',
                border: index === 1 ? '3px solid #FF69B4' : 'none',
                overflow: 'hidden'
              }}
              bodyStyle={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                padding: '40px 30px'
              }}
            >
              <Title level={3} style={{ 
                color: index === 1 ? 'white' : '#2c3e50',
                fontSize: '2.2rem',
                marginBottom: '20px'
              }}>
                {pkg.name}
              </Title>
              <Text style={{ 
                color: index === 1 ? '#ccc' : '#666',
                fontSize: '1.1rem',
                marginBottom: '30px'
              }}>
                {pkg.description}
              </Text>
              <div style={{ 
                margin: '30px 0',
                padding: '20px 0',
                borderTop: `1px solid ${index === 1 ? '#444' : '#eee'}`,
                borderBottom: `1px solid ${index === 1 ? '#444' : '#eee'}`
              }}>
                <Text style={{ 
                  fontSize: '3rem', 
                  fontWeight: 'bold', 
                  color: index === 1 ? 'white' : '#2c3e50',
                  display: 'block'
                }}>
                  {pkg.price.toLocaleString('vi-VN')} VNĐ
                </Text>
                <Text style={{ 
                  color: index === 1 ? '#ccc' : '#666',
                  fontSize: '1.1rem'
                }}>/tháng</Text>
              </div>
              <ul style={{ 
                listStyle: 'none', 
                padding: '0 20px', 
                margin: '30px 0',
                flex: 1,
                textAlign: 'left' 
              }}>
                {pkg.features?.map((feature, idx) => (
                  <li key={idx} style={{ 
                    marginBottom: '15px',
                    color: index === 1 ? 'white' : '#2c3e50',
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      color: index === 1 ? '#FF69B4' : '#52c41a',
                      marginRight: '10px',
                      fontSize: '1.2rem'
                    }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                type={index === 1 ? 'default' : 'primary'}
                size="large"
                style={{
                  height: '50px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: '25px',
                  backgroundColor: index === 1 ? 'white' : '#FF69B4',
                  color: index === 1 ? '#2c2c2c' : 'white',
                  border: 'none',
                  marginTop: '20px',
                  transition: 'all 0.3s ease',
                  boxShadow: index === 1 
                    ? '0 8px 15px rgba(255,255,255,0.2)' 
                    : '0 8px 15px rgba(255,105,180,0.3)'
                }}
                onClick={() => handlePackageSelect(pkg)}
                block
                hover={{
                  transform: 'translateY(-3px)',
                  boxShadow: index === 1 
                    ? '0 12px 20px rgba(255,255,255,0.3)' 
                    : '0 12px 20px rgba(255,105,180,0.4)'
                }}
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