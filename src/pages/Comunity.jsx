import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Avatar, List, Space, Modal, Form, Input, Radio, Upload, Tag, Tooltip, message } from 'antd';
import { UserOutlined, PictureOutlined, CommentOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Title, Text, TextArea } = Typography;

function Comunity() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [postType, setPostType] = useState('question');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handlePostClick = (postId) => {
    navigate(`/comunity/post/${postId}`);
  };

  // Update renderPostContent function
  const renderPostContent = (post) => (
    <>
      <Title level={4}>{post.title}</Title>
      <Text>{post.content}</Text>
      <div style={{ marginTop: 16 }}>
        <Space size="large">
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

  // Add this useEffect to fetch posts when component mounts
  useEffect(() => {
    fetchPosts();
  }, []);

  // Add function to fetch posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      console.log('Fetching posts...'); // Debug log
      const response = await api.community.getAllPosts();
      console.log('Posts received:', response); // Debug log to see API response
      // Sort posts by createdAt in descending order
      const sortedPosts = response.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPosts(sortedPosts);
    } catch (error) {
      message.error('Failed to fetch posts');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update handleSubmit to use the API
  const handleSubmit = async (values) => {
    try {
      const postData = {
        title: values.title,
        content: values.content,
        mediaUrls: [], // Default empty array for question posts
        isAnonymous: isAnonymous
      };

      // If it's a chart post, add the additional data
      if (postType === 'chart') {
        postData.babyName = values.babyName;
        postData.age = values.age;
        postData.weight = values.weight;
        postData.height = values.height;
        postData.description = values.description;
        // Handle image uploads if any
        if (values.photos) {
          postData.mediaUrls = values.photos.map(photo => photo.url);
        }
      }

      await api.community.createPost(postData);
      message.success('Post created successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchPosts(); // Refresh the posts list
    } catch (error) {
      message.error('Failed to create post');
      console.error('Error creating post:', error);
    }
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
      {/* Update the List component to use loading state */}
      <List
        loading={loading}
        itemLayout="vertical"
        dataSource={posts}
        renderItem={(post) => (
          <List.Item
            key={post.postId}
            onClick={() => handlePostClick(post.postId)}
            style={{
              padding: "24px",
              background: "#fff",
              marginBottom: "16px",
              borderRadius: "8px",
              border: "1px solid #f0f0f0",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            <List.Item.Meta
              avatar={
                <Space>
                  <Avatar 
                    icon={<UserOutlined />}
                    src={!post.isAnonymous ? post.author?.userProfile?.avatar : null}
                  />
                  {post.author?.enabled && !post.isAnonymous && (
                    <Tooltip title="Verified User">
                      <Tag color="blue">✓</Tag>
                    </Tooltip>
                  )}
                </Space>
              }
              title={<Space>
                <Text strong>
                  {post.isAnonymous 
                    ? "Anonymous" 
                    : (post.author?.userProfile?.fullName || post.author?.usernameField || 'Unknown User')}
                </Text>
                <Text type="secondary">
                  {post.createdAt ? new Date(post.createdAt).toLocaleString() : ''}
                </Text>
              </Space>}
            />
            <div>
              <Title level={4}>{post.title}</Title>
              <Text>{post.content}</Text>
              {post.mediaFiles && post.mediaFiles.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  {post.mediaFiles.map((file, index) => (
                    <img 
                      key={file.mediaId} 
                      src={file.mediaUrl} 
                      alt={`Media ${index + 1}`}
                      style={{ maxWidth: 200, marginRight: 8, marginBottom: 8 }}
                    />
                  ))}
                </div>
              )}
              <div style={{ marginTop: 16 }}>
                <Space size="large">
                  <Button type="text" icon={<CommentOutlined />}>
                    {post.comments?.length || 0}
                  </Button>
                </Space>
              </div>
            </div>
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