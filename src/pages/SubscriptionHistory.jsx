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
      const data = await api.membership.getUserMembership();
      console.log('Subscription data:', data);
      // Sắp xếp subscriptions theo thời gian tạo mới nhất
      const sortedData = Array.isArray(data) 
        ? [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        : [data];
      setSubscriptions(sortedData);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      message.error('Failed to load subscription history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);
  // Lắng nghe signal upgrade từ FeePackage
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const upgraded = queryParams.get('upgraded');
    
    if (upgraded === 'true') {
      fetchSubscriptions();
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
        subscriptions.map((subscription, index) => (
          <Card key={index} style={{ marginBottom: '20px' }}>
            <Title level={4}>{subscription.packageName}</Title>
            <Text>Status: {subscription.status}</Text>
            <br />
            <Text>Start Date: {new Date(subscription.startDate).toLocaleDateString()}</Text>
            <br />
            <Text>End Date: {new Date(subscription.endDate).toLocaleDateString()}</Text>
            <br />
            <Text>Price: ${subscription.price}/month</Text>
            {subscription.status === 'Active' && subscription.packageName === 'Basic Plan' && (
              <Button
                type="primary"
                style={{ marginTop: '16px' }}
                onClick={() => navigate('/feepackage')}
              >
                View Available Packages
              </Button>
            )}
          </Card>
        ))
      ) : (
        <Empty description="No subscription history found" />
      )}
    </div>
  );
}

export default SubscriptionHistory;