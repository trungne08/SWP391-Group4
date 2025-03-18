import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Card, Spin, message, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Title, Text, Paragraph } = Typography;

function BlogDetail() {
  const navigate = useNavigate();
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const blogData = await api.blog.getBlogById(blogId);
        setBlog(blogData);
      } catch (error) {
        console.error("Failed to fetch blog detail:", error);
        message.error("Không thể tải thông tin blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [blogId]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  }

  if (!blog) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Blog không tồn tại</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <Button 
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/blog')}
        style={{ 
          marginBottom: '20px',
          borderRadius: '8px',
          fontSize: '16px',
        }}
      >
        Back to Blogs
      </Button>
      <Card style={{ borderRadius: '16px' }}>
        {blog.images && blog.images[0]?.imageUrl && (
          <img
            src={blog.images[0].imageUrl}
            alt={blog.title}
            style={{
              width: '100%',
              maxHeight: '500px',
              objectFit: 'cover',
              borderRadius: '16px',
              marginBottom: '24px'
            }}
          />
        )}
        <Title level={2}>{blog.title}</Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>
          {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
        </Text>
        <Paragraph style={{ 
          fontSize: '16px', 
          lineHeight: '1.8',
          whiteSpace: 'pre-line' 
        }}>
          {blog.content}
        </Paragraph>
      </Card>
    </div>
  );
}

export default BlogDetail;