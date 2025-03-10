import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Avatar, List, Space, Modal, Form, Input, Radio, Upload, Tag, Tooltip } from 'antd';
import { UserOutlined, PaperClipOutlined, PictureOutlined, LikeOutlined, CommentOutlined } from '@ant-design/icons';

const { Title, Text, TextArea } = Typography;

function Comunity() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [postType, setPostType] = useState('question');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handlePostClick = (postId) => {
    navigate(`/comunity/post/${postId}`);
  };

  // Trong phần posts, xóa thuộc tính tags của mỗi post
  const posts = [
    {
      id: 1,
      author: "Sarah Chen",
      avatar: "/avatars/sarah.jpg",
      type: "question",
      title: "Dealing with morning sickness during first trimester",
      content: "I'm 8 weeks pregnant and experiencing severe morning sickness. Any tips on managing this? What worked for you?",
      likes: 24,
      comments: 15,
      timestamp: "2 hours ago",
      isVerified: true
    },
    {
      id: 2,
      author: "Anonymous",
      type: "chart",
      title: "Baby's growth progress - 6 months",
      content: "My baby girl is 6 months old. Her weight is 7.5kg and height is 67cm. Doctor says she's growing well!",
      chartData: {
        weight: 7.5,
        height: 67,
        age: 6
      },
      likes: 18,
      comments: 8,
      timestamp: "5 hours ago"
    }
  ];

  // Trong hàm renderPostContent, xóa phần render tags
  const renderPostContent = (post) => (
    <>
      <Title level={4}>{post.title}</Title>
      <Text>{post.content}</Text>
      <div style={{ marginTop: 16 }}>
        <Space size="large">
          <Button type="text" icon={<LikeOutlined />}>
            {post.likes}
          </Button>
          <Button type="text" icon={<CommentOutlined />}>
            {post.comments}
          </Button>
        </Space>
      </div>
    </>
  );
  const showPostModal = (type) => {
    setPostType(type);
    setIsModalVisible(true);
  };

  const handleSubmit = (values) => {
    console.log({ ...values, isAnonymous });
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      {/* Header Section */}
      <div style={{ 
        position: "relative",
        height: "400px",  // Tăng từ 300px lên 400px
        borderRadius: "8px",
        overflow: "hidden",
        marginBottom: "30px"
      }}>
        <div style={{
          backgroundImage: "url('/img2.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100%",
          width: "100%",
          filter: "brightness(0.8)"  // Thêm độ tối nhẹ để text dễ đọc hơn
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
          <Title style={{ color: "#fff", marginBottom: "20px", fontSize: "48px" }}>Community</Title>
          <Text style={{ color: "#fff", fontSize: "24px" }}>52+ million users every month</Text>
        </div>
      </div>

      {/* Action Buttons */}
      <Space size="large" style={{ marginBottom: "30px" }}>
        <Button type="primary" size="large" onClick={() => showPostModal('question')}>
          Post question
        </Button>
        <Button size="large" onClick={() => showPostModal('chart')}>
          Post baby's chart
        </Button>
      </Space>
{/* Post Modal */}
      <Modal
        title={postType === 'question' ? "Post a Question" : "Post Baby's Chart"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={postType === 'chart' ? 800 : 520}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          {postType === 'chart' ? (
            <>
              <Form.Item
                name="babyName"
                label="Baby's Name"
                rules={[{ required: true, message: 'Please input baby name!' }]}
              >
                <Input />
              </Form.Item>

              <Space size="large" style={{ display: 'flex', marginBottom: '24px' }}>
                <Form.Item
                  name="age"
                  label="Age (months)"
                  rules={[{ required: true, message: 'Please input age!' }]}
                >
                  <Input type="number" min={0} max={36} />
                </Form.Item>

                <Form.Item
                  name="weight"
                  label="Weight (kg)"
                  rules={[{ required: true, message: 'Please input weight!' }]}
                >
                  <Input type="number" step="0.1" />
                </Form.Item>

                <Form.Item
                  name="height"
                  label="Height (cm)"
                  rules={[{ required: true, message: 'Please input height!' }]}
                >
                  <Input type="number" step="0.1" />
                </Form.Item>
              </Space>

              <Form.Item
                name="description"
                label="Description"
              >
                <Input.TextArea rows={4} placeholder="Add any additional information about your baby's growth..." />
                <div style={{ marginTop: '8px' }}>
                  <Space>
                    <Upload
                      listType="picture-card"
                      maxCount={4}
                      beforeUpload={() => false}
                    >
                      <Button icon={<PictureOutlined />} type="text">
                        Photo
                      </Button>
                    </Upload>
                  </Space>
                </div>
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: 'Please input a title!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="content"
                label="Content"
                rules={[{ required: true, message: 'Please input content!' }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
            </>
          )}

          <Form.Item label="Posting As">
            <Radio.Group 
              value={isAnonymous} 
              onChange={(e) => setIsAnonymous(e.target.value)}
            >
              <Radio value={false}>Public (Your name will be visible)</Radio>
              <Radio value={true}>Anonymous</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Post
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Post List */}
      <List
        itemLayout="vertical"
        dataSource={posts}
        renderItem={(post) => (
          <List.Item
            onClick={() => handlePostClick(post.id)}
            style={{
              padding: "24px",
              background: "#fff",
              marginBottom: "16px",
              borderRadius: "8px",
              border: "1px solid #f0f0f0",
              cursor: "pointer", // Add cursor pointer
              transition: "all 0.3s ease", // Add smooth transition
              '&:hover': {
                backgroundColor: "#f5f5f5", // Add hover effect
                transform: "translateY(-2px)" // Slight lift effect on hover
              }
            }}
          >
            <List.Item.Meta
              avatar={
                <Space>
                  <Avatar src={post.avatar} icon={<UserOutlined />} />
                  {post.isVerified && (
                    <Tooltip title="Verified User">
                      <Tag color="blue">✓</Tag>
                    </Tooltip>
                  )}
                </Space>
              }
              title={<Space>
                <Text strong>{post.author}</Text>
                <Text type="secondary">{post.timestamp}</Text>
              </Space>}
            />
            {renderPostContent(post)}
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