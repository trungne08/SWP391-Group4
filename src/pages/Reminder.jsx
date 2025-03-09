import React, { useState } from 'react';
import { Calendar, Form, Input, Select, Button, TimePicker, DatePicker, Card, List, Space, Badge } from 'antd';
import { ClockCircleOutlined, MedicineBoxOutlined, FileSearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

const Reminder = () => {
  const [reminders, setReminders] = useState([]);
  const [form] = Form.useForm();
  const [editingReminder, setEditingReminder] = useState(null);

  const reminderTypes = [
    { value: 'pregnancy', label: 'Khám thai', icon: <MedicineBoxOutlined /> },
    { value: 'vaccination', label: 'Tiêm phòng', icon: <FileSearchOutlined /> },
    { value: 'personal', label: 'Nhắc nhở cá nhân', icon: <ClockCircleOutlined /> }
  ];

  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    form.setFieldsValue({
      ...reminder,
      date: reminder.date && dayjs(reminder.date),
      time: reminder.time && dayjs(reminder.time)
    });
  };

  const onFinish = (values) => {
    if (editingReminder) {
      // Update existing reminder
      const updatedReminders = reminders.map(item => 
        item.id === editingReminder.id ? { ...values, id: item.id } : item
      );
      setReminders(updatedReminders);
      setEditingReminder(null);
    } else {
      // Create new reminder
      const newReminder = {
        ...values,
        id: Date.now(),
        createdAt: new Date()
      };
      setReminders([...reminders, newReminder]);
    }
    form.resetFields();
  };

  // Add this function to get reminders for a specific date
  const getRemindersForDate = (date) => {
    return reminders.filter(reminder => 
      dayjs(reminder.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
    );
  };

  // Add this function to customize calendar cell rendering
  const dateCellRender = (date) => {
    const dateReminders = getRemindersForDate(date);
    
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {dateReminders.map(reminder => (
          <li key={reminder.id}>
            <Badge 
              status={
                reminder.type === 'pregnancy' ? 'processing' :
                reminder.type === 'vaccination' ? 'warning' : 'success'
              } 
              text={
                <span style={{ fontSize: '11px' }}>
                  {reminder.time?.format('HH:mm')} - {reminder.title}
                </span>
              }
            />
          </li>
        ))}
      </ul>
    );
  };

  // Update the Calendar section in your JSX
  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Tạo lịch nhắc nhở</h1>
      
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Calendar Section */}
        <div style={{ flex: 1 }}>
          <Calendar 
            cellRender={dateCellRender}
            onSelect={(date) => {
              form.setFieldsValue({ date });
            }}
          />
        </div>

        {/* Form Section */}
        <div style={{ flex: 1 }}>
          <Card title={editingReminder ? "Chỉnh sửa nhắc nhở" : "Thêm nhắc nhở mới"}>
            <Form 
              form={form}
              onFinish={onFinish} 
              layout="vertical"
            >
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

              <Form.Item name="date" label="Ngày" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày" />
              </Form.Item>

              <Form.Item name="time" label="Thời gian" rules={[{ required: true }]}>
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item name="description" label="Mô tả">
                <Input.TextArea placeholder="Nhập mô tả chi tiết" />
              </Form.Item>

              <Form.Item>
                <Space style={{ width: '100%' }}>
                  <Button type="primary" htmlType="submit" block>
                    {editingReminder ? 'Cập nhật' : 'Tạo nhắc nhở'}
                  </Button>
                  {editingReminder && (
                    <Button 
                      onClick={() => {
                        setEditingReminder(null);
                        form.resetFields();
                      }} 
                      block
                    >
                      Hủy
                    </Button>
                  )}
                </Space>
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
              <List.Item
                actions={[
                  <Button 
                    type="text" 
                    icon={<EditOutlined />} 
                    onClick={() => handleEdit(item)}
                  >
                    Chỉnh sửa
                  </Button>,
                  <Button 
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={() => {
                      setReminders(reminders.filter(r => r.id !== item.id));
                    }}
                  >
                    Xóa
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={reminderTypes.find(type => type.value === item.type)?.icon}
                  title={item.title}
                  description={
                    <div>
                      <div>{item.description}</div>
                      <div>Ngày: {item.date?.format('DD/MM/YYYY')}</div>
                    </div>
                  }
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