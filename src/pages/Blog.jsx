import React, { useState } from 'react';
import { Typography, Row, Col, Rate, Card, Avatar, Modal } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

function Blog() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", background: "#fff" }}>
      {/* Header Section */}
      <div 
        style={{ 
          textAlign: "center", 
          marginBottom: "40px",
          backgroundImage: "url('/img1.webp')", // Update with your image path
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "80px 20px",
          borderRadius: "8px",
          position: "relative",
          color: "#fff"
        }}
      >
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: "8px"
        }}></div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <Title style={{ color: "#333", marginBottom: "16px" }}>Blog's title</Title>
          <Text style={{ color: "#666" }}>Written by (author) | Publish date</Text>
        </div>
      </div>
      {/* Main Content */}
      <div style={{ marginBottom: "40px" }}>
        <Text style={{ fontSize: "16px", lineHeight: "1.6" }}>
          It's go time, and as mom's partner, it's your role to offer support and
          encouragement during labor and delivery. Here's what to expect
          during childbirth, plus tips for how to show up prepared.
        </Text>
        
        {/* Rating Section */}
        <div style={{ margin: "20px 0", padding: "20px", background: "#f8f8f8", borderRadius: "8px" }}>
          <Rate disabled defaultValue={5} />
          <Text style={{ marginLeft: "10px", fontWeight: "500" }}>Review title</Text>
          
          <div style={{ display: "flex", alignItems: "center", marginTop: "15px" }}>
            <Avatar icon={<UserOutlined />} />
            <Text style={{ marginLeft: "10px" }}>Reviewer name</Text>
          </div>
        </div>
      </div>

      {/* Blog Cards */}
      <Row gutter={[24, 24]}>
        {[1, 2, 3].map((item) => (
          <Col xs={24} sm={8} key={item}>
            <Card
              hoverable
              cover={
                <div style={{ 
                  height: "200px", 
                  background: "#f5f5f5",
                  borderRadius: "8px 8px 0 0"
                }}></div>
              }
              style={{ borderRadius: "8px" }}
            >
              <Meta
                title="Title"
                description="Click here to view your blog post..."
              />
            </Card>
          </Col>
        ))}
      </Row>
{/* Additional Blog Posts Section */}
      <div id="more-posts" style={{ marginTop: "40px", display: "none" }}>
        <Title level={3} style={{ textAlign: "center", marginBottom: "30px" }}>More Blog Posts</Title>
        <Row gutter={[24, 24]}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Col xs={24} sm={12} md={8} key={item}>
              <Card
                hoverable
                cover={
                  <div style={{ 
                    height: "160px", 
                    background: "#f5f5f5",
                    borderRadius: "8px 8px 0 0"
                  }}></div>
                }
                style={{ borderRadius: "8px" }}
              >
                <Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title="Blog Post Title"
                  description={
                    <div>
                      <Text type="secondary">Author name | Date</Text>
                      <div style={{ marginTop: "8px" }}>
                        <Rate disabled defaultValue={4} style={{ fontSize: "14px" }} />
                      </div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Read More Button */}
      <div style={{ textAlign: "center", margin: "40px 0" }}>
        <a 
          onClick={() => {
            const morePostsSection = document.getElementById('more-posts');
            if (morePostsSection) {
              morePostsSection.style.display = morePostsSection.style.display === 'none' ? 'block' : 'none';
            }
          }}
          style={{ 
            color: "#1890ff", 
            fontSize: "16px",
            textDecoration: "none",
            fontWeight: "500",
            cursor: "pointer"
          }}
        >
          Read more
        </a>
      </div>
    </div>
  );
}

export default Blog;