import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, Table } from 'antd';
import { UserOutlined, DollarOutlined, TeamOutlined } from '@ant-design/icons';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    memberUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    subscriptionsByPackage: {}
  });
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState([]);

  const columns = [
    { title: 'Username', dataIndex: 'name', key: 'name' },
    { title: 'Full Name', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    { title: 'Join Date', dataIndex: 'joinDate', key: 'joinDate' },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const users = await api.user.getAllUsers();
        const revenueStats = await api.membership.getRevenueStatistics();
        
        console.log('Users data:', users);
        console.log('Revenue stats:', revenueStats);

        const totalUsers = users.length;
        const adminUsers = users.filter(user => user.role === 'ADMIN').length;
        const memberUsers = users.filter(user => user.role === 'MEMBER').length;
        
        const recent = users.map(user => ({
          key: user.id,
          name: user.username,
          fullName: user.fullName === null ? 'Not updated' : user.fullName,
          email: user.email,
          role: user.role,
          joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US') : 'N/A'
        }));

        setRecentUsers(recent);
        setStats({
          totalUsers,
          adminUsers,
          memberUsers,
          activeUsers: totalUsers,
          totalRevenue: revenueStats?.totalRevenue || 0,
          subscriptionsByPackage: revenueStats?.subscriptionsByPackage || { "Premium Plan": 0 }
        });

      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setStats(prevStats => ({
          ...prevStats,
          totalRevenue: 0,
          subscriptionsByPackage: { "Premium Plan": 0 }
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Admin Dashboard</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/members')}>
            <Statistic 
              title="Total Users" 
              value={stats.totalUsers} 
              prefix={<UserOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/members')}>
            <Statistic 
              title="Admin Users" 
              value={stats.adminUsers} 
              prefix={<TeamOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Member Users" 
              value={stats.memberUsers} 
              prefix={<TeamOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Total Revenue" 
              value={stats.totalRevenue}
              prefix={<DollarOutlined />}
              loading={loading}
              suffix="VNĐ"
              formatter={value => `${value.toLocaleString()}`}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Card title="Subscription Statistics">
            <Row gutter={16}>
              {Object.entries(stats.subscriptionsByPackage).map(([packageName, count]) => (
                <Col span={12} key={packageName}>
                  <Statistic
                    title={`${packageName} Subscriptions`}
                    value={count}
                    suffix="users"
                  />
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      <Card title="Recent Users">
        <Table 
          columns={columns} 
          dataSource={recentUsers} 
          pagination={{ pageSize: 5 }}
          loading={loading}
        />
      </Card>
    </div>
  );
}

export default AdminDashboard;
