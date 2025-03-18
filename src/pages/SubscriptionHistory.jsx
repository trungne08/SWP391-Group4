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
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData?.user_id) {
        message.error('User information not found');
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
    <div style={{ padding: '40px 20px' }}>
      <Title level={2}>Subscription History</Title>
      {subscriptions.length > 0 ? (
        subscriptions.map((subscription, index) => {
          console.log('Rendering subscription:', subscription);
          return (
            <Card key={index} style={{ marginBottom: '20px' }}>
              <Title level={4}>{subscription.packageName}</Title>
              <Text>Status: <span style={{
                color: subscription.status === 'Active' ? '#52c41a' :
                       subscription.status === 'Expired' ? '#ff4d4f' : '#faad14'
              }}>{subscription.status}</span></Text>
              <br />
              <Text>Start Date: {new Date(subscription.startDate).toLocaleDateString()}</Text>
              <br />
              <Text>End Date: {new Date(subscription.endDate).toLocaleDateString()}</Text>
              {subscription.status === 'Active' && subscription.packageName === 'Basic Plan' && (
                <div style={{ marginTop: '16px' }}>
                  <Text type="warning" strong style={{ display: 'block', marginBottom: '8px', fontSize: '16px' }}>
                    🎉 Special Offer: Upgrade to Premium with 50% OFF! 🎉
                  </Text>
                  <Button
                    type="primary"
                    danger
                    size="large"
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
                    Upgrade to Premium (150,000 VNĐ/month)
                  </Button>
                </div>
              )}
            </Card>
          );
        })
      ) : (
        <Empty description="No subscription history found" />
      )}
    </div>
  );
}

export default SubscriptionHistory;