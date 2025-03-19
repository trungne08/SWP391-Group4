import React, { useState, useEffect } from 'react';
// Import thêm Spin để hiển thị loading state
import { Typography, Button, Card, Avatar, Row, Pagination, message, Modal, Form, Input, Select, Spin } from 'antd';
import api from '../services/api';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const pageStyle = {
  animation: 'fadeIn 0.5s ease-in-out',
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "24px"
};

const cardStyle = {
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  border: 'none',
  marginBottom: '20px',
  ':hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  }
};

const buttonStyle = {
  borderRadius: '6px',
  fontWeight: 500,
  height: '38px',
  padding: '0 20px'
};

function AdminBlog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
      fetchBlogs();
    }, []); // Thêm useEffect để fetch blogs khi component mount
  
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await api.blog.getAllBlogs();
        console.log("Raw API response:", response);
        
        if (!response) {
          setBlogs([]);
          return;
        }
  
        const blogData = Array.isArray(response) ? response : [response];
        
        const formattedBlogs = blogData.map(blog => ({
          id: blog.id || blog.blogId,
          title: blog.title || '',
          content: blog.content || '',
          imageUrl: blog.images?.[0]?.imageUrl || '', // Lấy URL từ object trong mảng images
          author: blog.author || 'Anonymous',
          postedAt: blog.createdAt ? new Date(blog.createdAt).toLocaleString() : new Date().toLocaleString()
        }));
  
        setBlogs(formattedBlogs.reverse());
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setBlogs([]);
        message.error("Không thể tải danh sách blog");
      } finally {
        setLoading(false);
      }
    };

    const handleAddEdit = async (values) => {
      try {
        setLoading(true);
        const formData = {
          title: values.title,
          content: values.content,
          imageUrls: values.imageUrls ? [values.imageUrls] : [] // Sửa thành mảng string đơn giản
        };

        console.log("Submitting blog data:", formData);

        if (editingBlog) {
          await api.blog.updateBlog(editingBlog.id, formData);
        } else {
          await api.blog.createBlog(formData);
        }

        await fetchBlogs();
        setIsModalVisible(false);
        form.resetFields();
        setEditingBlog(null);
        message.success(editingBlog ? "Cập nhật blog thành công" : "Tạo blog mới thành công");
      } catch (error) {
        console.error("Blog operation error:", error);
        message.error("Có lỗi xảy ra: " + error.message);
      } finally {
        setLoading(false);
      }
    };

  const showModal = (blog = null) => {
    setEditingBlog(blog);
    if (blog) {
      form.setFieldsValue({
        title: blog.title,
        content: blog.content,
        imageUrls: blog.imageUrl || '' // Sửa tên field
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleDelete = async (blogId) => {
    try {
      await api.blog.deleteBlog(blogId);
      message.success("Xóa blog thành công");
      fetchBlogs();
    } catch (error) {
      console.error("Delete blog error:", error);
      message.error("Không thể xóa blog");
    }
  };

  return (
    <div style={pageStyle}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Title 
            level={2} 
            style={{
              color: '#1a3353',
              marginBottom: 0,
              position: 'relative',
              paddingBottom: '10px'
            }}
          >
            Quản Lý Blog
          </Title>
        <Button 
          type="primary" 
          onClick={() => showModal()}
          style={buttonStyle}
          icon={<PlusOutlined />}
        >
          Thêm Blog Mới
        </Button>
      </Row>

      <Spin spinning={loading}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {blogs.map((blog) => (
            <Card 
              key={blog.id} 
              style={cardStyle}
              hoverable
            >
              <div style={{ marginBottom: 16 }}>
                <Title 
                  level={4}
                  style={{ 
                    color: '#1a3353',
                    marginBottom: '8px'
                  }}
                >
                  {blog.title}
                </Title>
                <Text 
                  type="secondary"
                  style={{ 
                    display: 'block',
                    fontSize: '14px'
                  }}
                >
                  Đăng lúc: {blog.postedAt}
                </Text>
              </div>
              <div style={{ 
                marginBottom: 16,
                fontSize: '16px',
                lineHeight: '1.6',
                color: '#666'
              }}>
                <Text>{blog.content}</Text>
              </div>
              {blog.imageUrl && (
                <div style={{ 
                  marginBottom: 16,
                  width: '300px', // Fixed width
                  height: '200px', // Fixed height
                  overflow: 'hidden' // Hide overflow
                }}>
                  <img 
                    src={blog.imageUrl}
                    alt="Blog image"
                    style={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover', // This will ensure the image covers the container
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                </div>
              )}
              <div style={{ 
                display: 'flex',
                gap: '12px'
              }}>
                <Button 
                  type="primary" 
                  onClick={() => showModal(blog)}
                  style={buttonStyle}
                  icon={<EditOutlined />}
                >
                  Sửa
                </Button>
                <Button 
                  danger 
                  onClick={() => handleDelete(blog.id)}
                  style={buttonStyle}
                  icon={<DeleteOutlined />}
                >
                  Xóa
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Spin>

      <Modal
        title={
          <div style={{ 
            borderBottom: '2px solid #f0f0f0',
            paddingBottom: '16px',
            marginBottom: '24px',
            fontSize: '18px',
            fontWeight: 500
          }}>
            {editingBlog ? "Chỉnh Sửa Blog" : "Thêm Blog Mới"}
          </div>
        }
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingBlog(null);
          form.resetFields();
        }}
        confirmLoading={loading}
        width={600}
        style={{ top: 20 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddEdit}
          initialValues={{ imageUrl: '' }}
        >
          <Form.Item
            name="title"
            label={<span style={{ fontSize: '16px' }}>Tiêu đề</span>}
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          >
            <Input 
              style={{ 
                height: '40px',
                borderRadius: '6px',
                fontSize: '16px'
              }} 
            />
          </Form.Item>
          <Form.Item
            name="content"
            label={<span style={{ fontSize: '16px' }}>Nội dung</span>}
            rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
          >
            <TextArea 
              rows={6}
              style={{ 
                borderRadius: '6px',
                fontSize: '16px'
              }} 
            />
          </Form.Item>
          <Form.Item
            name="imageUrls"
            label={<span style={{ fontSize: '16px' }}>Đường dẫn hình ảnh</span>}
          >
            <Input 
              placeholder="Nhập đường dẫn hình ảnh"
              style={{ 
                height: '40px',
                borderRadius: '6px',
                fontSize: '16px'
              }} 
            />
          </Form.Item>
        </Form>
      </Modal>

      <Row justify="center" style={{ marginTop: 24 }}>
        <Pagination 
          current={currentPage}
          onChange={(page) => setCurrentPage(page)}
          total={blogs.length}
          pageSize={10}
          showSizeChanger={false}
          style={{
            padding: '12px',
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        />
      </Row>
    </div>
  );
}

export default AdminBlog;