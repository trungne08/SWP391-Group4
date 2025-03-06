<<<<<<< Updated upstream
import React from "react";
=======
import React, { useState, useEffect } from "react";
>>>>>>> Stashed changes
import { Avatar, Typography, Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
<<<<<<< Updated upstream
=======
import { Modal, Input, Button, DatePicker, Select } from "antd";
import { Line } from "react-chartjs-2";

>>>>>>> Stashed changes
import {
  faWeightScale,
  faRuler,
  faCircleNotch,
  faNewspaper,
  faCalendarDays,
  faSyringe
} from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
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
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const weightRef = useRef(null);
  const heightRef = useRef(null);
  const circumferenceRef = useRef(null);
  const users = [
    { id: 1, name: "Người dùng 1", numBabies: 2 },
    { id: 2, name: "Người dùng 2", numBabies: 1 },
    { id: 3, name: "Người dùng 3", numBabies: 3 },
  ];
  const [selectedUser, setSelectedUser] = useState(users[0]);
  // Tạo state để lưu trạng thái click cho từng avatar
  const [clicked, setClicked] = useState(
    new Array(selectedUser.numBabies).fill(false)
  );

  // Khi người dùng được chọn thay đổi, reset lại trạng thái click cho các avatar
  useEffect(() => {
    setClicked(new Array(selectedUser.numBabies).fill(false));
  }, [selectedUser]);

  const [numBabies, setNumBabies] = useState(1);
  const scrollToChart = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Dữ liệu biểu đồ
  const labels = Array.from({ length: 40 }, (_, i) => i + 1);

<<<<<<< Updated upstream

=======
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const openModal = (type) => {
    setSelectedType(type);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    console.log(`Nhập ${selectedType}:`, inputValue, "Ngày:", selectedDate);
    setIsModalOpen(false);
    setInputValue("");
    setSelectedDate(null);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setInputValue("");
    setSelectedDate(null);
  };
>>>>>>> Stashed changes

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
        label: "Deviation (g)",
        data: [
          25,
          25,
          25,
          65,
          65,
          65,
          65,
          65,
          90,
          125,
          170,
          220,
          275,
          335,
          400,
          471,
          555,
          635,
          715,
          820,
          945,
          1084,
          1241,
          1410,
          1607,
          1823,
          2051,
          2288,
          null,
          null,
          null,
          null,
          null, // Ngắt đoạn để vẽ dataset khác
        ],
        borderColor: "green",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        tension: 0.3,
      },
      {
        label: " ",
        data: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          2288,
          2527,
          2765,
          2991,
          3205,
          3395, // Chỉ vẽ phần cuối
        ],
        borderColor: "gray",
        backgroundColor: "rgba(236, 227, 227, 0.2)",
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

  const circumferenceData = {
    labels: Array.from({ length: 29 }, (_, i) => i + 12), // Tuần 12 đến 40
    datasets: [
      {
        label: "Upper Bound (Max Circumference) (mm)",
        data: [
          80, 94, 107.9, 124, 132, 144, 158, 170, 187, 192, 203, 218, 231, 249,
          251, 266, 281, 283, 287, 292, 302, 312, 319, 327, 332, 340, 346, 355,
          365,
        ],
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        tension: 0.3,
      },
      {
        label: "Standard Value (Normal Circumference) (mm)",
        data: [
          70, 84, 97.9, 114, 122, 134, 148, 160, 177, 182, 193, 208, 221, 239,
          241, 256, 271, 273, 277, 282, 292, 302, 309, 317, 322, 330, 336, 345,
          354,
        ],
        borderColor: "green",
        backgroundColor: "rgba(0, 255, 0, 0.2)",
        tension: 0.3,
      },
      {
        label: "Lower Bound (Min Circumference) (mm)",
        data: [
          60, 74, 87.9, 104, 112, 124, 138, 150, 167, 172, 183, 198, 211, 229,
          231, 246, 261, 263, 267, 272, 282, 292, 299, 307, 312, 320, 326, 335,
          345,
        ],
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const iconList = [
    { icon: faWeightScale, label: "Cân nặng", ref: weightRef },
    { icon: faRuler, label: "Chiều dài", ref: heightRef },
    { icon: faCircleNotch, label: "Chu vi vòng đầu", ref: circumferenceRef },
    { icon: faNewspaper, label: "Tin tức" },
    { icon: faCalendarDays, label: "Lịch hẹn với bác sĩ " },
    { icon: faSyringe, label: "Lịch Tiêm Phòng" },
  ];

  return (
    <div
      style={{
        padding: 20,
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        borderRadius: 10,
        background: "#fff",
      }}
    >
      <Row
        gutter={[4, 4]}
        justify="center"
        align="middle"
        style={{ minHeight: "30vh" }}
      >
        {/* Cột 1: Avatar */}
        <Col>
          {" "}
          <div className="text-center">
            <h3>Chọn người dùng</h3>
            <Select
              value={selectedUser.id}
              onChange={(value) =>
                setSelectedUser(users.find((user) => user.id === value))
              }
              style={{ width: 200, marginBottom: 20 }}
            >
              {users.map((user) => (
                <Select.Option key={user.id} value={user.id}>
                  {user.name}
                </Select.Option>
              ))}
            </Select>
          </div>
        </Col>

        {/* Cột 2: Thông tin cơ bản */}
        <Col xs={24} md={6}>
          <Title level={4}>Mom Information</Title>
          {[
            { label: "Name", value: "[Insert Name]" },
            { label: "Current Week of Pregnancy", value: "[Insert Week]" },
            { label: "Baby's Birthday", value: "[Insert Date]" },
            { label: "Estimated Due Date", value: "[Insert Date]" },
          ].map((item, index) => (
            <p key={index} className="info-text">
              <strong>{item.label}:</strong> {item.value}
            </p>
          ))}
        </Col>

        {/* Cột 3: Thông tin liên hệ */}

        {/* Cột 4: Avatar */}
        <div>
          <h3>Số em bé của {selectedUser.name}</h3>
          <Row gutter={[24, 24]} justify="center">
            {[...Array(selectedUser.numBabies)].map((_, index) => (
              <Col key={index} xs={24} md={4} className="text-center">
                <Avatar
                  size={100}
                  icon={<UserOutlined />}
                  onClick={() => {
                    // Toggle trạng thái của avatar tại index này
                    const newClicked = [...clicked];
                    newClicked[index] = !newClicked[index];
                    setClicked(newClicked);
                  }}
                  style={{
                    cursor: "pointer",
                    // Nếu avatar đã được nhấn, đổi màu nền thành màu xanh lá (có thể thay đổi tùy ý)
                    backgroundColor: clicked[index] ? "#52c41a" : "#1890ff",
                  }}
                />
              </Col>
            ))}
          </Row>
        </div>
      </Row>
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
          {iconList.map((item, index) => (
            <Col
              flex={1}
              style={{ textAlign: "center", position: "relative" }}
              key={index}
              onClick={() => item.ref && scrollToChart(item.ref)}
            >
              <div
                style={{
                  display: "inline-block",
                  position: "relative",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  const icon = e.currentTarget.querySelector(".icon");
                  const text = e.currentTarget.querySelector(".tooltip");
                  icon.style.transform = "scale(1.2)";
                  icon.style.color = "#a6a9ab";
                  text.style.opacity = "1";
                  text.style.visibility = "visible";
                }}
                onMouseLeave={(e) => {
                  const icon = e.currentTarget.querySelector(".icon");
                  const text = e.currentTarget.querySelector(".tooltip");
                  icon.style.transform = "scale(1)";
                  icon.style.color = "black";
                  text.style.opacity = "0";
                  text.style.visibility = "hidden";
                }}
              >
                {/* Icon */}
                <FontAwesomeIcon
                  icon={item.icon}
                  size="3x"
                  className="icon"
                  style={{
                    transition: "transform 0.2s, color 0.2s",
                  }}
                />

                {/* Tooltip hiển thị ngay trên icon */}
                <span
                  className="tooltip"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "rgba(0, 0, 0, 0.8)",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                    opacity: 0,
                    visibility: "hidden",
                    transition: "opacity 0.2s ease",
                  }}
                >
                  {item.label}
                </span>
              </div>
            </Col>
          ))}
        </Row>
      </Col>

      {/* Đường kẻ ngang */}
      <Col span={24}>
        <hr style={{ border: "1px solid #ddd", margin: "20px 0" }} />

      </Col>
      <Button onClick={() => openModal("Cân nặng")}>Nhập cân nặng</Button>
      <Button onClick={() => openModal("Chiều dài")}>Nhập chiều dài</Button>
      <Button>onClick ={() => openModal("Chu vi vòng đầu" )}>Nhập chu vi vòng đầu</Button>
      <Col span={24}>
        <hr style={{ border: "1px solid #ddd", margin: "20px 0" }} />

      </Col>

      {/* Biểu đồ cân nặng */}
<<<<<<< Updated upstream
      <Col span={20} offset={2} style={{ textAlign: "center" }} ref={weightRef}>
        <Title level={4}>Weight Chart</Title>
        <Line data={weightData} />
=======
      <Col span={20} offset={2} style={{ textAlign: "center" }}>
        <Title level={4}>Weight Chart</Title>
        <Line data={weightData} />
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
         
        </div>
>>>>>>> Stashed changes
      </Col>
      {/* Đường kẻ ngang */}
      <Col span={24}>
        <hr style={{ border: "1px solid #ddd", margin: "10px 0" }} />
      </Col>
      {/* Biểu đồ chiều dài */}
      <Col span={20} offset={2} style={{ textAlign: "center" }} ref={heightRef}>
        <Title level={4}>Height Chart</Title>
        <Line data={heightData} />
<<<<<<< Updated upstream
=======
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
        
        </div>
>>>>>>> Stashed changes
      </Col>

      {/* Đường kẻ ngang */}
      <Col span={24}>
        <hr style={{ border: "1px solid #ddd", margin: "20px 0" }} />
      </Col>
      {/* Biểu đồ vòng đầu */}
      <Col span={20} offset={2} style={{ textAlign: "center" }} ref={circumferenceRef}s>
        <Title level={4}>Circumference Chart</Title>
        <Line data={circumferenceData} />
<<<<<<< Updated upstream
      </Col>
=======
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
         
        </div>
      </Col>

      {/* Đường kẻ ngang */}
      <Col span={24}>
        <hr style={{ border: "1px solid #ddd", margin: "20px 0" }} />
      </Col>
      {/* Modal nhập dữ liệu */}
      <Modal
        title={`Nhập ${selectedType}`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <DatePicker
          style={{ width: "100%", marginBottom: "10px" }}
          onChange={(date) => setSelectedDate(date)}
        />
        <Input
          placeholder={`Nhập ${selectedType}...`}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </Modal>
>>>>>>> Stashed changes
    </div>
  );
}

export default Baby;
