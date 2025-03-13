import React, { useState, useEffect } from 'react';
import { Calendar, Form, Input, Select, Button, TimePicker, DatePicker, Card, List, Space, Badge, Checkbox, message } from 'antd';
import { ClockCircleOutlined, MedicineBoxOutlined, FileSearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
// Remove one of these duplicate imports
import api from '../services/api';

const { Option } = Select;

const Reminder = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [pregnancyId, setPregnancyId] = useState(null);
  const [form] = Form.useForm();
  const [editingReminder, setEditingReminder] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const taskTypes = [
    { value: 'CHECK_UP', label: 'Khám định kỳ (CHECK_UP)' },
    { value: 'VACCINATION', label: 'Tiêm phòng (VACCINATION)' },
    { value: 'TEST', label: 'Xét nghiệm (TEST)' }
  ];

  const handleToggleComplete = (id) => {
    setReminders(reminders.map(reminder =>
      reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
    ));
  };

  const reminderTypes = [
    { value: 'APPOINTMENT', label: 'Lịch hẹn khám thai (APPOINTMENT)', icon: <MedicineBoxOutlined /> },
    { value: 'MEDICAL_TASK', label: 'Nhiệm vụ y tế (MEDICAL_TASK)', icon: <MedicineBoxOutlined /> }
  ];

  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    form.setFieldsValue({
      ...reminder,
      date: reminder.date && dayjs(reminder.date),
      time: reminder.time && dayjs(reminder.time)
    });
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        const userData = await api.user.getProfile();
        if (!userData?.id) {
          message.error('User ID not found in response');
          return;
        }

        setUserId(userData.id);

        try {
          const pregnancyData = await api.pregnancy.getCurrentPregnancy();
          if (pregnancyData?.pregnancyId) {  // Changed from id to pregnancyId
            setPregnancyId(pregnancyData.pregnancyId);  // Use pregnancyId directly
          } else {
            message.warning('No active pregnancy found');
          }
        } catch (pregnancyError) {
          console.error('Pregnancy fetch error:', pregnancyError);
          message.warning('Unable to fetch pregnancy data');
        }

      } catch (error) {
        console.error('API Error Details:', error);
        message.error('Failed to load user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Separate useEffect for fetching reminders
  useEffect(() => {
    if (userId && pregnancyId) {
      fetchReminders();
    }
  }, [userId, pregnancyId]);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const response = await api.reminders.getAllReminders();
      const formattedReminders = response.map(reminder => ({
        id: reminder.reminderId,
        type: reminder.type,
        // Use the type from API for the title
        title: reminderTypes.find(t => t.value === reminder.type)?.label || reminder.type,
        date: dayjs(reminder.reminderDate),
        completed: reminder.status === 'COMPLETED',
        createdAt: dayjs(reminder.createdAt),
        pregnancyId: reminder.pregnancyId,
        // Add tasks if they exist
        tasks: reminder.tasks || []
      }));
      setReminders(formattedReminders);
    } catch (error) {
      console.error('Failed to fetch reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      if (!userId || !pregnancyId) {
        message.error('User ID or Pregnancy ID not available');
        return;
      }

      const reminderData = {
        userId: userId,
        pregnancyId: pregnancyId,
        type: values.type,
        reminderDate: values.date.format('YYYY-MM-DD'),
        reminderTime: values.time.format('HH:mm'),
        status: 'PENDING',
        tasks: []
      };

      if (values.type === 'MEDICAL_TASK' && values.taskType) {
        reminderData.tasks = [{
          taskType: values.taskType,
          taskName: values.title || values.taskType,
          notes: values.description || '',
          status: 'PENDING'
        }];
      }

      if (editingReminder) {
        await api.reminders.updateReminder(editingReminder.id, reminderData);
        message.success('Reminder updated successfully');
      } else {
        await api.reminders.createReminder(reminderData);
        message.success('Reminder created successfully');
      }

      form.resetFields();
      setEditingReminder(null);
      setSelectedType(null);
      await fetchReminders();
    } catch (error) {
      console.error('Failed to save reminder:', error);
      message.error('Failed to save reminder. Please try again.');
    }
  };



  const handleDelete = async (id) => {
    try {
      await api.reminders.deleteReminder(id);
      await fetchReminders(); // Now fetchReminders is accessible
    } catch (error) {
      console.error('Failed to delete reminder:', error);
    }
  };
  
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
                reminder.type === 'MEDICAL_TASK' ? 'warning' : 'default'
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
                <Select 
                  placeholder="Chọn loại nhắc nhở"
                  onChange={(value) => setSelectedType(value)}
                >
                  {reminderTypes.map(type => (
                    <Option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {selectedType === 'MEDICAL_TASK' && (
                <>
                  <Form.Item name="taskType" label="Loại nhiệm vụ" rules={[{ required: true }]}>
                    <Select placeholder="Chọn loại nhiệm vụ">
                      {taskTypes.map(type => (
                        <Option key={type.value} value={type.value}>
                          {type.label}
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
                </>
              )}
              <Form.Item name="date" label="Ngày" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày" />
              </Form.Item>

              <Form.Item name="time" label="Thời gian" rules={[{ required: true }]}>
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
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
                    onClick={() => handleDelete(item.id)}
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