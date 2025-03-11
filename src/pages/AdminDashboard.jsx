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
    adminUsers: 0,
    memberUsers: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState([]);

  // Define columns once
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
        console.log('Raw users data:', users);

        const totalUsers = users.length;
        const adminUsers = users.filter(user => user.role === 'ADMIN').length;
        const memberUsers = users.filter(user => user.role === 'MEMBER').length;
        
        // Format recent users data
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
          activeUsers: totalUsers
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
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
              title="Active Users" 
              value={stats.activeUsers} 
              prefix={<UserOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Users Table with loading state */}
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
