import React, { useState } from 'react';
import { Calendar, Form, Input, Select, Button, TimePicker, Card, List } from 'antd';
import { ClockCircleOutlined, MedicineBoxOutlined, FileSearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const Reminder = () => {
  const [reminders, setReminders] = useState([]);

  const reminderTypes = [
    { value: 'pregnancy', label: 'Khám thai', icon: <MedicineBoxOutlined /> },
    { value: 'vaccination', label: 'Tiêm phòng', icon: <FileSearchOutlined /> },
    { value: 'personal', label: 'Nhắc nhở cá nhân', icon: <ClockCircleOutlined /> }
  ];

  const onFinish = (values) => {
    const newReminder = {
      ...values,
      id: Date.now(),
      createdAt: new Date()
    };
    setReminders([...reminders, newReminder]);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Tạo lịch nhắc nhở</h1>
      
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Calendar Section */}
        <div style={{ flex: 1 }}>
          <Calendar />
        </div>

        {/* Form Section */}
        <div style={{ flex: 1 }}>
          <Card title="Thêm nhắc nhở mới">
            <Form onFinish={onFinish} layout="vertical">
              <Form.Item name="type" label="Loại nhắc nhở" rules={[{ required: true }]}>
                <Select placeholder="Chọn loại nhắc nhở">
                  {reminderTypes.map(type => (
                    <Option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
                <Input placeholder="Nhập tiêu đề nhắc nhở" />
              </Form.Item>

              <Form.Item name="description" label="Mô tả">
                <Input.TextArea placeholder="Nhập mô tả chi tiết" />
              </Form.Item>

              <Form.Item name="time" label="Thời gian" rules={[{ required: true }]}>
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Tạo nhắc nhở
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>

      {/* Reminders List */}
      <div style={{ marginTop: '24px' }}>
        <Card title="Danh sách nhắc nhở">
          <List
            dataSource={reminders}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={reminderTypes.find(type => type.value === item.type)?.icon}
                  title={item.title}
                  description={item.description}
                />
                <div>{item.time?.format('HH:mm')}</div>
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  );
};

export default Reminder;