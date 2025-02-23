import React from 'react';
import { Row, Col, Card, Statistic, Typography, Table, Progress } from 'antd';
import { UserOutlined, FileTextOutlined, DollarOutlined, TeamOutlined } from '@ant-design/icons';

const { Title } = Typography;

function AdminDashboard() {
  // Sample statistics data
  const stats = {
    totalUsers: 2480,
    premiumUsers: 860,
    totalPosts: 156,
    monthlyRevenue: 8500
  };

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

      {/* Statistics Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Total Users" 
              value={stats.totalUsers} 
              prefix={<UserOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
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
