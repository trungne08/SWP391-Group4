import React, { useState, useEffect } from 'react';
import { Calendar, Form, Input, Select, Button, TimePicker, DatePicker, Card, List, Space, Badge, Checkbox } from 'antd';
import { ClockCircleOutlined, MedicineBoxOutlined, FileSearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../services/api';

const { Option } = Select;

const Reminder = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [editingReminder, setEditingReminder] = useState(null);

  const handleToggleComplete = (id) => {
    setReminders(reminders.map(reminder =>
      reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
    ));
  };

  const reminderTypes = [
    { value: 'APPOINTMENT', label: 'Lịch hẹn khám thai (APPOINTMENT)', icon: <MedicineBoxOutlined /> },
    { value: 'MEDICAL_TASK', label: 'Nhiệm vụ y tế (MEDICAL_TASK)', icon: <MedicineBoxOutlined /> },
    { value: 'HEALTH_ALERT', label: 'Cảnh báo sức khỏe (HEALTH_ALERT)', icon: <MedicineBoxOutlined /> }
  ];

  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    form.setFieldsValue({
      ...reminder,
      date: reminder.date && dayjs(reminder.date),
      time: reminder.time && dayjs(reminder.time)
    });
  };

  // Add useEffect to fetch reminders when component mounts
  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const response = await api.reminders.getAllReminders();
      const formattedReminders = response.map(reminder => ({
        id: reminder.reminderId,
        type: reminder.type.toLowerCase(),
        title: `Reminder ${reminder.reminderId}`,
        date: dayjs(reminder.reminderDate),
        completed: reminder.status === 'COMPLETED',
        createdAt: dayjs(reminder.createdAt),
        pregnancyId: reminder.pregnancyId
      }));
      setReminders(formattedReminders);
    } catch (error) {
      console.error('Failed to fetch reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update onFinish to use the API
  const onFinish = async (values) => {
    try {
      if (editingReminder) {
        // Update existing reminder logic will be added later
        const updatedReminders = reminders.map(item => 
          item.id === editingReminder.id ? { ...values, id: item.id, completed: item.completed } : item
        );
        setReminders(updatedReminders);
        setEditingReminder(null);
      } else {
        // Create new reminder logic will be added later
        const newReminder = {
          ...values,
          id: Date.now(),
          createdAt: new Date(),
          completed: false
        };
        setReminders([...reminders, newReminder]);
      }
      form.resetFields();
      await fetchReminders(); // Refresh the list after changes
    } catch (error) {
      console.error('Failed to save reminder:', error);
    }
  };

  // Update List component to show loading state
  <List
    loading={loading}
    dataSource={reminders}
    renderItem={item => (
      <List.Item
        actions={[
          <Checkbox
            checked={item.completed}
            onChange={() => handleToggleComplete(item.id)}
          >
            {item.completed ? 'Hoàn thành' : 'Chưa hoàn thành'}
          </Checkbox>,
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
          title={
            <span style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
              {item.title}
            </span>
          }
          description={
            <div>
              <div style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
                {item.description}
              </div>
              <div>Ngày: {item.date?.format('DD/MM/YYYY')}</div>
            </div>
          }
        />
        <div>{item.time?.format('HH:mm')}</div>
      </List.Item>
    )}
  />
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
                reminder.type === 'APPOINTMENT' ? 'processing' :
                reminder.type === 'MEDICAL_TASK' ? 'warning' :
                reminder.type === 'HEALTH_ALERT' ? 'error' : 'default'
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
                  <Checkbox
                    checked={item.completed}
                    onChange={() => handleToggleComplete(item.id)}
                  >
                    {item.completed ? 'Hoàn thành' : 'Chưa hoàn thành'}
                  </Checkbox>,
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
                  title={
                    <span style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
                      {item.title}
                    </span>
                  }
                  description={
                    <div>
                      <div style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
                        {item.description}
                      </div>
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