import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, Avatar, Space, List, Form, Input, Tag, Tooltip, message } from 'antd';
import { UserOutlined, LikeOutlined, CommentOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const { Title, Text } = Typography;
const { TextArea } = Input;

function Post() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentForm] = Form.useForm();

  useEffect(() => {
    fetchPostDetails();
  }, [postId]);

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      const postData = await api.community.getPostById(postId);
      setPost(postData);
      if (postData.comments) {
        setComments(postData.comments);
      }
    } catch (error) {
      message.error('Failed to fetch post details');
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };
  const renderChart = () => {
    if (post?.postType === 'GROWTH_CHART' && post?.chartData) {
      return (
        <div style={{ marginTop: "16px", padding: "12px", background: "#f5f5f5", borderRadius: "8px" }}>
          {[
            { key: "headCircumference", label: "Head Circumference", unit: "mm", color: "#8884d8" },
            { key: "fetalWeight", label: "Fetal Weight", unit: "g", color: "#82ca9d" },
            { key: "femurLength", label: "Femur Length", unit: "mm", color: "#ffc658" },
          ].map(({ key, label, unit, color }) => {
            const chartData = post.chartData[key]?.map(([week, value]) => ({ week, value })) || [];
            const predictionData = post.chartData.predictionLine?.[`${key === "fetalWeight" ? "weight" : key === "headCircumference" ? "head" : "length"}Prediction`]?.map(([week, value]) => ({ week, value })) || [];
            
            return chartData.length > 0 && (
              <div key={key} style={{ marginTop: "16px", height: "200px" }}>
                <Text strong>{label} Chart</Text>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 40, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="week" 
                      label={{ value: 'Week', position: 'bottom', offset: 20 }}
                      dy={16}
                    />
                    <YAxis 
                      dataKey="value" 
                      label={{ value: unit, angle: -90, position: 'insideLeft', offset: -10 }}
                      dx={-10}
                    />
                    <Tooltip formatter={(value) => `${value} ${unit}`} />
                    <Legend verticalAlign="top" height={36} />
                    <Line type="monotone" dataKey="value" stroke={color} name={label} dot={{ r: 4 }} />
                    {predictionData.length > 0 && (
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={`${color}80`}
                        name={`${label} Prediction`}
                        dot={false}
                        data={predictionData}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const handleSubmitComment = async (values) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Please login to comment');
        return;
      }

      await api.community.createComment(postId, { 
        content: values.comment,
        postId: postId
      });
      message.success('Comment posted successfully');
      commentForm.resetFields();
      fetchPostDetails();
    } catch (error) {
      message.error('Failed to post comment');
      console.error('Error posting comment:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/comunity')}
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
          <Avatar 
            icon={<UserOutlined />}
            src={!post.isAnonymous ? post.author?.userProfile?.avatar : null}
            size={48} 
          />
          <div>
            <Space>
              <Text strong>
                {post.isAnonymous 
                  ? "Anonymous" 
                  : (post.author?.userProfile?.fullName || post.author?.usernameField || 'Unknown User')}
              </Text>
              {post.author?.enabled && !post.isAnonymous && (
                <Tooltip title="Verified User">
                  <Tag color="blue">✓</Tag>
                </Tooltip>
              )}
              <Text type="secondary">
                {post.createdAt ? new Date(post.createdAt).toLocaleString() : ''}
              </Text>
            </Space>
            <Title level={3}>{post.title}</Title>
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
          </div>
        
        </Space>
        {renderChart()}
      </div>
    

      {/* Comment Form */}
      <Form form={commentForm} onFinish={handleSubmitComment}>
        <Form.Item name="comment" rules={[{ required: true, message: 'Please write your comment' }]}>
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
              avatar={
                <Avatar 
                  icon={<UserOutlined />}
                  src={!comment.isAnonymous ? comment.author?.userProfile?.avatar : null}
                />
              }
              title={
                <Space>
                  <Text strong>
                    {comment.isAnonymous 
                      ? "Anonymous" 
                      : (comment.author?.userProfile?.fullName || comment.author?.usernameField || 'Unknown User')}
                  </Text>
                  {comment.author?.enabled && !comment.isAnonymous && (
                    <Tooltip title="Verified User">
                      <Tag color="blue">✓</Tag>
                    </Tooltip>
                  )}
                  <Text type="secondary">
                    {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ''}
                  </Text>
                </Space>
              }
              description={
                <div>
                  <Text>{comment.content}</Text>
                  {comment.mediaFiles && comment.mediaFiles.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      {comment.mediaFiles.map((mediaUrl, index) => (
                        <img 
                          key={index}
                          src={mediaUrl}
                          alt={`Comment media ${index + 1}`}
                          style={{ maxWidth: 150, marginRight: 8, marginBottom: 8 }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
}

export default Post;