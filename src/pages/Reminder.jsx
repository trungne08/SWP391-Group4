import React, { useState, useEffect } from 'react';
import { Calendar, Form, Input, Select, Button, TimePicker, DatePicker, Card, List, Space, Badge, Checkbox, message, Modal } from 'antd';
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
  const [selectedReminder, setSelectedReminder] = useState(null);  // Add this line

  // Add these functions
  const handleReminderClick = (reminder) => {
    setSelectedReminder(reminder);
  };

  const handleModalClose = () => {
    setSelectedReminder(null);
  };

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
        tasks: []
      };

      if (values.type === 'MEDICAL_TASK' && values.taskType) {
        reminderData.tasks = [{
          week: values.week || 12, // Add week field to your form if needed
          taskType: values.taskType,
          taskName: values.title || values.taskType,
          notes: values.description || ''
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



  const handleDelete = async (reminder) => {
    try {
      await api.reminders.deleteReminder(reminder.id);
      message.success('Xóa nhắc nhở thành công');
      await fetchReminders();
    } catch (error) {
      console.error('Failed to delete reminder:', error);
      message.error('Không thể xóa nhắc nhở. Vui lòng thử lại.');
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
                  <Form.Item name="week" label="Tuần thai" rules={[
                    { 
                      validator: async (_, value) => {
                        if (value && (value <= 0)) {
                          throw new Error('Tuần thai phải lớn hơn 0');
                        }
                      }
                    }
                  ]}>
                    <Input type="number" placeholder="Nhập tuần thai" />
                  </Form.Item>
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
                onClick={() => handleReminderClick(item)}
                style={{ cursor: 'pointer' }}
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
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent modal from opening
                      handleDelete(item);
                    }}
                  >
                    Xóa
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={reminderTypes.find(type => type.value === item.type)?.icon}
                  title={item.title}
                  description={`Ngày: ${item.date?.format('DD/MM/YYYY')}`}
                />
              </List.Item>
            )}
          />
        </Card>
      </div>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết nhắc nhở"
        open={selectedReminder !== null}
        onCancel={handleModalClose}
        footer={null}
        width={600}
      >
        {selectedReminder && (
          <div>
            <h2>{selectedReminder.title}</h2>
            <div style={{ marginBottom: '16px' }}>
              <p><strong>Loại nhắc nhở:</strong> {reminderTypes.find(t => t.value === selectedReminder.type)?.label}</p>
              <p><strong>Ngày:</strong> {selectedReminder.date?.format('DD/MM/YYYY')}</p>
              <p><strong>Trạng thái:</strong> {selectedReminder.completed ? 'Hoàn thành' : 'Chưa hoàn thành'}</p>
              
              {selectedReminder.type === 'MEDICAL_TASK' && selectedReminder.tasks && selectedReminder.tasks.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <h3>Thông tin nhiệm vụ</h3>
                  <p><strong>Tuần thai:</strong> {selectedReminder.tasks[0].week}</p>
                  <p><strong>Loại nhiệm vụ:</strong> {taskTypes.find(t => t.value === selectedReminder.tasks[0].taskType)?.label}</p>
                  <p><strong>Tiêu đề:</strong> {selectedReminder.tasks[0].taskName}</p>
                  <p><strong>Mô tả:</strong> {selectedReminder.tasks[0].notes || 'Không có mô tả'}</p>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button onClick={handleModalClose}>Đóng</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Reminder;