import React, { useState, useEffect } from 'react';
import { Typography, Card, Spin, message, Empty, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const { Title, Text } = Typography;

function SubscriptionHistory() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      // Kiểm tra token thay vì user data
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập để xem lịch sử đăng ký');
        navigate('/login');
        return;
      }

      const data = await api.membership.getUserMembership();
      console.log('Raw subscription data:', data);
      
      // Check if user has active Premium Plan
      const hasActivePremium = data.some(sub => 
        sub.status === 'Active' && sub.packageName === 'Premium Plan'
      );

      // Group subscriptions by packageId and status
      const groupedData = data.reduce((acc, sub) => {
        if (!sub) return acc;
        
        // If there's active Premium, mark all Basic Plans as Expired
        if (hasActivePremium && sub.packageName === 'Basic Plan') {
          sub.status = 'Expired';
        }
        
        const key = `${sub.packageId}-${sub.status}`;
        if (!acc[key]) {
          acc[key] = {
            ...sub,
            packageName: sub.packageName,
            startDate: sub.startDate,
            endDate: sub.endDate,
            status: sub.status
          };
        }
        return acc;
      }, {});

      // Convert grouped data back to array
      const sortedData = Object.values(groupedData)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      console.log('Processed subscription data:', sortedData);
      setSubscriptions(sortedData);
    } catch (error) {
      console.error('Error fetching subscription history:', error);
      message.error('Could not load subscription history');
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Listen for payment completion
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const paymentSuccess = queryParams.get('payment');
    
    if (paymentSuccess === 'success') {
      fetchSubscriptions();
      // Remove query parameter
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [window.location.search]);
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}><Spin size="large" /></div>;
  }

  return (
    <div style={{ 
      padding: '40px 20px',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <Title level={2} style={{
        textAlign: 'center',
        marginBottom: '40px',
        color: '#1890ff',
        fontWeight: 'bold',
        fontSize: '2.5rem'
      }}>Lịch Sử Đăng Ký</Title>
      
      {subscriptions.length > 0 ? (
        subscriptions.map((subscription, index) => (
          <Card 
            key={index} 
            style={{ 
              marginBottom: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s ease',
              cursor: 'pointer',
              border: subscription.status === 'Active' ? '2px solid #52c41a' : 'none'
            }}
            hoverable
          >
            <Title level={4} style={{
              color: '#2c3e50',
              marginBottom: '20px',
              borderBottom: '1px solid #eee',
              paddingBottom: '10px'
            }}>{subscription.packageName}</Title>
            
            <Text style={{ fontSize: '16px', display: 'block', marginBottom: '10px' }}>
              Trạng thái: <span style={{
                color: subscription.status === 'Active' ? '#52c41a' :
                       subscription.status === 'Expired' ? '#ff4d4f' : '#faad14',
                fontWeight: 'bold',
                padding: '4px 12px',
                backgroundColor: subscription.status === 'Active' ? '#f6ffed' :
                                subscription.status === 'Expired' ? '#fff1f0' : '#fffbe6',
                borderRadius: '4px'
              }}>{subscription.status === 'Active' ? 'Đang hoạt động' : 
                   subscription.status === 'Expired' ? 'Đã hết hạn' : 'Đang chờ'}</span>
            </Text>
            
            <Text style={{ fontSize: '16px', display: 'block', marginBottom: '10px' }}>
              Ngày bắt đầu: <span style={{ fontWeight: '500' }}>
                {new Date(subscription.startDate).toLocaleDateString('vi-VN')}
              </span>
            </Text>
            
            <Text style={{ fontSize: '16px', display: 'block' }}>
              Ngày kết thúc: <span style={{ fontWeight: '500' }}>
                {new Date(subscription.endDate).toLocaleDateString('vi-VN')}
              </span>
            </Text>

            {subscription.status === 'Active' && subscription.packageName === 'Basic Plan' && (
              <div style={{ 
                marginTop: '20px',
                padding: '16px',
                backgroundColor: '#fff2e8',
                borderRadius: '8px',
                border: '1px dashed #ffbb96'
              }}>
                <Text type="warning" strong style={{ 
                  display: 'block', 
                  marginBottom: '12px', 
                  fontSize: '18px',
                  textAlign: 'center'
                }}>
                  🎉 Ưu đãi đặc biệt: Nâng cấp lên Premium với giá giảm 50%! 🎉
                </Text>
                <Button
                  type="primary"
                  danger
                  size="large"
                  style={{
                    width: '100%',
                    height: '48px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #ff4d4f, #ff7875)',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(255, 77, 79, 0.2)'
                  }}
                  onClick={() => navigate('/payment', {
                    state: {
                      packageDetails: {
                        id: 2,
                        name: 'Premium Plan',
                        price: 150000,
                        description: 'Special Upgrade Offer - 50% OFF'
                      }
                    }
                  })}
                >
                  Nâng cấp lên Premium (150.000 VNĐ/tháng)
                </Button>
              </div>
            )}
          </Card>
        ))
      ) : (
        <Empty 
          description={
            <span style={{ fontSize: '16px', color: '#666' }}>
              Không tìm thấy lịch sử đăng ký
            </span>
          }
          style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        />
      )}
    </div>
  );
}

export default SubscriptionHistory;