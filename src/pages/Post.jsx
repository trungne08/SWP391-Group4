import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, Avatar, Space, List, Form, Input, Tag, Tooltip } from 'antd';
import { UserOutlined, LikeOutlined, CommentOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

function Post() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentForm] = Form.useForm();

  // Add mock posts data
  const mockPosts = [
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

  useEffect(() => {
    // Use mockPosts instead of posts
    const foundPost = mockPosts.find(p => p.id === parseInt(postId));
    setPost(foundPost);
    setComments(mockComments);
  }, [postId]);

  // Mock comments data (replace with actual API call)
  const mockComments = [
    {
      id: 1,
      author: "Jane Doe",
      avatar: "/avatars/jane.jpg",
      content: "Thank you for sharing! This is very helpful.",
      timestamp: "1 hour ago",
    },
    {
      id: 2,
      author: "John Smith",
      avatar: "/avatars/john.jpg",
      content: "I had similar experience. Try ginger tea, it helps a lot!",
      timestamp: "2 hours ago",
    }
  ];

  useEffect(() => {
    // Use mockPosts to find the post
    const foundPost = mockPosts.find(p => p.id === parseInt(postId));
    setPost(foundPost);
    setComments(mockComments);
  }, [postId]);

  // Remove the duplicate useEffect that uses 'posts'

  const handleSubmitComment = (values) => {
    const newComment = {
      id: comments.length + 1,
      author: "Current User",
      avatar: "/avatars/current-user.jpg",
      content: values.comment,
      timestamp: "Just now"
    };
    setComments([newComment, ...comments]);
    commentForm.resetFields();
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/comunity')}  // Changed from '/community' to '/comunity'
        style={{ marginBottom: "20px" }}
      >
        Back to Community
      </Button>

      <div style={{ 
        padding: "24px",
        background: "#fff",
        borderRadius: "8px",
        marginBottom: "24px"
      }}>
        <Space align="start">
          <Avatar src={post.avatar} icon={<UserOutlined />} size={48} />
          <div>
            <Space>
              <Text strong>{post.author}</Text>
              {post.isVerified && (
                <Tooltip title="Verified User">
                  <Tag color="blue">✓</Tag>
                </Tooltip>
              )}
              <Text type="secondary">{post.timestamp}</Text>
            </Space>
            <Title level={3}>{post.title}</Title>
            <Text>{post.content}</Text>
          </div>
        </Space>
      </div>

      {/* Comment Form */}
      <Form form={commentForm} onFinish={handleSubmitComment}>
        <Form.Item name="comment">
          <TextArea rows={4} placeholder="Write a comment..." />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Post Comment
          </Button>
        </Form.Item>
      </Form>

      {/* Comments List */}
      <List
        itemLayout="horizontal"
        dataSource={comments}
        renderItem={comment => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={comment.avatar} icon={<UserOutlined />} />}
              title={<Space>
                <Text strong>{comment.author}</Text>
                <Text type="secondary">{comment.timestamp}</Text>
              </Space>}
              description={comment.content}
            />
          </List.Item>
        )}
      />
    </div>
  );
}

export default Post;