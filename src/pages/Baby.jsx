import React from "react";
import { Avatar, Typography, Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWeightScale,
  faRuler,
  faCircleNotch,
  faNewspaper,
  faCalendarDays,
  faShoePrints,
  faChildDress,
  faChild,
} from "@fortawesome/free-solid-svg-icons";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
);

const { Title } = Typography;

function Baby() {
  // Dữ liệu biểu đồ
  const labels = Array.from({ length: 40 }, (_, i) => i + 1);

  const weightData = {
    labels: Array.from({ length: 33 }, (_, i) => i + 8), // Tuần 8 đến 40
    datasets: [
      {
        label: "Upper Limit (g)",
        data: [
          40, 40, 40, 100, 100, 100, 100, 100, 130, 170, 220, 270, 330, 390,
          460, 531, 630, 690, 790, 905, 1035, 1183, 1349, 1532, 1732, 1948,
          2176, 2413, 2652, 2889, 3113, 3318, 3492,
        ],
        borderColor: "red",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.3,
      },
      {
        label: "Lower Limit (g)",
        data: [
          0, 0, 0, 20, 20, 20, 20, 20, 40, 70, 110, 160, 210, 270, 330, 400,
          471, 570, 630, 730, 845, 975, 1123, 1279, 1472, 1688, 1916, 2153,
          2392, 2630, 2859, 3083, 3288,
        ],
        borderColor: "blue",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.3,
      },
      {
        label: "Standard (g)",
        data: [
          20, 20, 20, 60, 60, 60, 60, 60, 85, 120, 165, 215, 270, 330, 395, 466,
          550, 630, 710, 815, 940, 1079, 1236, 1405, 1602, 1818, 2046, 2283,
          2522, 2760, 2986, 3200, 3390,
        ],
        borderColor: "green",
        backgroundColor: "rgba(75, 192, 75, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const heightData = {
    labels: Array.from({ length: 33 }, (_, i) => i + 8), // Tuần 8 đến 40
    datasets: [
      {
        label: "Upper Bound (Max Height) (cm)",
        data: [
          4.6, 5.3, 6.1, 7.1, 8.4, 10.4, 11.7, 13.1, 14.6, 16.0, 17.2, 18.3,
          19.4, 28.6, 30.8, 31.9, 33.0, 37.6, 38.6, 39.6, 40.6, 41.9, 43.1,
          44.4, 45.7, 46.9, 48.1, 49.3, 50.5, 51.4, 52.2, 54.2, 54.7,
        ],
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        tension: 0.3,
      },
      {
        label: "Lower Bound (Min Height) (cm)",
        data: [
          0, 0, 0.1, 1.1, 2.4, 4.4, 5.7, 7.1, 8.6, 10.0, 11.2, 12.3, 13.4, 22.6,
          24.8, 25.9, 27.0, 31.6, 32.6, 33.6, 34.6, 35.9, 37.1, 38.4, 39.7,
          40.9, 42.1, 43.3, 44.5, 45.4, 46.2, 48.2, 48.7,
        ],
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        tension: 0.3,
      },
      {
        label: "Standard Height (cm)",
        data: [
          1.6, 2.3, 3.1, 4.1, 5.4, 7.4, 8.7, 10.1, 11.6, 13.0, 14.2, 15.3, 16.4,
          25.6, 27.8, 28.9, 30.0, 34.6, 35.6, 36.6, 37.6, 38.9, 40.1, 41.4,
          42.7, 43.9, 45.1, 46.3, 47.5, 48.4, 49.2, 51.2, 51.7,
        ],
        borderColor: "green",
        backgroundColor: "rgba(0, 255, 0, 0.2)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div
      style={{
        padding: 20,
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        borderRadius: 10,
        background: "#fff",
      }}
    >
      <Row gutter={[16, 16]} align="middle">
        {/* Cột 1: Avatar */}
        <Col xs={24} md={6} style={{ textAlign: "center" }}>
          <Avatar size={128} icon={<UserOutlined />} />

          {/* Bọc icon trong một div và thêm margin-top */}
          <div style={{ fontSize: "40px", marginTop: "10px" }}>
            <FontAwesomeIcon
              icon={faChildDress}
              style={{ marginRight: "10px" }}
            />
            <FontAwesomeIcon icon={faChild} />
          </div>
        </Col>

        {/* Cột 2: Thông tin Baby */}
        <Col xs={24} md={10}>
          <Title level={3}>Baby Information</Title>
          <p>
            <strong>Name:</strong> [Insert Name]
          </p>
          <p>
            <strong>Estimated Due Date:</strong> [Insert Date]
          </p>
        </Col>

        {/* Đường kẻ ngang */}
        <Col span={24}>
          <hr style={{ border: "1px solid #ddd", margin: "10px 0" }} />
        </Col>

        {/* Cột 3: Các icon */}
        <Col xs={24} md={24} style={{ width: "100%" }}>
          <Row
            gutter={[16, 16]}
            justify="space-between"
            style={{ width: "100%" }}
          >
            <Col flex={1} style={{ textAlign: "center" }}>
              <FontAwesomeIcon icon={faWeightScale} size="3x" />
            </Col>
            <Col flex={1} style={{ textAlign: "center" }}>
              <FontAwesomeIcon icon={faRuler} size="3x" />
            </Col>
            <Col flex={1} style={{ textAlign: "center" }}>
              <FontAwesomeIcon icon={faCircleNotch} size="3x" />
            </Col>
            <Col flex={1} style={{ textAlign: "center" }}>
              <FontAwesomeIcon icon={faNewspaper} size="3x" />
            </Col>
            <Col flex={1} style={{ textAlign: "center" }}>
              <FontAwesomeIcon icon={faCalendarDays} size="3x" />
            </Col>
            <Col flex={1} style={{ textAlign: "center" }}>
              <FontAwesomeIcon icon={faShoePrints} size="3x" />
            </Col>
          </Row>
        </Col>

        {/* Đường kẻ ngang */}
        <Col span={24}>
          <hr style={{ border: "1px solid #ddd", margin: "20px 0" }} />
        </Col>

        {/* Biểu đồ cân nặng */}
        <Col span={20} offset={2} style={{ textAlign: "center" }}>
          <Title level={4}>Weight Chart</Title>
          <Line data={weightData} />
        </Col>

        {/* Biểu đồ chiều dài */}
        <Col span={20} offset={2} style={{ textAlign: "center" }}>
          <Title level={4}>Height Chart</Title>
          <Line data={heightData} />
        </Col>
      </Row>
    </div>
  );
}

export default Baby;
