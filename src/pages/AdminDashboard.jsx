import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, Table, Progress } from 'antd';
import { UserOutlined, FileTextOutlined, DollarOutlined, TeamOutlined } from '@ant-design/icons';
import api from '../services/api';

import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    premiumUsers: 0,
    totalPosts: 0,
    monthlyRevenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const users = await api.user.getAllUsers();
        const totalUsers = users.length;
        const premiumUsers = users.filter(user => user.role === 'ADMIN').length;
        
        setStats({
          totalUsers: totalUsers,
          premiumUsers: premiumUsers,
          totalPosts: 156, // Có thể thay bằng API call khác nếu có
          monthlyRevenue: 8500 // Có thể thay bằng API call khác nếu có
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  // Sample recent users data
  const recentUsers = [
    { key: '1', name: 'Emma Davis', status: 'Premium', joinDate: '2024-01-15' },
    { key: '2', name: 'Sarah Johnson', status: 'Regular', joinDate: '2024-01-14' },
    { key: '3', name: 'Michael Brown', status: 'Premium', joinDate: '2024-01-14' },
    { key: '4', name: 'Lisa Anderson', status: 'Regular', joinDate: '2024-01-13' },
  ];

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Join Date', dataIndex: 'joinDate', key: 'joinDate' },
  ];

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
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/members')}>
            <Statistic 
              title="Premium Users" 
              value={stats.premiumUsers} 
              prefix={<TeamOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Total Posts" 
              value={stats.totalPosts} 
              prefix={<FileTextOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Monthly Revenue" 
              value={stats.monthlyRevenue} 
              prefix={<DollarOutlined />} 
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      {/* Performance Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="User Growth">
            <Progress 
              percent={75} 
              status="active"
              format={percent => `${percent}% of monthly target`}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Premium Conversion Rate">
            <Progress 
              percent={34} 
              status="active"
              strokeColor="#52c41a"
              format={percent => `${percent}% of users`}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Users Table */}
      <Card title="Recent Users">
        <Table 
          columns={columns} 
          dataSource={recentUsers} 
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
}

export default AdminDashboard;
