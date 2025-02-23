import React from "react";
import { Typography, Row, Col, Card, Button } from "antd";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const HomePage = () => {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      {/* Hero Section */}
      <div
        style={{
          position: "relative",
          height: "500px",
          marginBottom: "40px",
          backgroundImage: "url('/img3.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "top center",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.3)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            zIndex: 1,
            width: "100%",
            padding: "0 20px",
          }}
        >
          <Title
            level={1}
            style={{
              color: "#333",
              marginBottom: "16px",
              fontSize: "48px",
              fontWeight: "600",
            }}
          >
            BabyCare Center
          </Title>
          <Text
            style={{
              fontSize: "24px",
              color: "#666",
              display: "block",
              margin: "0 auto",
              maxWidth: "600px",
            }}
          >
            Pregnancy Growth Tracking System
          </Text>
        </div>
      </div>
      {/* Featured Images Grid */}
      <Row gutter={[16, 16]} style={{ marginBottom: "40px" }}>
        <Col xs={24} md={12}>
          <div
            style={{
              height: "300px",
              backgroundImage: "url('/img4.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "8px",
              backgroundColor: "#faf9f9",
            }}
          />
        </Col>
        <Col xs={24} md={12}>
          <div
            style={{
              height: "300px",
              backgroundImage: "url('/img5.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "8px",
            }}
          />
        </Col>
      </Row>
      {/* Main Content Section */}
      <div style={{ marginBottom: "40px" }}>
        <Title level={2} style={{ marginBottom: "8px" }}>
          Heading
        </Title>
        <Text
          type="secondary"
          style={{ display: "block", marginBottom: "24px" }}
        >
          Sub Heading
        </Text>

        {/* Content Cards */}
        {[1, 2, 3].map((item) => (
          <Card
            key={item}
            style={{ marginBottom: "16px", borderRadius: "8px" }}
          >
            <Title level={4}>Title</Title>
            <Text style={{ display: "block", marginBottom: "16px" }}>
              Body text for whatever you'd like to say. Add high relevancy
              points, quotes, examples, or even a very nice story here.
            </Text>
            <Button>Button</Button>
          </Card>
        ))}
      </div>

      {/* Grid Section */}
      <Row gutter={[16, 16]}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Col xs={24} sm={12} md={8} key={item}>
            <Card
              style={{ marginBottom: "16px" }}
              cover={
                <div
                  style={{
                    height: "160px",
                    background: "#f5f5f5",
                    borderRadius: "8px 8px 0 0",
                  }}
                />
              }
            >
              <Title level={5}>Title</Title>
              <Text>
                Body text for whatever you'd like to say. Add high relevancy
                points, quotes, examples, or even a very nice story here.
              </Text>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HomePage;
