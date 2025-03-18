import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, Table } from 'antd';
import { UserOutlined, DollarOutlined, TeamOutlined, RiseOutlined } from '@ant-design/icons';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const cardStyle = {
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  background: '#fff',
  border: 'none',
  overflow: 'hidden',
  height: '100%', // Thêm chiều cao cố định
  ':hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  }
};

const iconStyle = {
  fontSize: '24px',
  padding: '8px',
  borderRadius: '8px',
  marginRight: '8px'
};

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
    <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <Title level={2} style={{ 
        marginBottom: '30px',
        color: '#1a3353',
        fontSize: '28px',
        fontWeight: '600',
        position: 'relative',
        paddingBottom: '10px'
      }}>
        Admin Dashboard
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '60px',
          height: '3px',
          background: '#1890ff',
          borderRadius: '2px'
        }}/>
      </Title>

      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ ...cardStyle, background: 'linear-gradient(135deg, #1890ff 0%, #36a1ff 100%)' }}
            onClick={() => navigate('/admin/members')}
          >
            <Statistic 
              title={<span style={{ color: '#fff' }}>Total Users</span>}
              value={stats.totalUsers} 
              prefix={<UserOutlined style={{ ...iconStyle, background: 'rgba(255,255,255,0.2)', color: '#fff' }} />}
              loading={loading}
              valueStyle={{ color: '#fff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ ...cardStyle, background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)' }}
            onClick={() => navigate('/admin/members')}
          >
            <Statistic 
              title={<span style={{ color: '#fff' }}>Admin Users</span>}
              value={stats.adminUsers} 
              prefix={<TeamOutlined style={{ ...iconStyle, background: 'rgba(255,255,255,0.2)', color: '#fff' }} />}
              loading={loading}
              valueStyle={{ color: '#fff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ ...cardStyle, background: 'linear-gradient(135deg, #722ed1 0%, #8e44ad 100%)' }}>
            <Statistic 
              title={<span style={{ color: '#fff' }}>Member Users</span>}
              value={stats.memberUsers} 
              prefix={<TeamOutlined style={{ ...iconStyle, background: 'rgba(255,255,255,0.2)', color: '#fff' }} />}
              loading={loading}
              valueStyle={{ color: '#fff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ ...cardStyle, background: 'linear-gradient(135deg, #f5222d 0%, #ff4d4f 100%)' }}>
            <Statistic 
              title={<span style={{ color: '#fff' }}>Total Revenue</span>}
              value={stats.totalRevenue}
              prefix={<DollarOutlined style={{ ...iconStyle, background: 'rgba(255,255,255,0.2)', color: '#fff' }} />}
              loading={loading}
              suffix="VNĐ"
              valueStyle={{ color: '#fff' }}
              formatter={value => `${value.toLocaleString()}`}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Card 
            title="Subscription Statistics" 
            style={{ 
              ...cardStyle, 
              cursor: 'default',
              background: '#fff'
            }}
            headStyle={{
              borderBottom: '2px solid #f0f0f0',
              padding: '16px 24px'
            }}
          >
            <Row gutter={24}>
              {Object.entries(stats.subscriptionsByPackage).map(([packageName, count]) => (
                <Col span={12} key={packageName}>
                  <Statistic
                    title={packageName}
                    value={count}
                    suffix="users"
                    prefix={<RiseOutlined style={{ color: '#1890ff' }} />}
                  />
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      <Card 
        title="Recent Users" 
        style={{ 
          ...cardStyle, 
          cursor: 'default' 
        }}
        headStyle={{
          borderBottom: '2px solid #f0f0f0',
          padding: '16px 24px'
        }}
      >
        <Table 
          columns={columns} 
          dataSource={recentUsers} 
          pagination={{ 
            pageSize: 5,
            style: { marginTop: '16px' }
          }}
          loading={loading}
        />
      </Card>
    </div>
  );
}

export default AdminDashboard;
