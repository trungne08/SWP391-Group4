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
      // Thêm xử lý lỗi và kiểm tra response
      const response = await api.membership.getUserMembership();
      console.log("User membership response:", response);
      
      // Kiểm tra nếu response là array
      const currentSubscriptions = Array.isArray(response) ? response : [];
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
    
        setSelectedPackageData({ 
          subscription: activeSubscription,
          package: selectedPackage 
        });
        setIsModalVisible(true);
      } else {
        const packageId = selectedPackage.id;
        if (!packageId) {
          throw new Error('Invalid package ID');
        }
        await api.membership.registerMembership(packageId);
        message.success('Successfully registered for new membership package');
        navigate('/subscription-history?upgraded=true');
      }
    } catch (error) {
      console.error('Error managing subscription:', error);
      message.error('Failed to manage subscription. Please try again later.');
    }
  };

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
                  {pkg.price.toLocaleString('vi-VN')} VNĐ
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
      
      <Modal
        title="Upgrade Confirmation"
        open={isModalVisible}
        onOk={handleModalConfirm}
        onCancel={() => setIsModalVisible(false)}
        centered
      >
        <p>Do you want to upgrade to Premium Plan?</p>
      </Modal>
    </div>
  );
}

export default FeePackage;