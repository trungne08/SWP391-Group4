import React, { useState, useRef } from "react";
// Thêm Table vào import từ antd
import {
  Avatar,
  Typography,
  Row,
  Col,
  Modal,
  Input,
  Button,


  Table,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Line } from "react-chartjs-2";
import {
  faWeightScale,
  faRuler,
  faCircleNotch,
  faNewspaper,
  faCalendarDays,
  faShoePrints,
} from "@fortawesome/free-solid-svg-icons";
import { weightData, heightData, circumferenceData } from "../data/chartData";
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


// Add this state for form values
function Baby() {
  const navigate = useNavigate();
  const weightRef = useRef(null);
  const heightRef = useRef(null);
  const circumferenceRef = useRef(null);


  const iconList = [
    { icon: faWeightScale, label: "Cân nặng", ref: weightRef },
    { icon: faRuler, label: "Chiều dài", ref: heightRef },
    { icon: faCircleNotch, label: "Chu vi vòng đầu", ref: circumferenceRef },
    { icon: faNewspaper, label: "Tin tức" },
    { icon: faCalendarDays, label: "Lịch tiêm" },
    { icon: faShoePrints, label: "Tổng số bước đạp" },
  ];


  const handleCancel = () => {
    setIsModalOpen(false);
    setFormData({ weight: "", height: "", circumference: "" });
    setSelectedWeek("");
    setSelectedDay("");
  };
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  const scrollToChart = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };


  // Move these state declarations up with other states
  // State declarations (giữ phần này ở trên)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [pregnancyStartDate, setPregnancyStartDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [formData, setFormData] = useState({
    weight: "",
    height: "",
    circumference: "",
  });


  // Sửa lại hàm calculateDates để tính từ tuần và ngày
  const calculateDates = (weeks, days) => {
    if (!weeks || !days) return { pregnancyStart: null, dueDate: null };
 
    const today = new Date();
    const totalDays = (Number(weeks) * 7) + Number(days);
   
    // Tính ngày bắt đầu mang thai bằng cách lùi lại số ngày
    const pregnancyStart = new Date(today);
    pregnancyStart.setDate(today.getDate() - totalDays);
   
    // Tính ngày dự sinh (thêm 280 ngày từ ngày bắt đầu)
    const dueDate = new Date(pregnancyStart);
    dueDate.setDate(pregnancyStart.getDate() + 280);
   
    return { pregnancyStart, dueDate };
  };


  // Sửa lại hàm handleFormSubmit
  const handleFormSubmit = () => {
    if (selectedWeek && selectedDay) {
      const dates = calculateDates(selectedWeek, selectedDay);
      setPregnancyStartDate(dates.pregnancyStart);
      setDueDate(dates.dueDate);
    }
    console.log("Form Data:", {
      ...formData,
      week: selectedWeek,
      day: selectedDay,
      pregnancyStartDate: pregnancyStartDate?.toLocaleDateString(),
      dueDate: dueDate?.toLocaleDateString(),
    });
    setIsModalOpen(false);
  };




  return (
    <div>
      <Row
        gutter={[4, 4]}
        justify="center"
        align="middle"
        style={{ minHeight: "30vh" }}
      >
        {/* Cột 1: Avatar */}
        <Col xs={24} md={4} className="text-center">
          <Avatar size={100} icon={<UserOutlined />} />
        </Col>


        {/* Cột 2: Thông tin cơ bản */}
        <Col xs={24} md={6}>
          <Title level={4}>Mom Information</Title>
          {[
           { label: "Tên", value: "Nguyen Van A" },
           {
             label: "Tuần thai kỳ hiện tại",
             value: selectedWeek
               ? `${selectedWeek} tuần ${selectedDay} ngày`
               : "Chưa có thông tin",
           },
           {
             label: "Ngày bắt đầu mang thai",
             value: pregnancyStartDate
               ? new Date(pregnancyStartDate).toLocaleDateString('en-GB')
               : "Chưa có thông tin",
           },
           {
             label: "Ngày dự sinh",
             value: dueDate
               ? new Date(dueDate).toLocaleDateString('en-GB')
               : "Chưa có thông tin",
           },
         ].map((item, index) => (
           <p key={index} className="info-text">
             <strong>{item.label}:</strong> {item.value}
           </p>
         ))}
        </Col>


        {/* Cột 3: Avatar */}
        <Col xs={24} md={4} className="text-center">
          <Avatar
            size={100}
            icon={<UserOutlined />}
            onClick={() => navigate("/baby")}
            style={{ cursor: "pointer" }}
          />
        </Col>
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
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Button
          type="primary"
          onClick={() => setIsModalOpen(true)}
          style={{ marginTop: "10px" }}
        >
          Nhập số liệu của em bé
        </Button>
      </div>


      <Modal
        title="Nhập số liệu của em bé"
        open={isModalOpen}
        onOk={handleFormSubmit}
        onCancel={handleCancel}
        width={1000}
      >
        <Table
          dataSource={[formData]}
          columns={[
            {
              title: "Thai sống trong tử cung ",
              dataIndex: "date",
              key: "date",
              width: "35%",
              align: "center",
              render: () => (
                <div style={{ display: 'flex', gap: '16px' }}>
                  <Input
                    type="number"
                    style={{ width: "100%" }}
                    placeholder="Tuần (1-40)"
                    min={1}
                    max={40}
                    value={selectedWeek}
                    onChange={(e) => {
                      const value = Math.min(40, Math.max(1, Number(e.target.value)));
                      setSelectedWeek(value);
                    }}
                  />
                  <span>tuần</span>
                  <Input
                    type="number"
                    style={{ width: "100%" }}
                    placeholder="Ngày (1-7)"
                    min={1}
                    max={7}
                    value={selectedDay}
                    onChange={(e) => {
                      const value = Math.min(7, Math.max(1, Number(e.target.value)));
                      setSelectedDay(value);
                    }}
                  />
                  <span>ngày</span>
                </div>
              )
            },
            {
              title: "Cân nặng (g)",
              dataIndex: "weight",
              key: "weight",
              width: "25%",
              align: "center",
              render: (_, record) => (
                <Input
                  value={record.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  placeholder="Nhập cân nặng"
                  style={{ textAlign: "center" }}
                />
              ),
            },
            {
              title: "Chiều dài (cm)",
              dataIndex: "height",
              key: "height",
              width: "25%",
              align: "center",
              render: (_, record) => (
                <Input
                  value={record.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                  placeholder="Nhập chiều dài"
                  style={{ textAlign: "center" }}
                />
              ),
            },
            {
              title: "Chu vi vòng đầu (mm)",
              dataIndex: "circumference",
              key: "circumference",
              width: "25%",
              align: "center",
              render: (_, record) => (
                <Input
                  value={record.circumference}
                  onChange={(e) =>
                    handleInputChange("circumference", e.target.value)
                  }
                  placeholder="Nhập chu vi"
                  style={{ textAlign: "center" }}
                />
              ),
            },
          ]}
          pagination={false}
          bordered
          style={{ marginTop: "20px" }}
          className="custom-table"
        />
      </Modal>
      <Col span={24}>
        <hr style={{ border: "1px solid #ddd", margin: "20px 0" }} />
      </Col>
      {/* Biểu đồ cân nặng */}
      <Col
        span={20}
        offset={2}
        style={{ textAlign: "center" }}
        ref={weightRef}  // Thêm ref cho biểu đồ cân nặng
      >
        <Title level={4}>Weight Chart</Title>
        <Line data={weightData} />
      </Col>


      <Col
        span={20}
        offset={2}
        style={{ textAlign: "center" }}
        ref={heightRef}  // Thêm ref cho biểu đồ chiều cao
      >
        <Title level={4}>Height Chart</Title>
        <Line data={heightData} />
      </Col>


      {/* Đường kẻ ngang */}
      <Col span={24}>
        <hr style={{ border: "1px solid #ddd", margin: "20px 0" }} />
      </Col>


      {/* Biểu đồ vòng đầu */}
      <Col
        span={20}
        offset={2}
        style={{ textAlign: "center", marginBottom: "20px" }}
        ref={circumferenceRef}  // Thêm ref cho biểu đồ chu vi đầu
      >
        <Title level={4}>Head Circumference Chart</Title>
        <Line data={circumferenceData} />
      </Col>
    </div>
  );
}


export default Baby;
