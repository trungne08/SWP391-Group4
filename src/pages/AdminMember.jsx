import React, { useState } from 'react';
import { Typography, Button, Card, Avatar, Row, Col, Pagination } from 'antd';

const { Title, Text } = Typography;

function AdminMember() {
  const [currentPage, setCurrentPage] = useState(1);

  const members = [
    {
      id: 1,
      title: "John Smith",
      body: "Premium member since 2023. Active participant in pregnancy tracking program.",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=1"
    },
    {
      id: 2,
      title: "Sarah Johnson",
      body: "New member, joined our community last month. Expecting first child.",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2"
    },
    {
      id: 3,
      title: "Michael Brown",
      body: "Premium member, actively participating in parenting workshops.",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=3"
    },
    {
      id: 4,
      title: "Emma Davis",
      body: "Member since 2022. Regular contributor to community discussions.",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=4"
    },
    {
      id: 5,
      title: "James Wilson",
      body: "Premium member, frequently attends online seminars.",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=5"
    },
    {
      id: 6,
      title: "Lisa Anderson",
      body: "Active community member, shares valuable pregnancy tips.",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=6"
    },
    {
      id: 7,
      title: "Robert Taylor",
      body: "New premium member, expecting twins in 2024.",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=7"
    },
    {
      id: 8,
      title: "Emily White",
      body: "Regular member, actively participates in Q&A sessions.",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=8"
    },
    {
      id: 9,
      title: "David Miller",
      body: "Premium member since 2021, community moderator.",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=9"
    },
    {
      id: 10,
      title: "Jennifer Clark",
      body: "Active member in pregnancy nutrition programs.",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=10"
    }
  ];
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <Title level={2}>Admin Member</Title>
      
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>Member List</Title>
      </Row>

      {members.map((member) => (
        <Card key={member.id} style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <Avatar size={64} src={member.avatar} />
            <div style={{ flex: 1 }}>
              <Title level={5} style={{ marginTop: 0 }}>{member.title}</Title>
              <Text type="secondary">{member.body}</Text>
              <div style={{ marginTop: 16 }}>
                <Button size="small" style={{ marginRight: 8 }}>Edit</Button>
                <Button 
                  size="small" 
                  danger
                  type="primary"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}

      <Row justify="center" style={{ marginTop: 24 }}>
        <Pagination 
          current={currentPage}
          onChange={(page) => setCurrentPage(page)}
          total={100}
          showSizeChanger={false}
        />
      </Row>
    </div>
  );
}

export default AdminMember;
