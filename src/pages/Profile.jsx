import React from "react";
import { Card, Avatar, Button, Descriptions, Divider } from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";

const Profile = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <Card style={{ width: 500, padding: "20px", borderRadius: "10px" }}>
        <div style={{ textAlign: "center" }}>
          <Avatar size={80} icon={<UserOutlined />} />
          <h2>Nguyễn Văn A</h2>
          <p>Email: nguyenvana@example.com</p>
          <p>Số điện thoại: 0123-456-789</p>
          <Button type="primary" icon={<EditOutlined />} style={{ marginBottom: "10px" }}>
            Chỉnh sửa thông tin
          </Button>
        </div>

        <Divider />

        <Descriptions title="Thông tin thai kỳ" column={1} bordered>
          <Descriptions.Item label="Tuần thai">28 tuần</Descriptions.Item>
          <Descriptions.Item label="Ngày dự sinh">15/05/2025</Descriptions.Item>
          <Descriptions.Item label="Cân nặng mẹ">60 kg</Descriptions.Item>
          <Descriptions.Item label="Cân nặng thai nhi">1.2 kg</Descriptions.Item>
          <Descriptions.Item label="Chiều dài thai nhi">38 cm</Descriptions.Item>
          <Descriptions.Item label="Lần khám thai gần nhất">20/02/2025</Descriptions.Item>
          <Descriptions.Item label="Lịch khám tiếp theo">05/03/2025</Descriptions.Item>
          <Descriptions.Item label="Ghi chú bác sĩ">Tình trạng ổn định, tiếp tục theo dõi chế độ dinh dưỡng.</Descriptions.Item>
        </Descriptions>

        <Divider />

        <Descriptions title="Thông tin sức khỏe mẹ bầu" column={1} bordered>
          <Descriptions.Item label="Huyết áp">110/70 mmHg</Descriptions.Item>
          <Descriptions.Item label="Đường huyết">5.2 mmol/L</Descriptions.Item>
          <Descriptions.Item label="Tiêm phòng uốn ván">Đã tiêm mũi 1</Descriptions.Item>
          <Descriptions.Item label="Bổ sung vitamin">Sắt, Canxi, DHA</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default Profile;
