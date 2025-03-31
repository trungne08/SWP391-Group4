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

  const handleUpdateReminder = async (updatedData) => {
    if (!selectedReminder?.id) return;
    try {
      const reminderData = {
        userId,
        pregnancyId,
        type: selectedReminder.type,
        reminderDate: selectedReminder.date.format('YYYY-MM-DD'),
        status: selectedReminder.status,
        tasks: []
      };
  
      if (selectedReminder.type === 'MEDICAL_TASK' && selectedReminder.tasks[0]) {
        reminderData.tasks = [{
          ...selectedReminder.tasks[0],
          ...updatedData
        }];
      }
  
      await api.reminders.updateReminder(selectedReminder.id, reminderData);
      await fetchReminders();
      message.success('Cập nhật nhắc nhở thành công');
    } catch (error) {
      console.error('Failed to update reminder:', error);
      message.error('Không thể cập nhật nhắc nhở');
    }
  };
  const handleReminderClick = (reminder) => {
    setSelectedReminder(reminder);
  };

  const handleModalClose = () => {
    setSelectedReminder(null);
    fetchReminders(); // Add this line to refresh the data when modal closes
  };

  const taskTypes = [
    { value: 'CHECK_UP', label: 'Khám định kỳ' },
    { value: 'VACCINATION', label: 'Tiêm phòng' },
    { value: 'TEST', label: 'Xét nghiệm' }
  ];

  const handleToggleComplete = (id) => {
    setReminders(reminders.map(reminder =>
      reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
    ));
  };

  const reminderTypes = [
    { value: 'APPOINTMENT', label: 'Lịch hẹn khám thai', icon: <MedicineBoxOutlined /> },
    { value: 'MEDICAL_TASK', label: 'Nhiệm vụ y tế', icon: <MedicineBoxOutlined /> },
    { value: 'HEALTH_ALERT', label: 'Cảnh báo sức khỏe thai nhi', icon: <FileSearchOutlined /> }
  ];

  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    setSelectedType(reminder.type);
    
    const formData = {
      type: reminder.type,
      date: reminder.date && dayjs(reminder.date),
    };

    if (reminder.type === 'MEDICAL_TASK' && reminder.tasks[0]) {
      const task = reminder.tasks[0];
      formData.week = task.week;
      formData.taskType = task.taskType;
      formData.title = task.taskName;  // Changed back to title to match form field name
      formData.description = task.notes;
    } else if (reminder.type === 'APPOINTMENT') {
      formData.title = reminder.title;
    }

    console.log('Setting form data:', formData);
    form.setFieldsValue(formData);
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
        title: reminder.type === 'MEDICAL_TASK' && reminder.tasks[0] 
          ? reminder.tasks[0].taskName 
          : reminder.type === 'HEALTH_ALERT' && reminder.healthAlerts[0]
          ? `Cảnh báo: ${
              reminder.healthAlerts[0].healthType === 'LOW_HEIGHT' ? 'Chiều cao thai nhi thấp' :
              reminder.healthAlerts[0].healthType === 'HIGH_HEIGHT' ? 'Chiều cao thai nhi cao' :
              reminder.healthAlerts[0].healthType
            }`
          : reminderTypes.find(t => t.value === reminder.type)?.label || reminder.type,
        date: dayjs(reminder.reminderDate),
        status: reminder.status,
        createdAt: dayjs(reminder.createdAt),
        pregnancyId: reminder.pregnancyId,
        tasks: reminder.tasks || [],
        healthAlerts: reminder.healthAlerts || []
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
        status: editingReminder?.status || 'NOT_YET',
        tasks: []
      };

      if (values.type === 'MEDICAL_TASK' && values.taskType) {
        reminderData.tasks = [{
          week: values.week || 12,
          taskType: values.taskType,
          taskName: values.title || values.taskType,
          notes: values.description || '',
          status: editingReminder?.tasks[0]?.status || 'NOT_YET'
        }];
      }

      if (editingReminder) {
        await api.reminders.updateReminder(editingReminder.id, reminderData);
        message.success('Cập nhật nhắc nhở thành công');
      } else {
        await api.reminders.createReminder(reminderData);
        message.success('Tạo nhắc nhở thành công');
      }

      form.resetFields();
      setEditingReminder(null);
      setSelectedType(null);
      await fetchReminders();
    } catch (error) {
      console.error('Failed to save reminder:', error);
      message.error('Không thể lưu nhắc nhở. Vui lòng thử lại.');
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
  // Add this before the return statement
  const today = dayjs();
  const sortedReminders = [...reminders].sort((a, b) => {
    // First, sort by status (NOT_YET first)
    if (a.status === 'NOT_YET' && b.status !== 'NOT_YET') return -1;
    if (a.status !== 'NOT_YET' && b.status === 'NOT_YET') return 1;
    
    // Then sort by date chronologically
    if (a.status === b.status) {
      return dayjs(a.date).valueOf() - dayjs(b.date).valueOf();
    }
    
    // Finally sort SKIP before DONE
    return a.status === 'SKIP' ? -1 : 1;
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Lịch nhắc nhở</h1>
      
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
            dataSource={sortedReminders}
            renderItem={item => (
              <List.Item
                onClick={() => handleReminderClick(item)}
                style={{ cursor: 'pointer' }}
                actions={[
                  <Button 
                    type="text" 
                    icon={<EditOutlined />} 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent modal from opening
                      handleEdit(item);
                    }}
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
                  avatar={
                    item.type === 'HEALTH_ALERT' ? <FileSearchOutlined /> :
                    reminderTypes.find(type => type.value === item.type)?.icon
                  }
                  title={
                    <span style={{ 
                      textDecoration: (item.status === 'DONE' || item.status === 'SKIP') ? 'line-through' : 'none',
                      color: (item.status === 'DONE' || item.status === 'SKIP') ? '#999' : 'inherit'
                    }}>
                      {item.title}
                    </span>
                  }
                  description={
                    <div>
                      <div>Ngày: {item.date?.format('DD/MM/YYYY')}</div>
                      <div>Trạng thái: {
                        item.status === 'NOT_YET' ? 'Chưa hoàn thành' :
                        item.status === 'DONE' ? 'Hoàn thành' :
                        item.status === 'SKIP' ? 'Bỏ qua' : 'Không xác định'
                      }</div>
                    </div>
                  }
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
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Select
              value={selectedReminder?.tempStatus || selectedReminder?.status || 'NOT_YET'}
              style={{ width: 120 }}
              onChange={(value) => {
                setSelectedReminder({ ...selectedReminder, tempStatus: value });
              }}
            >
              <Option value="NOT_YET">Chưa hoàn thành</Option>
              <Option value="DONE">Hoàn thành</Option>
              <Option value="SKIP">Bỏ qua</Option>
            </Select>
            <Button 
              type="primary"
              onClick={async () => {
                if (!selectedReminder?.id || !selectedReminder?.tempStatus) return;
                try {
                  await api.reminders.updateReminderStatus(selectedReminder.id, {
                    status: selectedReminder.tempStatus
                  });
                  
                  await fetchReminders();
                  const updatedReminder = reminders.find(r => r.id === selectedReminder.id);
                  setSelectedReminder({
                    ...updatedReminder,
                    status: selectedReminder.tempStatus,
                    tempStatus: selectedReminder.tempStatus
                  });
                  
                  message.success('Cập nhật trạng thái thành công');
                } catch (error) {
                  console.error('Failed to update status:', error);
                  message.error('Không thể cập nhật trạng thái');
                }
              }}
            >
              Xác nhận
            </Button>
            <Button onClick={handleModalClose}>Đóng</Button>
          </div>
        }
        width={600}
      >
        {selectedReminder && (
          <div>
            <h2>{selectedReminder.title}</h2>
            <div style={{ marginBottom: '16px' }}>
              <p><strong>Loại nhắc nhở:</strong> {reminderTypes.find(t => t.value === selectedReminder.type)?.label}</p>
              <p><strong>Ngày:</strong> {selectedReminder.date?.format('DD/MM/YYYY')}</p>
              <p><strong>Trạng thái:</strong> {
                selectedReminder.status === 'NOT_YET' ? 'Chưa hoàn thành' :
                selectedReminder.status === 'DONE' ? 'Hoàn thành' :
                selectedReminder.status === 'SKIP' ? 'Bỏ qua' : 'Không xác định'
              }</p>
              
              {selectedReminder.type === 'MEDICAL_TASK' && selectedReminder.tasks && selectedReminder.tasks.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <h3>Thông tin nhiệm vụ</h3>
                  <p><strong>Tuần thai:</strong> {selectedReminder.tasks[0].week}</p>
                  <p><strong>Loại nhiệm vụ:</strong> {taskTypes.find(t => t.value === selectedReminder.tasks[0].taskType)?.label}</p>
                  <p><strong>Tiêu đề:</strong> {selectedReminder.tasks[0].taskName}</p>
                  <p><strong>Mô tả:</strong> {selectedReminder.tasks[0].notes || 'Không có mô tả'}</p>
                </div>
              )}

              {selectedReminder.type === 'HEALTH_ALERT' && selectedReminder.healthAlerts && selectedReminder.healthAlerts.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <h3>Thông tin cảnh báo</h3>
                  <p><strong>Loại cảnh báo:</strong> {
                    selectedReminder.healthAlerts[0].healthType === 'LOW_HEIGHT' ? 'Chiều cao thai nhi thấp' : 
                    selectedReminder.healthAlerts[0].healthType === 'HIGH_HEIGHT' ? 'Chiều cao thai nhi cao' :
                    selectedReminder.healthAlerts[0].healthType
                  }</p>
                  <p><strong>Mức độ:</strong> {
                    selectedReminder.healthAlerts[0].severity === 'MEDIUM' ? 'Trung bình' :
                    selectedReminder.healthAlerts[0].severity === 'HIGH' ? 'Cao' : 'Thấp'
                  }</p>
                  <p><strong>Nguồn:</strong> {
                    selectedReminder.healthAlerts[0].source === 'PREGNANCY_RECORDS' ? 'Hồ sơ thai kỳ' :
                    selectedReminder.healthAlerts[0].source
                  }</p>
                  <p><strong>Ghi chú:</strong> {selectedReminder.healthAlerts[0].notes || 'Không có ghi chú'}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Reminder;

// Add this function near other handler functions
