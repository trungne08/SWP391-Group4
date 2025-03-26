import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Avatar,
  List,
  Space,
  Modal,
  Form,
  Input,
  Radio,
  Upload,
  Tag,
  Tooltip,
  message,
  Checkbox,
  Spin,
  Alert,
} from "antd";
import {
  UserOutlined,
  PictureOutlined,
  CommentOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import api from "../services/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

const { Title, Text } = Typography;

function Comunity() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [postType, setPostType] = useState("question");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [isQuestionModalVisible, setIsQuestionModalVisible] = useState(false);
  const [isChartModalVisible, setIsChartModalVisible] = useState(false);
  const [chartData, setChartData] = useState({});
  const [chartLoading, setChartLoading] = useState({});
  const [pregnancyData, setPregnancyData] = useState(null); // Thêm state cho pregnancyData
  
  const handlePostClick = async (postId) => {
    try {
      const post = await api.community.getPostById(postId);
      if (post?.postType === 'GROWTH_CHART') {
        // Refresh chart data when clicking on a chart post
        await refreshChartData(postId);
      } else {
        navigate(`/comunity/post/${postId}`);
      }
    } catch (error) {
      console.error("Error handling post click:", error);
      message.error("Không thể tải thông tin bài viết");
    }
  };

  const handleAddImageUrl = () => {
    const input = form.getFieldValue("mediaUrls");
    if (input && input.trim()) {
      setImageUrls((prev) => [...prev, input.trim()]);
      form.setFieldValue("mediaUrls", "");
    }
  };

  const showPostModal = (type) => {
    setPostType(type);
    if (type === "question") {
      setIsQuestionModalVisible(true);
    } else {
      setIsChartModalVisible(true);
    }
  };

  const handleUpload = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  useEffect(() => {
    const checkAdminRole = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const tokenData = JSON.parse(atob(token.split(".")[1]));
          const userRole = tokenData.role || tokenData.authorities?.[0]?.authority;
          setIsAdmin(userRole === "ADMIN" || userRole === "ROLE_ADMIN");
        } catch (error) {
          console.error("Error checking admin role:", error);
          setIsAdmin(false);
        }
      }
    };

    checkAdminRole();
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.community.getAllPosts();

      const sortedPosts = response.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      const chartDataFormatted = {};
      sortedPosts.forEach((post) => {
        if (post.postType === "GROWTH_CHART" && post.chartData) {
          chartDataFormatted[post.postId] = {
            chartData: {
              headCircumference: post.chartData.headCircumference?.map(([week, value]) => ({ week, value })) || [],
              fetalWeight: post.chartData.fetalWeight?.map(([week, value]) => ({ week, value })) || [],
              femurLength: post.chartData.femurLength?.map(([week, value]) => ({ week, value })) || [],
              weightPrediction: post.chartData.predictionLine?.weightPrediction?.map(([week, value]) => ({ week, value })) || [],
              headPrediction: post.chartData.predictionLine?.headPrediction?.map(([week, value]) => ({ week, value })) || [],
              lengthPrediction: post.chartData.predictionLine?.lengthPrediction?.map(([week, value]) => ({ week, value })) || [],
            },
          };
        }
      });

      setChartData(chartDataFormatted);
      setPosts(sortedPosts);
    } catch (error) {
      message.error("Failed to fetch posts");
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshChartData = async (postId) => {
    try {
      setChartLoading((prev) => ({ ...prev, [postId]: true }));
      const data = await api.growth.getGrowthChart(postId);

      if (!data?.chartData) {
        message.error("No chart data available");
        return;
      }

      const formattedData = {
        chartData: {
          headCircumference: data.chartData.headCircumference?.map(([week, value]) => ({ week, value })) || [],
          fetalWeight: data.chartData.fetalWeight?.map(([week, value]) => ({ week, value })) || [],
          femurLength: data.chartData.femurLength?.map(([week, value]) => ({ week, value })) || [],
          weightPrediction: data.chartData.predictionLine?.weightPrediction?.map(([week, value]) => ({ week, value })) || [],
          headPrediction: data.chartData.predictionLine?.headPrediction?.map(([week, value]) => ({ week, value })) || [],
          lengthPrediction: data.chartData.predictionLine?.lengthPrediction?.map(([week, value]) => ({ week, value })) || [],
        },
      };

      setChartData((prevData) => ({
        ...prevData,
        [postId]: formattedData,
      }));
    } catch (error) {
      console.error("Error refreshing chart data:", error);
      message.error("Failed to refresh chart data");
    } finally {
      setChartLoading((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (postType === "chart") {
        if (!pregnancyData || !pregnancyData.fetuses || pregnancyData.fetuses.length === 0) {
          message.error("No pregnancy data found. Please create a pregnancy first.");
          return;
        }

        const fetusId = pregnancyData.fetuses[0].fetusId;

        const chartKeys = {
          HEAD_CIRCUMFERENCE: "headCircumference",
          WEIGHT: "fetalWeight",
          LENGTH: "femurLength",
        };

        const predictionKeys = {
          WEIGHT: "weightPrediction",
          LENGTH: "lengthPrediction",
          HEAD_CIRCUMFERENCE: "headPrediction",
        };

        const chartData = {
          chartTypes: values.chartTypes || [],
          title: values.title,
          content: values.content,
          isAnonymous,
          type: "GROWTH_CHART",
          chartData: Object.keys(chartKeys).reduce((acc, key) => {
            acc[chartKeys[key]] = values.chartTypes.includes(key) ? [] : null;
            return acc;
          }, {}),
          predictionLine: Object.keys(predictionKeys).reduce((acc, key) => {
            acc[predictionKeys[key]] = values.chartTypes.includes(key) ? [] : null;
            return acc;
          }, {}),
        };

        await api.growth.shareChart(fetusId, chartData);
        message.success("Chart shared successfully");
      } else {
        const mediaUrls = [...(values.mediaUrls ? [values.mediaUrls] : []), ...imageUrls].filter(url => url?.trim());
        const postData = {
          title: values.title,
          content: values.content,
          mediaUrls,
          isAnonymous,
        };

        await api.community.createPost(postData);
        message.success("Post created successfully");
      }

      await Promise.all([
        form.resetFields(),
        setIsModalVisible(false),
        setIsChartModalVisible(false),
        setImageUrls([]),
        fetchPosts(),
      ]);
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      message.error(postType === "chart" ? "Failed to share chart" : "Failed to create post");
    }
  };

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ id: null, type: null });

  const handleDeletePost = (postId, e) => {
    e.stopPropagation();
    setDeleteTarget({ id: postId, type: "post" });
    setDeleteModalVisible(true);
  };

  const handleDeleteComment = (commentId, e) => {
    e.stopPropagation();
    setDeleteTarget({ id: commentId, type: "comment" });
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (deleteTarget.type === "post") {
        await api.community.deletePost(deleteTarget.id);
        message.success("Post deleted successfully");
      } else {
        await api.community.deleteComment(deleteTarget.id);
        message.success("Comment deleted successfully");
      }
      setDeleteModalVisible(false);
      fetchPosts();
    } catch (error) {
      message.error(`Failed to delete ${deleteTarget.type}`);
      console.error(`Error deleting ${deleteTarget.type}:`, error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchPregnancyData = async () => {
      try {
        const data = await api.pregnancy.getOngoingPregnancy();
        if (isMounted) {
          setPregnancyData(data);
        }
      } catch (error) {
        console.error("Error fetching pregnancy data:", error);
        message.error("Failed to load pregnancy data");
      }
    };

    fetchPregnancyData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      {/* Header Section */}
      <div style={{ position: "relative", height: "400px", borderRadius: "8px", overflow: "hidden", marginBottom: "30px" }}>
        <div style={{ backgroundImage: "url('/img2.webp')", backgroundSize: "cover", backgroundPosition: "center", height: "100%", width: "100%", filter: "brightness(0.8)" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", color: "#fff", zIndex: 2 }}>
          <Title style={{ color: "#fff", marginBottom: "20px", fontSize: "48px" }}>Community</Title>
          <Text style={{ color: "#fff", fontSize: "24px" }}>52+ million users every month</Text>
        </div>
      </div>

      {/* Action Buttons */}
      <Space size="large" style={{ marginBottom: "30px" }}>
        <Button type="primary" size="large" onClick={() => showPostModal("question")}>Post question</Button>
        <Button size="large" onClick={() => showPostModal("chart")}>Post baby's chart</Button>
      </Space>

      {/* Question Modal */}
      <Modal title="Post a Question" open={isQuestionModalVisible} onCancel={() => setIsQuestionModalVisible(false)} footer={null} width={520}>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true, message: "Please input a title!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="content" label="Content" rules={[{ required: true, message: "Please input content!" }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="mediaUrls" label="Image URL">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Space>
                <Input placeholder="Enter image URL" />
                <Button onClick={handleAddImageUrl}>Add Image</Button>
              </Space>
              {imageUrls.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  {imageUrls.map((url, index) => (
                    <div key={index} style={{ marginBottom: 8, display: "flex", alignItems: "center" }}>
                      <img src={url} alt={`Preview ${index}`} style={{ maxWidth: 100, marginRight: 8 }} onError={(e) => { e.target.style.display = 'none'; }} />
                      <Button type="text" danger onClick={() => setImageUrls(prev => prev.filter((_, i) => i !== index))}>Remove</Button>
                    </div>
                  ))}
                </div>
              )}
            </Space>
          </Form.Item>
          <Form.Item label="Posting As">
            <Radio.Group value={isAnonymous} onChange={(e) => setIsAnonymous(e.target.value)}>
              <Radio value={false}>Public (Your name will be visible)</Radio>
              <Radio value={true}>Anonymous</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">Post</Button>
              <Button onClick={() => setIsQuestionModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Chart Modal */}
      <Modal title="Post Baby's Chart" open={isChartModalVisible} onCancel={() => setIsChartModalVisible(false)} footer={null} width={800}>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="chartTypes" label={<><span style={{ color: '#ff4d4f' }}>*</span>Chart Types</>} rules={[{ required: true, message: "Please select chart types!" }]}>
            <Checkbox.Group>
              <Space direction="vertical">
                <Checkbox value="WEIGHT">Weight Chart</Checkbox>
                <Checkbox value="HEAD_CIRCUMFERENCE">Head Circumference Chart</Checkbox>
                <Checkbox value="LENGTH">Length Chart</Checkbox>
              </Space>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item name="title" label={<><span style={{ color: '#ff4d4f' }}>*</span> Title</>} rules={[{ required: true, message: "Please input title!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="content" label="Description">
            <Input.TextArea rows={4} placeholder="Add any additional information about your baby's growth..." />
          </Form.Item>
          <Form.Item label="Posting As">
            <Radio.Group value={isAnonymous} onChange={(e) => setIsAnonymous(e.target.value)}>
              <Radio value={false}>Public (Your name will be visible)</Radio>
              <Radio value={true}>Anonymous</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">Post</Button>
              <Button onClick={() => setIsChartModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Post List */}
      <List
        loading={loading}
        itemLayout="vertical"
        dataSource={posts}
        renderItem={(post) => (
          <List.Item
            key={post.postId}
            onClick={() => handlePostClick(post.postId)}
            style={{ padding: "16px", background: "#fff", marginBottom: "12px", borderRadius: "8px", border: "1px solid #f0f0f0", cursor: "pointer", boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)" }}
          >
            <List.Item.Meta
              avatar={<Avatar size={40} icon={<UserOutlined />} src={!post.isAnonymous ? post.author?.userProfile?.avatar : null} />}
              title={
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Text strong style={{ fontSize: "15px" }}>
                    {post.isAnonymous ? "Anonymous" : post.author?.userProfile?.fullName || post.author?.usernameField || "Unknown User"}
                  </Text>
                  {post.author?.enabled && !post.isAnonymous && <Tag color="blue" style={{ margin: 0 }}>✓</Tag>}
                  <Text type="secondary" style={{ fontSize: "13px" }}>
                    {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
                  </Text>
                </div>
              }
            />
            <div style={{ marginTop: "12px" }}>
              <Title level={4} style={{ margin: "0 0 8px 0", fontSize: "18px" }}>{post.title}</Title>
              <Text style={{ fontSize: "15px", color: "#333" }}>{post.content}</Text>

              {post.postType === 'GROWTH_CHART' && (
                <div style={{ marginTop: "16px", padding: "12px", background: "#f5f5f5", borderRadius: "8px" }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <Text strong>Growth Charts:</Text>
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        refreshChartData(post.postId);
                      }}
                      loading={chartLoading[post.postId]}
                    >
                      Refresh
                    </Button>
                  </div>

                  {chartLoading[post.postId] ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <Spin size="large" />
                      <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>Loading chart data...</Text>
                    </div>
                  ) : chartData[post.postId] ? (
                    <>
                      {[
                        { key: "headCircumference", label: "Head Circumference", unit: "mm", color: "#8884d8" },
                        { key: "fetalWeight", label: "Fetal Weight", unit: "g", color: "#82ca9d" },
                        { key: "femurLength", label: "Femur Length", unit: "mm", color: "#ffc658" },
                      ].map(({ key, label, unit, color }) =>
                        chartData[post.postId].chartData[key]?.length > 0 && (
                          <div key={key} style={{ marginTop: "16px", height: "300px" }}>
                            <Text strong>{label} Chart</Text>
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={chartData[post.postId].chartData[key]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="week" label={{ value: 'Week', position: 'bottom' }} />
                                <YAxis dataKey="value" label={{ value: unit, angle: -90, position: 'insideLeft' }} />
                                <Tooltip formatter={(value) => `${value} ${unit}`} />
                                <Legend />
                                <Line type="monotone" dataKey="value" stroke={color} name={label} dot={{ r: 4 }} />
                                {chartData[post.postId].chartData[`${key === "fetalWeight" ? "weight" : key === "headCircumference" ? "head" : "length"}Prediction`]?.length > 0 && (
                                  <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke={`${color}80`}
                                    name={`${label} Prediction`}
                                    dot={false}
                                    data={chartData[post.postId].chartData[`${key === "fetalWeight" ? "weight" : key === "headCircumference" ? "head" : "length"}Prediction`]}
                                  />
                                )}
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        )
                      )}
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px', minHeight: '100px' }}>
                      <Text type="secondary">No chart data available</Text>
                    </div>
                  )}
                </div>
              )}

              {post.mediaFiles && post.mediaFiles.length > 0 && (
                <div style={{ marginTop: "12px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "8px" }}>
                  {post.mediaFiles.map((file, index) => (
                    <img key={file.mediaId} src={file.mediaUrl} alt={`Media ${index + 1}`} style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "4px" }} />
                  ))}
                </div>
              )}

              <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between" }}>
                <Space size="large">
                  <Button type="text" icon={<CommentOutlined />} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {post.comments?.length || 0} Comments
                  </Button>
                  {isAdmin && (
                    <Button danger type="text" onClick={(e) => handleDeletePost(post.postId, e)}>Delete Post</Button>
                  )}
                </Space>
              </div>

              {post.comments && post.comments.length > 0 && (
                <div style={{ marginTop: "12px", padding: "12px", background: "#f8f9fa", borderRadius: "4px" }}>
                  {post.comments.map((comment) => (
                    <div key={comment.commentId} style={{ display: "flex", gap: "12px", marginBottom: "8px", position: "relative" }}>
                      <Avatar size={32} icon={<UserOutlined />} src={!comment.isAnonymous ? comment.author?.userProfile?.avatar : null} />
                      <div style={{ flex: 1 }}>
                        <div style={{ background: "#fff", padding: "8px 12px", borderRadius: "16px", display: "inline-block" }}>
                          <Text strong style={{ fontSize: "14px", display: "block", marginBottom: "4px" }}>
                            {comment.isAnonymous ? "Anonymous" : comment.author?.userProfile?.fullName || comment.author?.usernameField || "Unknown User"}
                          </Text>
                          <div style={{ fontSize: "14px" }}>{comment.content}</div>
                        </div>
                        {isAdmin && (
                          <Button danger type="text" size="small" style={{ position: "absolute", right: 0, top: 0 }} onClick={(e) => handleDeleteComment(comment.commentId, e)}>
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </List.Item>
        )}
      />

      <Modal
        title="Delete Confirmation"
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setDeleteModalVisible(false)}>Cancel</Button>,
          <Button key="delete" type="primary" danger onClick={handleDeleteConfirm}>Delete</Button>,
        ]}
      >
        <p>Are you sure you want to delete this {deleteTarget.type}?</p>
        <p>This action cannot be undone.</p>
      </Modal>
    </div>
  );
}

export default Comunity;
