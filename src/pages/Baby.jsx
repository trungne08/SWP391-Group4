import React, { useState, useRef,useEffect } from "react";
import {
  Avatar,
  Typography,
  Row,
  Col,
  Modal,
  Input,
  Button,
  Table,
  Select,
  Tooltip,
  Card,
  message
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
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import { weightData, heightData, circumferenceData } from "../data/chartData";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PREGNANCY_ENDPOINTS } from '../data/config';
import axios from 'axios';

// Import các thư viện và components cần thiết
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  ChartTooltip,
  Legend
);

const { Title } = Typography;
axios.defaults.withCredentials = true;

function Baby() {
  const navigate = useNavigate();
  const weightRef = useRef(null);
  const heightRef = useRef(null);
  const circumferenceRef = useRef(null);
  const vaccinationRef = useRef(null);

 // doan code chay sever 
 const [pregnancyData, setPregnancyData] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 
 useEffect(() => {
  const fetchPregnancyDataByUserId = async () => {
    try {
      const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
      if (!userId) {
        throw new Error('User ID not found');
      }

      const response = await axios.get(PREGNANCY_ENDPOINTS.GET_BY_USER_ID(userId));
      setPregnancyData(response.data);
      
      // Update local state with fetched data
      if (response.data) {
        setSelectedWeek(response.data.gestationalWeeks);
        setSelectedDay(response.data.gestationalDays);
        setIsPregnancyActive(response.data.status !== "COMPLETED");
      }
    } catch (error) {
      console.error('Error fetching pregnancy data:', error);
      setError(error.response?.data?.message || 'Failed to fetch pregnancy data');
    } finally {
      setLoading(false);
    }
  };

  fetchPregnancyDataByUserId();
}, []);

const handleFormSubmit = async () => {
  try {
    if (!pregnancyData?.pregnancyId) {
      throw new Error('No pregnancy ID found');
    }

    const updateData = {
      gestationalWeeks: selectedWeek,
      gestationalDays: selectedDay,
      examDate: formData.checkupDate,
      weight: formData.weight,
      height: formData.height,
      circumference: formData.circumference,
    };

    await axios.put(
      PREGNANCY_ENDPOINTS.UPDATE(pregnancyData.pregnancyId), 
      updateData
    );
    
    // Update local state
    const dates = calculateDates(selectedWeek, selectedDay);
    setPregnancyStartDate(dates.pregnancyStart);
    setDueDate(dates.dueDate);
    setIsModalOpen(false);

    // Show success message (if you have a notification system)
    message.success('Pregnancy data updated successfully');
  } catch (error) {
    console.error('Error updating pregnancy data:', error);
    message.error(error.response?.data?.message || 'Failed to update pregnancy data');
  }
};

const handleEndPregnancy = async () => {
  try {
    if (!pregnancyData?.pregnancyId) {
      throw new Error('No pregnancy ID found');
    }

    await axios.put(
      PREGNANCY_ENDPOINTS.END_PREGNANCY(pregnancyData.pregnancyId),
      { status: "COMPLETED" }
    );

    setIsPregnancyActive(false);
    setIsEndPregnancyModalOpen(true);
    message.success('Pregnancy ended successfully');
  } catch (error) {
    console.error('Error ending pregnancy:', error);
    message.error(error.response?.data?.message || 'Failed to end pregnancy');
  }
};
 //

  const [currentAvatar, setCurrentAvatar] = useState(0);
  const [motherVaccineStatus, setMotherVaccineStatus] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  });

  const [motherVaccineSkipped, setMotherVaccineSkipped] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  });

  const [babyVaccineStatus, setBabyVaccineStatus] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [pregnancyStartDate, setPregnancyStartDate] = useState(null);

  const [numberOfFetuses, setNumberOfFetuses] = useState(1);
  const [dueDate, setDueDate] = useState(null);
  const [pregnancyNumber, setPregnancyNumber] = useState(1);
  const [formData, setFormData] = useState({
    weight: "",
    height: "",
    circumference: "",
  });

  const [isPregnancyListModalOpen, setIsPregnancyListModalOpen] =
    useState(false);
  const handlePregnancyListClick = () => {
    setIsPregnancyListModalOpen(true);
  };
  const [isPregnancyActive, setIsPregnancyActive] = useState(true);


  const [isEndPregnancyModalOpen, setIsEndPregnancyModalOpen] = useState(false);
  // Add this new function with other handlers
  const confirmEndPregnancy = () => {
    setIsPregnancyActive(false);
    setIsEndPregnancyModalOpen(false);
  };
  const pregnancyHistory = [
    {
      number: pregnancyNumber,
      startDate: pregnancyStartDate,
      dueDate: dueDate,
      week: selectedWeek,
      day: selectedDay,
      numberOfFetuses,
      measurements: formData,
    },
  ];

  // Tính tổng số mũi tiêm còn lại
  const getPendingVaccinations = () => {
    const totalVaccines = 11;
    const confirmedVaccines =
      Object.values(motherVaccineStatus).filter((status) => status).length +
      Object.values(babyVaccineStatus).filter((status) => status).length;
    return totalVaccines - confirmedVaccines;
  };
  // Modify the iconList array to include the onClick handler
  const iconList = [
    { icon: faWeightScale, label: "Cân nặng", ref: weightRef },
    { icon: faRuler, label: "Chiều dài", ref: heightRef },
    { icon: faCircleNotch, label: "Chu vi vòng đầu", ref: circumferenceRef },
    { icon: faNewspaper, label: "Tin tức" },
    {
      icon: faCalendarDays,
      label: "Lịch tiêm",
      ref: vaccinationRef,
      badge: getPendingVaccinations(),
    },
    {
      icon: faList,
      label: "Danh sách thai kì",
      onClick: handlePregnancyListClick,
    },
  ];
  // Xử lý khi hủy form
  const handleCancel = () => {
    setIsModalOpen(false);
    setFormData({ weight: "", height: "", circumference: "" });
    setSelectedWeek("");
    setSelectedDay("");
  };
  // Tính toán ngày dự sinh dựa trên tuần và ngày
  const calculateDates = (weeks, days) => {
    if (!weeks || !days) return { pregnancyStart: null, dueDate: null };

    const today = new Date();
    const totalDays = Number(weeks) * 7 + Number(days);

    const pregnancyStart = new Date(today);
    pregnancyStart.setDate(today.getDate() - totalDays);

    const dueDate = new Date(pregnancyStart);
    dueDate.setDate(pregnancyStart.getDate() + 280); // Thời gian thai kỳ chuẩn

    return { pregnancyStart, dueDate };
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

  // Add a handler for skipping vaccinations
  const handleMotherVaccineSkip = (key) => {
    setMotherVaccineSkipped((prev) => ({
      ...prev,
      [key]: true,
    }));
  };
  const handleMotherVaccineConfirm = (key) => {
    setMotherVaccineStatus((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  // Add this state with other states
  const [babyVaccineSkipped, setBabyVaccineSkipped] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });

  // Add this handler with other handlers
  const handleBabyVaccineSkip = (key) => {
    setBabyVaccineSkipped((prev) => ({
      ...prev,
      [key]: true,
    }));
  };
  const handleBabyVaccineConfirm = (key) => {
    setBabyVaccineStatus((prev) => ({
      ...prev,
      [key]: true,
    }));
  };


    return (
      <div>
        <Row
          gutter={[4, 4]}
          justify="center"
          align="middle"
          style={{ minHeight: "30vh" }}
        >
          <Col xs={24} md={4} className="text-center">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Title level={5} style={{ margin: 0 }}>
                  Mang thai lần thứ
                </Title>
                <Input
                  type="number"
                  min={1}
                  value={pregnancyNumber}
                  onChange={(e) =>
                    setPregnancyNumber(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  style={{ width: "60px", textAlign: "center" }}
                />
              </div>
              <div style={{ position: "relative" }}>
                <Avatar
                  size={100}
                  icon={<UserOutlined />}
                  style={{
                    backgroundColor: "#1890ff",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                  onClick={() => setIsModalOpen(true)}
                />
                <div
                  style={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    background: "#f56a00",
                    color: "#fff",
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  {pregnancyNumber}
                </div>
              </div>
            </div>
          </Col>
      




  <Col xs={24} md={6}>
    <Title level={4}>Mom Information</Title>

    {[
      { label: "Tên", value: pregnancyData?.user?.userProfile?.fullName || "N/A" },
      {
        label: "Tuần thai kỳ hiện tại",
        value: pregnancyData ? 
          `${pregnancyData.gestationalWeeks} tuần ${pregnancyData.gestationalDays} ngày` 
          : "Chưa có thông tin",
      },
      {
        label: "Ngày bắt đầu mang thai",
        value: pregnancyData?.startDate ? 
          new Date(pregnancyData.startDate).toLocaleDateString("en-GB") 
          : "Chưa có thông tin",
      },
      {
        label: "Ngày dự sinh",
        value: pregnancyData?.dueDate ? 
          new Date(pregnancyData.dueDate).toLocaleDateString("en-GB") 
          : "Chưa có thông tin",
      },
    ].map((item, index) => (
      <p key={index} className="info-text">
        <strong>{item.label}:</strong> {item.value}
      </p>
    ))}
  </Col>

          {/* <Col xs={24} md={6}>
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
                  ? new Date(pregnancyStartDate).toLocaleDateString("en-GB")
                  : "Chưa có thông tin",
              },
              {
                label: "Ngày dự sinh",
                value: dueDate
                  ? new Date(dueDate).toLocaleDateString("en-GB")
                  : "Chưa có thông tin",
              },
            ].map((item, index) => (
              <p key={index} className="info-text">
                <strong>{item.label}:</strong> {item.value}
              </p>
            ))}
          </Col> */}

          <Col xs={24} md={4} className="text-center">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Title level={4} style={{ margin: 0, fontSize: "12px" }}>
                  Bạn đang mang thai
                </Title>
                <Select
                  value={numberOfFetuses}
                  onChange={(value) => {
                    setNumberOfFetuses(value);
                    setCurrentAvatar(0);
                  }}
                  style={{ width: 120 }}
                  options={[
                    { value: 1, label: "Đơn thai" },
                    { value: 2, label: "Song thai" },
                    { value: 3, label: "Khác" },
                  ]}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                {numberOfFetuses > 1 && (
                  <Button
                    type="text"
                    onClick={() =>
                      setCurrentAvatar((prev) =>
                        prev === 0 ? numberOfFetuses - 1 : prev - 1
                      )
                    }
                  ></Button>
                )}
                {[...Array(numberOfFetuses)].map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Avatar
                      size={100}
                      style={{
                        cursor: "pointer",
                        border:
                          currentAvatar === index ? "2px solid #1890ff" : "none",
                      }}
                      onClick={() => setCurrentAvatar(index)}
                    >
                      {String.fromCharCode(65 + index)}
                    </Avatar>
                    <div style={{ textAlign: "center", marginTop: "8px" }}>
                      {" "}
                      <Title
                        level={5}
                        style={{
                          margin: 0,
                          alignContent: "center",
                          fontSize: "12px",
                        }}
                      >
                        Tên của bé
                      </Title>
                    </div>
                  </motion.div>
                ))}
                {numberOfFetuses > 1 && (
                  <Button
                    type="text"
                    onClick={() =>
                      setCurrentAvatar((prev) =>
                        prev === numberOfFetuses - 1 ? 0 : prev + 1
                      )
                    }
                  ></Button>
                )}
              </div>
            </div>
          </Col>
        </Row>

        <Col span={24}>
          <hr style={{ border: "1px solid #ddd", margin: "10px 0" }} />
        </Col>

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
                // In the icon rendering section, modify the onClick handler
                onClick={() => {
                  if (item.ref) {
                    scrollToChart(item.ref);
                  }
                  if (item.onClick) {
                    item.onClick();
                  }
                }}
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
                  <div style={{ position: "relative" }}>
                    <FontAwesomeIcon
                      icon={item.icon}
                      size="3x"
                      className="icon"
                      style={{
                        transition: "transform 0.2s, color 0.2s",
                      }}
                    />
                    {item.badge > 0 && (
                      <div
                        style={{
                          position: "absolute",
                          top: "-10px",
                          right: "-10px",
                          background: "#ff4d4f",
                          color: "white",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                        }}
                      >
                        {item.badge}
                      </div>
                    )}
                  </div>

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
                width: "27%",
                align: "center",
                render: () => (
                  <div style={{ display: "flex", gap: "16px" }}>
                    <Input
                      type="number"
                      style={{ width: "100%" }}
                      placeholder="Tuần (1-40)"
                      min={1}
                      max={40}
                      value={selectedWeek}
                      onChange={(e) => {
                        const value = Math.min(
                          40,
                          Math.max(1, Number(e.target.value))
                        );
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
                        const value = Math.min(
                          7,
                          Math.max(1, Number(e.target.value))
                        );
                        setSelectedDay(value);
                      }}
                    />
                    <span>ngày</span>
                  </div>
                ),
              },
              {
                title: "Ngày khám",
                dataIndex: "checkupDate",
                key: "checkupDate",
                width: "18%",
                align: "center",
                render: (_, record) => (
                  <Input
                    type="date"
                    value={record.checkupDate}
                    onChange={(e) =>
                      handleInputChange("checkupDate", e.target.value)
                    }
                    style={{ textAlign: "center" }}
                  />
                ),
              },
              {
                title: "Cân nặng (g)",
                dataIndex: "weight",
                key: "weight",
                width: "18%",
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
                width: "18%",
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
                width: "75%",
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

        <Col span={20} offset={2} style={{ textAlign: "center" }} ref={weightRef}>
          <Title level={4}>Weight Chart</Title>
          <Line data={weightData} />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              marginTop: "10px",
            }}
          >
            <p style={{ color: "red", fontWeight: "bold" }}>
              Em bé trên mức tiêu chuẩn
            </p>
            <p style={{ color: "green", fontWeight: "bold" }}>
              {" "}
              Em bé đang trong mức tiêu chuẩn
            </p>
            <p style={{ color: "blue", fontWeight: "bold" }}>
              Em bé dưới mức tiêu chuẩn
            </p>
          </div>
        </Col>

        <Col span={20} offset={2} style={{ textAlign: "center" }} ref={heightRef}>
          <Title level={4}>Height Chart</Title>
          <Line data={heightData} />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              marginTop: "10px",
            }}
          >
            <p style={{ color: "red", fontWeight: "bold" }}>
              Em bé trên mức tiêu chuẩn
            </p>
            <p style={{ color: "green", fontWeight: "bold" }}>
              {" "}
              Em bé đang trong mức tiêu chuẩn
            </p>
            <p style={{ color: "blue", fontWeight: "bold" }}>
              Em bé dưới mức tiêu chuẩn
            </p>
          </div>
        </Col>

        <Col span={24}>
          <hr style={{ border: "1px solid #ddd", margin: "20px 0" }} />
        </Col>

        <Col
          span={20}
          offset={2}
          style={{ textAlign: "center" }}
          ref={circumferenceRef}
        >
          <Title level={4}>Head Circumference Chart</Title>
          <Line data={circumferenceData} />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              marginTop: "10px",
            }}
          >
            <p style={{ color: "red", fontWeight: "bold" }}>
              Em bé trên mức tiêu chuẩn
            </p>
            <p style={{ color: "green", fontWeight: "bold" }}>
              {" "}
              Em bé đang trong mức tiêu chuẩn
            </p>
            <p style={{ color: "blue", fontWeight: "bold" }}>
              Em bé dưới mức tiêu chuẩn
            </p>
          </div>
        </Col>

        <Col
          span={20}
          offset={2}
          style={{ textAlign: "center", marginBottom: "20px" }}
          ref={vaccinationRef}
        >
          <Col span={24}>
            <hr style={{ border: "1px solid #ddd", margin: "20px 0" }} />
          </Col>

          <Title level={4}>Lịch Tiêm Chủng</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Title level={5}>Lịch Tiêm Cho Mẹ</Title>
              <Table
                dataSource={[
                  {
                    key: "1",
                    time: "Trước khi mang thai (ít nhất 3 tháng)",
                    vaccine:
                      "Sởi - Quai bị - Rubella, Thủy đậu, Viêm gan B, Viêm não Nhật Bản, HPV, Phế cầu khuẩn",
                  },
                  {
                    key: "2",
                    time: "Trước khi mang thai hoặc trong thai kỳ",
                    vaccine:
                      "Vắc xin Cúm (nên tiêm trước thai kỳ và nhắc lại hàng năm)",
                  },
                  {
                    key: "3",
                    time: "Tuần 20+",
                    vaccine: "Uốn ván mũi 1 (nếu mang thai lần đầu)",
                  },
                  {
                    key: "4",
                    time: "Tuần 24-28",
                    vaccine:
                      "Vắc xin phòng tiểu đường thai kỳ (nếu cần, theo chỉ định bác sĩ)",
                  },
                  {
                    key: "5",
                    time: "Tuần 27-36",
                    vaccine:
                      "Tdap (Uốn ván, Bạch hầu, Ho gà) – bảo vệ trẻ sơ sinh khỏi ho gà",
                  },
                  {
                    key: "6",
                    time: "Tuần 30+",
                    vaccine:
                      "Uốn ván mũi 2 (nếu mang thai lần đầu, cách mũi 1 ít nhất 1 tháng và trước sinh 1 tháng)",
                  },
                ]}
                columns={[
                  { title: "Thời gian", dataIndex: "time", key: "time" },
                  { title: "Loại vaccine", dataIndex: "vaccine", key: "vaccine" },
                  {
                    title: "Trạng thái",
                    key: "status",
                    render: (_, record) => (
                      <div>
                        {motherVaccineStatus[record.key] ? (
                          <span style={{ color: "green" }}>Đã tiêm</span>
                        ) : motherVaccineSkipped[record.key] ? (
                          <span style={{ color: "red" }}>Đã hủy</span>
                        ) : (
                          <div style={{ display: "flex", gap: "8px" }}>
                            <Button
                              type="primary"
                              onClick={() =>
                                handleMotherVaccineConfirm(record.key)
                              }
                            >
                              Xác nhận
                            </Button>
                            <Button
                              type="default"
                              onClick={() => handleMotherVaccineSkip(record.key)}
                            >
                              Bỏ qua tiêm
                            </Button>
                          </div>
                        )}
                      </div>
                    ),
                  },
                ]}
                pagination={false}
              />
            </Col>
            <Col span={12}>
              <Title level={5}>Lịch Tiêm Cho Bé</Title>
              <Table
                dataSource={[
                  {
                    key: "1",
                    time: "Trước khi mang thai",
                    vaccine:
                      "Rubella, Sởi, Quai bị, Thủy đậu, Viêm gan B, Cúm, Phế cầu, Viêm não Nhật Bản, HPV",
                  },
                  { key: "2", time: "Tuần 20+", vaccine: "Uốn ván (mũi 1)" },
                  {
                    key: "3",
                    time: "Tuần 21-25",
                    vaccine: "Uốn ván (mũi 2, cách mũi 1 ít nhất 1 tháng)",
                  },
                  {
                    key: "4",
                    time: "Tuần 27-36",
                    vaccine: "Tdap (Uốn ván - Bạch hầu - Ho gà)",
                  },
                  { key: "5", time: "Mùa cúm", vaccine: "Vắc xin cúm" },
                ]}
                columns={[
                  { title: "Thời gian", dataIndex: "time", key: "time" },
                  { title: "Loại vaccine", dataIndex: "vaccine", key: "vaccine" },
                  {
                    title: "Trạng thái",
                    key: "status",
                    render: (_, record) => (
                      <div>
                        {babyVaccineStatus[record.key] ? (
                          <span style={{ color: "green" }}>Đã tiêm</span>
                        ) : babyVaccineSkipped[record.key] ? (
                          <span style={{ color: "red" }}>Đã hủy</span>
                        ) : (
                          <div style={{ display: "flex", gap: "8px" }}>
                            <Button
                              type="primary"
                              onClick={() => handleBabyVaccineConfirm(record.key)}
                            >
                              Xác nhận
                            </Button>
                            <Button
                              type="default"
                              onClick={() => handleBabyVaccineSkip(record.key)}
                            >
                              Bỏ qua tiêm
                            </Button>
                          </div>
                        )}
                      </div>
                    ),
                  },
                ]}
                pagination={false}
              />
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          <hr style={{ border: "1px solid #ddd", margin: "10px 0" }} />
        </Col>

        <Tooltip title="Quay về đầu trang" placement="top">
          <Button
            type="primary"
            style={{
              position: "fixed",
              bottom: "50px",
              right: "50px",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              zIndex: 1000,
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            ↑
          </Button>
        </Tooltip>
        {/* ... existing code ... */}

        <Modal
          title="Lịch sử thai kỳ"
          open={isPregnancyListModalOpen}
          onCancel={() => setIsPregnancyListModalOpen(false)}
          footer={null}
          width={1000}
        >
          <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
            {pregnancyHistory.map((pregnancy, index) => (
              <Card
                key={index}
                title={`Thai kỳ thứ 1 - Trạng thái: ${
                  isPregnancyActive ? "Đang mang thai" : "Đã kết thúc"
                }`}
                style={{ marginBottom: 16 }}
                extra={
                  isPregnancyActive && (
                    <Button type="primary" danger onClick={handleEndPregnancy}>
                      Kết thúc thai kỳ
                    </Button>
                  )
                }
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <p>
                      <strong>Ngày bắt đầu:</strong>{" "}
                      {pregnancy.startDate?.toLocaleDateString("en-GB")}
                    </p>
                    <p>
                      <strong>Ngày dự sinh:</strong>{" "}
                      {pregnancy.dueDate?.toLocaleDateString("en-GB")}
                    </p>
                  </Col>
                  <Col span={12}>
                    <p>
                      <strong>Tuần thai:</strong> {pregnancy.week} tuần{" "}
                      {pregnancy.day} ngày
                    </p>
                    <p>
                      <strong>Số thai:</strong> {pregnancy.numberOfFetuses}
                    </p>
                  </Col>
                </Row>
                <Title level={5}>Chỉ số theo dõi mới nhất</Title>
                <Table
                  dataSource={[pregnancy.measurements]}
                  columns={[
                    {
                      title: "Cân nặng (g)",
                      dataIndex: "weight",
                      key: "weight",
                    },
                    {
                      title: "Chiều dài (cm)",
                      dataIndex: "height",
                      key: "height",
                    },
                    {
                      title: "Chu vi vòng đầu (mm)",
                      dataIndex: "circumference",
                      key: "circumference",
                    },
                  ]}
                  pagination={false}
                />
              </Card>
            ))}
          </div>
          <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
            {pregnancyHistory.map((pregnancy, index) => (
              <Card
                key={index}
                title={`Thai kỳ thứ 2 - Trạng thái: ${
                  isPregnancyActive ? "Đang mang thai" : "Đã kết thúc"
                }`}
                style={{ marginBottom: 16 }}
                extra={
                  isPregnancyActive && (
                    <Button type="primary" danger onClick={handleEndPregnancy}>
                      Kết thúc thai kỳ
                    </Button>
                  )
                }
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <p>
                      <strong>Ngày bắt đầu:</strong>{" "}
                      {pregnancy.startDate?.toLocaleDateString("en-GB")}
                    </p>
                    <p>
                      <strong>Ngày dự sinh:</strong>{" "}
                      {pregnancy.dueDate?.toLocaleDateString("en-GB")}
                    </p>
                  </Col>
                  <Col span={12}>
                    <p>
                      <strong>Tuần thai:</strong> {pregnancy.week} tuần{" "}
                      {pregnancy.day} ngày
                    </p>
                    <p>
                      <strong>Số thai:</strong> {pregnancy.numberOfFetuses}
                    </p>
                  </Col>
                </Row>
                <Title level={5}>Chỉ số theo dõi mới nhất</Title>
                <Table
                  dataSource={[pregnancy.measurements]}
                  columns={[
                    {
                      title: "Cân nặng (g)",
                      dataIndex: "weight",
                      key: "weight",
                    },
                    {
                      title: "Chiều dài (cm)",
                      dataIndex: "height",
                      key: "height",
                    },
                    {
                      title: "Chu vi vòng đầu (mm)",
                      dataIndex: "circumference",
                      key: "circumference",
                    },
                  ]}
                  pagination={false}
                />
              </Card>
            ))}
          </div>
        </Modal>
        <Modal
          title="Xác nhận kết thúc thai kỳ"
          open={isEndPregnancyModalOpen}
          onOk={confirmEndPregnancy}
          onCancel={() => setIsEndPregnancyModalOpen(false)}
          okText="Xác nhận"
          cancelText="Hủy"
        >
          <p>Bạn có chắc chắn muốn kết thúc thai kỳ này không?</p>
          <p>Hành động này không thể hoàn tác.</p>
        </Modal>
      </div>
    );
}

export default Baby;
