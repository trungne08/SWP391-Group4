import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function ChangePassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await api.auth.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword
      });
      message.success('Đổi mật khẩu thành công');
      navigate(-1);
    } catch (error) {
      message.error(error.message || 'Đổi mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '40px auto', 
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Đổi Mật Khẩu</h2>
      <Form
        name="changePassword"
        onFinish={onFinish}
        layout="vertical"
        style={{ width: '100%' }}
      >
        <Form.Item
          label="Mật Khẩu Hiện Tại"
          name="currentPassword"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Mật Khẩu Mới"
          name="newPassword"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Xác Nhận Mật Khẩu Mới"
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <div style={{ 
            width: '100%',
            display: 'flex', 
            justifyContent: 'center', 
            gap: '12px',
            marginTop: '12px'
          }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Đổi Mật Khẩu
            </Button>
            <Button onClick={() => navigate(-1)}>
              Hủy
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ChangePassword;