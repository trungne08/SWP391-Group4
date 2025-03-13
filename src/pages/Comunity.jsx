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
} from "antd";
import {
  UserOutlined,
  PictureOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import api from "../services/api";

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

  const handlePostClick = (postId) => {
    navigate(`/comunity/post/${postId}`);
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
    setIsModalVisible(true);
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
          // Sửa lại cách check role admin
          const userRole =
            tokenData.role || tokenData.authorities?.[0]?.authority;
          console.log("User role:", userRole); // Để debug
          setIsAdmin(userRole === "ADMIN" || userRole === "ROLE_ADMIN");
        } catch (error) {
          console.error("Error checking admin role:", error);
          setIsAdmin(false);
        }
      }
    };

    checkAdminRole();
    fetchPosts();
    console.log("Is admin:", isAdmin); // Kiểm tra trạng thái admin
  }, [isAdmin]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.community.getAllPosts();
      const sortedPosts = response.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPosts(sortedPosts);
    } catch (error) {
      message.error("Failed to fetch posts");
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (values) => {
    try {
      const postData = {
        title: values.title,
        content: values.content,

        mediaUrls: imageUrls, // Sử dụng mảng imageUrls
        isAnonymous: isAnonymous,
      };

      console.log("Submitting post data:", postData);
      await api.community.createPost(postData);
      message.success("Post created successfully");
      setIsModalVisible(false);
      form.resetFields();
      setImageUrls([]); // Reset image URLs
      fetchPosts();
    } catch (error) {
      message.error("Failed to create post");
      console.error("Error creating post:", error);
    }
  };

  // Add these states for delete confirmation
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ id: null, type: null });

  // Remove the old handleDeletePost and handleDeleteComment functions
  // Add these new versions
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

  // Cập nhật phần render form cho phần nhập URL ảnh
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      {/* Header Section */}
      <div
        style={{
          position: "relative",
          height: "400px",
          borderRadius: "8px",
          overflow: "hidden",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            backgroundImage: "url('/img2.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100%",
            width: "100%",
            filter: "brightness(0.8)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "#fff",
            zIndex: 2,
          }}
        >
          <Title
            style={{ color: "#fff", marginBottom: "20px", fontSize: "48px" }}
          >
            Community
          </Title>
          <Text style={{ color: "#fff", fontSize: "24px" }}>
            52+ million users every month
          </Text>
        </div>
      </div>

      {/* Action Buttons */}
      <Space size="large" style={{ marginBottom: "30px" }}>
        <Button
          type="primary"
          size="large"
          onClick={() => showPostModal("question")}
        >
          Post question
        </Button>
        <Button size="large" onClick={() => showPostModal("chart")}>
          Post baby's chart
        </Button>
      </Space>

      {/* Post Modal */}
      <Modal
        title={
          postType === "question" ? "Post a Question" : "Post Baby's Chart"
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={postType === "chart" ? 800 : 520}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          {postType === "chart" ? (
            <>
              <Form.Item
                name="babyName"
                label="Baby's Name"
                rules={[{ required: true, message: "Please input baby name!" }]}
              >
                <Input />
              </Form.Item>
              <Space
                size="large"
                style={{ display: "flex", marginBottom: "24px" }}
              >
                <Form.Item
                  name="age"
                  label="Age (months)"
                  rules={[{ required: true, message: "Please input age!" }]}
                >
                  <Input type="number" min={0} max={36} />
                </Form.Item>

                <Form.Item
                  name="weight"
                  label="Weight (kg)"
                  rules={[{ required: true, message: "Please input weight!" }]}
                >
                  <Input type="number" step="0.1" />
                </Form.Item>

                <Form.Item
                  name="height"
                  label="Height (cm)"
                  rules={[{ required: true, message: "Please input height!" }]}
                >
                  <Input type="number" step="0.1" />
                </Form.Item>
              </Space>

              <Form.Item name="description" label="Description">
                <Input.TextArea
                  rows={4}
                  placeholder="Add any additional information about your baby's growth..."
                />
                <div style={{ marginTop: "8px" }}>
                  <Space>
                    <Upload
                      listType="picture-card"
                      fileList={fileList}
                      onChange={handleUpload}
                      beforeUpload={() => false}
                      accept="image/*"
                      maxCount={4}
                    >
                      {fileList.length >= 4 ? null : (
                        <div style={{ padding: 4 }}>
                          <PictureOutlined
                            style={{ fontSize: 20, color: "#666" }}
                          />
                          <div
                            style={{
                              marginTop: 4,
                              fontSize: "12px",
                              color: "#666",
                            }}
                          >
                            Photo
                          </div>
                        </div>
                      )}
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
                rules={[{ required: true, message: "Please input a title!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="content"
                label="Content"
                rules={[{ required: true, message: "Please input content!" }]}
              >
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
                        <div
                          key={index}
                          style={{
                            marginBottom: 8,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={url}
                            alt={`Preview ${index}`}
                            style={{ maxWidth: 100, marginRight: 8 }}
                          />
                          <Button
                            type="text"
                            danger
                            onClick={() =>
                              setImageUrls((prev) =>
                                prev.filter((_, i) => i !== index)
                              )
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </Space>
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
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
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
          // Update List.Item rendering
          <List.Item
            key={post.postId}
            onClick={() => handlePostClick(post.postId)}
            style={{
              padding: "16px",
              background: "#fff",
              marginBottom: "12px",
              borderRadius: "8px",
              border: "1px solid #f0f0f0",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
            }}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  size={40}
                  icon={<UserOutlined />}
                  src={
                    !post.isAnonymous ? post.author?.userProfile?.avatar : null
                  }
                />
              }
              title={
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Text strong style={{ fontSize: "15px" }}>
                    {post.isAnonymous
                      ? "Anonymous"
                      : post.author?.userProfile?.fullName ||
                        post.author?.usernameField ||
                        "Unknown User"}
                  </Text>
                  {post.author?.enabled && !post.isAnonymous && (
                    <Tag color="blue" style={{ margin: 0 }}>
                      ✓
                    </Tag>
                  )}
                  <Text type="secondary" style={{ fontSize: "13px" }}>
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleString()
                      : ""}
                  </Text>
                </div>
              }
            />
            <div style={{ marginTop: "12px" }}>
              <Title
                level={4}
                style={{ margin: "0 0 8px 0", fontSize: "18px" }}
              >
                {post.title}
              </Title>
              <Text style={{ fontSize: "15px", color: "#333" }}>
                {post.content}
              </Text>

              {post.mediaFiles && post.mediaFiles.length > 0 && (
                <div
                  style={{
                    marginTop: "12px",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "8px",
                  }}
                >
                  {post.mediaFiles.map((file, index) => (
                    <img
                      key={file.mediaId}
                      src={file.mediaUrl}
                      alt={`Media ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  ))}
                </div>
              )}

              <div
                style={{
                  marginTop: "16px",
                  paddingTop: "12px",
                  borderTop: "1px solid #f0f0f0",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Space size="large">
                  <Button
                    type="text"
                    icon={<CommentOutlined />}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {post.comments?.length || 0} Comments
                  </Button>
                  {isAdmin && (
                    <Button
                      danger
                      type="text"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePost(post.postId, e);
                      }}
                    >
                      Delete Post
                    </Button>
                  )}
                </Space>
              </div>

              {/* Comments section */}
              {post.comments && post.comments.length > 0 && (
                <div
                  style={{
                    marginTop: "12px",
                    padding: "12px",
                    background: "#f8f9fa",
                    borderRadius: "4px",
                  }}
                >
                  {post.comments.map((comment) => (
                    <div
                      key={comment.commentId}
                      style={{
                        display: "flex",
                        gap: "12px",
                        marginBottom: "8px",
                        position: "relative",
                      }}
                    >
                      <Avatar
                        size={32}
                        icon={<UserOutlined />}
                        src={
                          !comment.isAnonymous
                            ? comment.author?.userProfile?.avatar
                            : null
                        }
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            background: "#fff",
                            padding: "8px 12px",
                            borderRadius: "16px",
                            display: "inline-block",
                          }}
                        >
                          <Text
                            strong
                            style={{
                              fontSize: "14px",
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            {comment.isAnonymous
                              ? "Anonymous"
                              : comment.author?.userProfile?.fullName ||
                                comment.author?.usernameField ||
                                "Unknown User"}
                          </Text>
                          <div style={{ fontSize: "14px" }}>
                            {comment.content}
                          </div>
                        </div>
                        {isAdmin && (
                          <Button
                            danger
                            type="text"
                            size="small"
                            style={{ position: "absolute", right: 0, top: 0 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteComment(comment.commentId, e);
                            }}
                          >
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

      {/* Add Delete Confirmation Modal */}
      <Modal
        title="Delete Confirmation"
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setDeleteModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="delete"
            type="primary"
            danger
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>,
        ]}
      >
        <p>Are you sure you want to delete this {deleteTarget.type}?</p>
        <p>This action cannot be undone.</p>
      </Modal>
    </div>
  );
}

export default Comunity;
