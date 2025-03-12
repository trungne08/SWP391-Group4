import React, { useState, useEffect } from 'react';
// Import thêm Spin để hiển thị loading state
import { Typography, Button, Card, Avatar, Row, Pagination, message, Modal, Form, Input, Select, Spin } from 'antd';
import api from '../services/api';

const { Title, Text } = Typography;
const { TextArea } = Input;

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
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Title level={2}>Blog Management</Title>
        <Button type="primary" onClick={() => showModal()}>Add Blog</Button>
      </Row>

      <Spin spinning={loading}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {blogs.map((blog) => (
            <Card key={blog.id} style={{ width: '100%' }}>
              <div style={{ marginBottom: 16 }}>
                <Title level={4}>{blog.title}</Title>
                <Text type="secondary">{blog.postedAt}</Text>
              </div>
              <div style={{ marginBottom: 16 }}>
                <Text>{blog.content}</Text>
              </div>
              {blog.imageUrl && (
                <div style={{ marginBottom: 16 }}>
                  <img 
                    src={blog.imageUrl}
                    alt="Blog image"
                    style={{ 
                      maxWidth: '300px',
                      height: 'auto',
                      marginBottom: 8,
                      objectFit: 'contain'
                    }}
                  />
                </div>
              )}
              <div>
                <Button type="primary" onClick={() => showModal(blog)} style={{ marginRight: 8 }}>
                  Edit
                </Button>
                <Button danger onClick={() => handleDelete(blog.id)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Spin>

      <Modal
        title={editingBlog ? "Edit Blog" : "Add New Blog"}
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingBlog(null);
          form.resetFields();
        }}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddEdit}
          initialValues={{ imageUrl: '' }}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input the title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: 'Please input the content!' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="imageUrls"
            label="Image URL"
          >
            <Input placeholder="Enter image URL" />
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
        />
      </Row>
    </div>
  );
}

export default AdminBlog;