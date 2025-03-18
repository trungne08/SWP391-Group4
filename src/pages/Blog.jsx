import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Rate, Card, Avatar, Modal, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

function Blog() {
  // Add new state for tracking expanded state
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsData = await api.blog.getAllBlogs();
        console.log("Blog data received:", blogsData); // Debug log
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

  const handleBlogClick = (blog) => {
    setSelectedBlog(blog);
    setIsModalVisible(true);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", background: "#fff" }}>
      {/* Initial Blog Cards */}
      <Row gutter={[24, 24]}>
        {(isExpanded ? blogs : blogs.slice(0, 6)).map((blog, index) => (
          <Col xs={24} sm={8} key={blog.blogId || index}>
            <Card
              hoverable
              onClick={() => handleBlogClick(blog)}
              cover={
                blog.images && blog.images[0]?.imageUrl ? (
                  <img
                    alt={blog.title}
                    src={blog.images[0].imageUrl}
                    style={{
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "8px 8px 0 0"
                    }}
                    onError={(e) => {
                      console.error("Image load error:", e);
                      e.target.onerror = null;
                      e.target.src = '/fallback-image.jpg';
                    }}
                  />
                ) : (
                  <div style={{ 
                    height: "200px", 
                    background: "#f5f5f5",
                    borderRadius: "8px 8px 0 0"
                  }}></div>
                )
              }
              style={{ borderRadius: "8px" }}
            >
              <Meta
                title={blog.title}
                description={
                  <div>
                    <Text type="secondary">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </Text>
                    <Paragraph ellipsis={{ rows: 2 }}>
                      {blog.content}
                    </Paragraph>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Remove the "More Blog Posts" section since we'll show all posts in the main section */}

      {/* Blog Detail Modal */}
      <Modal
        title={selectedBlog?.title}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedBlog && (
          <div>
            {selectedBlog.images && selectedBlog.images[0]?.imageUrl && (
              <img
                src={selectedBlog.images[0].imageUrl}
                alt={selectedBlog.title}
                style={{
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}
              />
            )}
            <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
              {new Date(selectedBlog.createdAt).toLocaleDateString()}
            </Text>
            <Paragraph style={{ 
              fontSize: '16px', 
              lineHeight: '1.8',
              whiteSpace: 'pre-line' 
            }}>
              {selectedBlog.content}
            </Paragraph>
          </div>
        )}
      </Modal>

      {/* Toggle Button */}
      {blogs.length > 6 && (
        <div style={{ textAlign: "center", margin: "40px 0" }}>
          <a 
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ 
              color: "#1890ff", 
              fontSize: "16px",
              textDecoration: "none",
              fontWeight: "500",
              cursor: "pointer"
            }}
          >
            {isExpanded ? "Show less" : "Show more"}
          </a>
        </div>
      )}
    </div>
  );
}

export default Blog;