import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

function Blog() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsData = await api.blog.getAllBlogs();
        setBlogs(blogsData);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
        message.error("Không thể tải danh sách blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div style={{
      padding: "40px 20px",
      maxWidth: "1200px",
      margin: "0 auto",
      background: "#fff"
    }}>
      <Title 
        level={1} 
        style={{
          textAlign: "center",
          marginBottom: "50px",
          position: "relative",
          color: "#2c3e50"
        }}
      >
        Our Latest Blogs
        <div style={{
          width: "80px",
          height: "4px",
          background: "#1890ff",
          margin: "20px auto 0",
          borderRadius: "2px"
        }}></div>
      </Title>

      <Row gutter={[24, 24]}>
        {(isExpanded ? blogs : blogs.slice(0, 6)).map((blog, index) => (
          <Col xs={24} sm={12} md={8} key={blog.blogId || index}>
            <Card
              hoverable
              onClick={() => navigate(`/blog/${blog.blogId}`)}
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                transition: "all 0.3s ease",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                transform: "translateY(0)",
                ":hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.12)"
                }
              }}
              cover={
                blog.images && blog.images[0]?.imageUrl ? (
                  <div style={{
                    height: "220px",
                    overflow: "hidden"
                  }}>
                    <img
                      alt={blog.title}
                      src={blog.images[0].imageUrl}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                        ":hover": {
                          transform: "scale(1.05)"
                        }
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/fallback-image.jpg';
                      }}
                    />
                  </div>
                ) : (
                  <div style={{
                    height: "220px",
                    background: "linear-gradient(45deg, #f5f5f5, #e0e0e0)"
                  }}></div>
                )
              }
            >
              <Meta
                title={<div style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "#2c3e50"
                }}>{blog.title}</div>}
                description={
                  <div>
                    <Text style={{
                      color: "#666",
                      fontSize: "14px",
                      display: "block",
                      marginBottom: "8px"
                    }}>
                      {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Text>
                    <Paragraph 
                      ellipsis={{ rows: 3 }}
                      style={{
                        color: "#666",
                        marginBottom: "16px"
                      }}
                    >
                      {blog.content}
                    </Paragraph>
                    <div style={{
                      color: "#1890ff",
                      fontWeight: "500",
                      transition: "all 0.3s ease",
                      ":hover": {
                        color: "#40a9ff",
                        paddingLeft: "5px"
                      }
                    }}>
                      Read More →
                    </div>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {blogs.length > 6 && (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              padding: "10px 30px",
              fontSize: "16px",
              color: "#fff",
              background: "#1890ff",
              border: "none",
              borderRadius: "25px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              ":hover": {
                background: "#40a9ff",
                boxShadow: "0 4px 12px rgba(24,144,255,0.3)"
              }
            }}
          >
            {isExpanded ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Blog;