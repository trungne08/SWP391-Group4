import React, { useState } from 'react';
import { Typography, Button, Avatar, List, Space, Modal, Form, Input, Radio, Upload } from 'antd';
import { UserOutlined,  PictureOutlined } from '@ant-design/icons';

const { Title, Text, TextArea } = Typography;

function Comunity() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [postType, setPostType] = useState('question');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [form] = Form.useForm();

  const quotes = [
    { id: 1, author: "Tim", content: "Quote content here" },
    { id: 2, author: "Tim", content: "Quote content here" },
    { id: 3, author: "Tim", content: "Quote content here" },
    { id: 4, author: "Tim", content: "Quote content here" },
    { id: 5, author: "Tim", content: "Quote content here" },
    { id: 6, author: "Tim", content: "Quote content here" },
  ];

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