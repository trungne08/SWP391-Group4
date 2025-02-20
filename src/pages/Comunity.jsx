import React from 'react';
import { Typography, Button, Avatar, List, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function Comunity() {
  const quotes = [
    { id: 1, author: "Tim", content: "Quote content here" },
    { id: 2, author: "Tim", content: "Quote content here" },
    { id: 3, author: "Tim", content: "Quote content here" },
    { id: 4, author: "Tim", content: "Quote content here" },
    { id: 5, author: "Tim", content: "Quote content here" },
    { id: 6, author: "Tim", content: "Quote content here" },
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      {/* Header Section */}
      <div style={{ 
        position: "relative",
        height: "300px",
        borderRadius: "8px",
        overflow: "hidden",
        marginBottom: "30px"
      }}>
        <div style={{
          backgroundImage: "url('/img2.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100%",
          width: "100%"
        }} />
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          color: "#fff",
          zIndex: 2
        }}>
          <Title style={{ color: "#fff", marginBottom: "10px" }}>Community</Title>
          <Text style={{ color: "#fff", fontSize: "18px" }}>52+ million users every month</Text>
        </div>
      </div>

      {/* Action Buttons */}
      <Space size="large" style={{ marginBottom: "30px" }}>
        <Button type="primary" size="large">Post question</Button>
        <Button size="large">Post baby's chart</Button>
      </Space>

      {/* Quotes List */}
      <List
        itemLayout="horizontal"
        dataSource={quotes}
        renderItem={(item) => (
          <List.Item style={{ 
            padding: "20px", 
            background: "#fff", 
            marginBottom: "10px",
            borderRadius: "8px",
            border: "1px solid #f0f0f0"
          }}>
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={item.author}
              description={
                <div>
                  <Text>"{item.content}"</Text>
                </div>
              }
            />
          </List.Item>
        )}
      />

      {/* Pagination */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        {/* Add your pagination component here */}
      </div>
    </div>
  );
}

export default Comunity;