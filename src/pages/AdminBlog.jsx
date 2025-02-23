import React, { useState } from 'react';
import { Typography, Button, Card, Avatar, Row, Pagination } from 'antd';

const { Title, Text } = Typography;

function AdminBlog() {
  const [currentPage, setCurrentPage] = useState(1);

  const blogs = [
    {
      id: 1,
      title: "Pregnancy Nutrition Guide",
      body: "Essential nutrition tips and guidelines for a healthy pregnancy journey.",
      author: "Dr. Sarah Johnson",
      postedAt: "2024-01-15 09:30",
      status: { access: true, delete: false }
    },
    {
      id: 2,
      title: "First Trimester Care",
      body: "Complete guide for managing the first trimester of pregnancy.",
      author: "Dr. Michael Brown",
      postedAt: "2024-01-14 14:45",
      status: { access: true, delete: false }
    },
    {
      id: 3,
      title: "Exercise During Pregnancy",
      body: "Safe exercises and activities recommended during pregnancy.",
      author: "Emma Davis, PT",
      postedAt: "2024-01-13 11:20",
      status: { access: true, delete: false }
    },
    {
      id: 4,
      title: "Common Pregnancy Symptoms",
      body: "Understanding and managing common pregnancy symptoms and discomforts.",
      author: "Dr. Lisa Anderson",
      postedAt: "2024-01-12 16:15",
      status: { access: true, delete: false }
    },
    {
      id: 5,
      title: "Preparing for Labor",
      body: "Essential tips and guidelines for preparing for labor and delivery.",
      author: "Dr. James Wilson",
      postedAt: "2024-01-11 13:50",
      status: { access: true, delete: false }
    }
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Title level={2}>Blog Management</Title>
        <Button type="primary">Add Blog</Button>
      </Row>

      {blogs.map((blog) => (
        <Card key={blog.id} style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <Avatar 
              size={64} 
              style={{ backgroundColor: '#f0f0f0' }}
            />
            <div style={{ flex: 1 }}>
              <Title level={5} style={{ marginTop: 0 }}>{blog.title}</Title>
              <Text type="secondary">{blog.body}</Text>
              <div style={{ marginTop: 8, marginBottom: 8 }}>
                <Text type="secondary">Posted by {blog.author} at {blog.postedAt}</Text>
              </div>
              <div>
                <Button 
                  size="small" 
                  type="primary"
                  style={{ marginRight: 8, backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                >
                  Access
                </Button>
                <Button 
                  size="small" 
                  danger
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}

      <Row justify="center" style={{ marginTop: 24 }}>
        <Pagination 
          current={currentPage}
          onChange={(page) => setCurrentPage(page)}
          total={50}
          showSizeChanger={false}
        />
      </Row>
    </div>
  );
}

export default AdminBlog;
