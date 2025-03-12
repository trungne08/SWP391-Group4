import React, { useState, useRef, useEffect } from "react";
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
  message,
  Empty,
  Divider,
  Tag,
  Statistic,
  Result,
} from "antd";

import { UserOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
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

import axios from "axios";
import api from "../services/api"; // Import toàn bộ object api

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
const { Text } = Typography;

function Baby() {
  const navigate = useNavigate();
  const weightRef = useRef(null);
  const heightRef = useRef(null);
  const circumferenceRef = useRef(null);
  const vaccinationRef = useRef(null);

  // State management
  const [pregnancyData, setPregnancyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPregnancyActive, setIsPregnancyActive] = useState(true);
  const [isPregnancyListModalOpen, setIsPregnancyListModalOpen] = useState(false);
  const [pregnancyHistoryData, setPregnancyHistoryData] = useState([]);
  const [currentAvatar, setCurrentAvatar] = useState(0);
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
    checkupDate: "",
  });
  const [isEndPregnancyModalOpen, setIsEndPregnancyModalOpen] = useState(false);

  const handlePregnancyListClick = () => {
    setIsPregnancyListModalOpen(true);
  };

  const handleUpdateStatus = async (pregnancyId) => {
    try {
      // Lấy thông tin hiện tại từ pregnancyData để gửi cùng
      const updateData = {
        status: "COMPLETED",
        gestationalWeeks: pregnancyData?.gestationalWeeks || 0, // Giá trị mặc định nếu null
        gestationalDays: pregnancyData?.gestationalDays || 0,   // Giá trị mặc định nếu null
      };

      await api.pregnancy.updatePregnancy(pregnancyId, updateData);

      // Update the local state to reflect the new status
      setPregnancyHistoryData((prevData) =>
        prevData.map((pregnancy) =>
          pregnancy.pregnancyId === pregnancyId
            ? { ...pregnancy, status: "COMPLETED" }
            : pregnancy
        )
      );

      message.success("Thai kỳ đã được kết thúc thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      message.error(`Không thể kết thúc thai kỳ: ${error.response?.data?.message || error.message}`);
    }
  };

  const confirmEndPregnancy = async () => {
    if (pregnancyData?.pregnancyId) {
      await handleUpdateStatus(pregnancyData.pregnancyId);
    }
    setIsPregnancyActive(false);
    setIsEndPregnancyModalOpen(false);
  };

  const calculateDates = (weeks, days) => {
    if (!weeks || !days) return { pregnancyStart: null, dueDate: null };

    const today = new Date();
    const totalDays = Number(weeks) * 7 + Number(days);

    const pregnancyStart = new Date(today);
    pregnancyStart.setDate(today.getDate() - totalDays);

    const dueDate = new Date(pregnancyStart);
    dueDate.setDate(pregnancyStart.getDate() + 280);

    return { pregnancyStart, dueDate };
  };

  const handleFormSubmit = async () => {
    try {
      if (!pregnancyData?.pregnancyId) {
        throw new Error("Không tìm thấy ID thai kỳ");
      }

      const updateData = {
        gestationalWeeks: selectedWeek,
        gestationalDays: selectedDay,
        examDate: formData.checkupDate,
        weight: formData.weight,
        height: formData.height,
        circumference: formData.circumference,
      };

      await api.pregnancy.updatePregnancy(pregnancyData.pregnancyId, updateData);

      const dates = calculateDates(selectedWeek, selectedDay);
      setPregnancyStartDate(dates.pregnancyStart);
      setDueDate(dates.dueDate);
      setIsModalOpen(false);
      message.success("Cập nhật thông tin thai kỳ thành công");
    } catch (error) {
      message.error("Không thể cập nhật thông tin thai kỳ");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setFormData({ weight: "", height: "", circumference: "", checkupDate: "" });
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

  const iconList = [
    { icon: faWeightScale, label: "Cân nặng", ref: weightRef },
    { icon: faRuler, label: "Chiều dài", ref: heightRef },
    { icon: faCircleNotch, label: "Chu vi vòng đầu", ref: circumferenceRef },
    { icon: faNewspaper, label: "Tin tức" },
    { icon: faCalendarDays, label: "Lịch tiêm", ref: vaccinationRef },
    { icon: faList, label: "Danh sách thai kì", onClick: handlePregnancyListClick },
  ];

  useEffect(() => {
    const fetchPregnancyData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          message.warning("Vui lòng đăng nhập để xem thông tin thai kỳ");
          navigate("/login", { state: { from: "/baby" } });
          return;
        }

        const response = await api.pregnancy.getOngoingPregnancy();
        console.log("API Response:", response);

        if (response) {
          setPregnancyData(response);
          setSelectedWeek(response.gestationalWeeks || "");
          setSelectedDay(response.gestationalDays || "");
          setIsPregnancyActive(response.status !== "COMPLETED");
        }
      } catch (error) {
        console.error("Error fetching pregnancy data:", error);

        if (error.response?.status === 401 || error.response?.status === 403) {
          message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại");
          localStorage.clear();
          navigate("/login", { state: { from: "/baby" } });
        } else {
          setError("Không thể lấy dữ liệu thai kỳ");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPregnancyData();
  }, [navigate]);

  useEffect(() => {
    const fetchPregnancyHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          message.warning("Vui lòng đăng nhập để xem lịch sử thai kỳ");
          return;
        }

        const response = await api.pregnancy.getUserPregnancies();
        console.log("Pregnancy history response:", response);

        if (Array.isArray(response)) {
          setPregnancyHistoryData(response);
        } else if (response) {
          setPregnancyHistoryData([response]);
        } else {
          setPregnancyHistoryData([]);
        }
      } catch (error) {
        console.error("Error fetching pregnancy history:", error);
        message.error("Không thể lấy lịch sử thai kỳ");
        setPregnancyHistoryData([]);
      }
    };

    fetchPregnancyHistory();
  }, [isPregnancyActive]);

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
            {
              label: "Tuần thai kỳ hiện tại",
              value: pregnancyData
                ? `${pregnancyData.gestationalWeeks} tuần ${pregnancyData.gestationalDays} ngày`
                : "Chưa có thông tin",
            },
            {
              label: "Ngày bắt đầu mang thai",
              value: pregnancyData?.startDate
                ? new Date(pregnancyData.startDate).toLocaleDateString("en-GB")
                : "Chưa có thông tin",
            },
            {
              label: "Ngày dự sinh",
              value: pregnancyData?.dueDate
                ? new Date(pregnancyData.dueDate).toLocaleDateString("en-GB")
                : "Chưa có thông tin",
            },
          ].map((item, index) => (
            <p key={index} className="info-text">
              <strong>{item.label}:</strong> {item.value}
            </p>
          ))}
          {isPregnancyActive && pregnancyData?.pregnancyId && (
            <Button
              type="primary"
              danger
              style={{ marginTop: 10 }}
              onClick={() => setIsEndPregnancyModalOpen(true)}
            >
              Kết thúc thai kỳ chính
            </Button>
          )}
        </Col>

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

      <Modal
        title="Lịch sử thai kỳ"
        open={isPregnancyListModalOpen}
        onCancel={() => setIsPregnancyListModalOpen(false)}
        footer={null}
        width={1000}
      >
        <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
          {pregnancyHistoryData && pregnancyHistoryData.length > 0 ? (
            pregnancyHistoryData.map((pregnancy, index) => (
              <Card
                key={pregnancy.pregnancyId || index}
                title={`Thai kỳ thứ ${index + 1} - Trạng thái: ${
                  pregnancy.status === "ONGOING"
                    ? "Đang mang thai"
                    : "Đã kết thúc"
                }`}
                style={{ marginBottom: 16 }}
                extra={
                  pregnancy.status === "ONGOING" && (
                    <Button
                      type="primary"
                      danger
                      onClick={() => {
                        console.log("Button clicked for pregnancy:", pregnancy);
                        console.log("Pregnancy ID:", pregnancy.pregnancyId);
                        console.log("All pregnancy properties:", Object.keys(pregnancy));

                        message.warning({
                          content: "Bạn có chắc chắn muốn kết thúc thai kỳ này không? Hành động này không thể hoàn tác.",
                          duration: 0,
                          icon: <ExclamationCircleOutlined />,
                          className: "custom-warning-message",
                          btn: (
                            <>
                              <Button
                                type="primary"
                                danger
                                onClick={async () => {
                                  message.destroy();
                                  try {
                                    const pregnancyId = pregnancy.pregnancyId || pregnancy.id;
                                    if (!pregnancyId) {
                                      message.error("Không tìm thấy ID thai kỳ");
                                      return;
                                    }
                                    await handleUpdateStatus(pregnancyId);
                                  } catch (error) {
                                    console.error("Lỗi khi cập nhật trạng thái:", error);
                                    message.error(`Không thể kết thúc thai kỳ: ${error.response?.data?.message || error.message}`);
                                  }
                                }}
                              >
                                Xác nhận
                              </Button>
                              <Button onClick={() => message.destroy()}>Hủy</Button>
                            </>
                          ),
                        });
                      }}
                    >
                      Kết thúc thai kỳ
                    </Button>
                  )
                }
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <p>
                      <strong>Ngày bắt đầu:</strong>{" "}
                      {pregnancy.startDate
                        ? new Date(pregnancy.startDate).toLocaleDateString("vi-VN")
                        : "Chưa có"}
                    </p>
                    <p>
                      <strong>Ngày dự sinh:</strong>{" "}
                      {pregnancy.dueDate
                        ? new Date(pregnancy.dueDate).toLocaleDateString("vi-VN")
                        : "Chưa có"}
                    </p>
                    <p>
                      <strong>Ngày khám gần nhất:</strong>{" "}
                      {pregnancy.examDate
                        ? new Date(pregnancy.examDate).toLocaleDateString("vi-VN")
                        : "Chưa có"}
                    </p>
                  </Col>
                  <Col span={12}>
                    <p>
                      <strong>Tuần thai:</strong>{" "}
                      {pregnancy.gestationalWeeks || 0} tuần{" "}
                      {pregnancy.gestationalDays || 0} ngày
                    </p>
                    <p>
                      <strong>Số thai:</strong> {pregnancy.totalFetuses || 1}
                    </p>
                    <p>
                      <strong>Trạng thái:</strong>{" "}
                      <Tag
                        color={
                          pregnancy.status === "ONGOING" ? "processing" : "success"
                        }
                      >
                        {pregnancy.status === "ONGOING" ? "Đang mang thai" : "Đã kết thúc"}
                      </Tag>
                    </p>
                  </Col>
                </Row>
                {pregnancy.fetuses && pregnancy.fetuses.length > 0 && (
                  <>
                    <Divider>Thông tin thai nhi</Divider>
                    <Row gutter={[16, 16]}>
                      {pregnancy.fetuses.map((fetus, idx) => (
                        <Col span={24} key={fetus.fetusId || idx}>
                          <Card
                            type="inner"
                            title={`Thai nhi ${String.fromCharCode(65 + idx)}`}
                          >
                            <Row gutter={[16, 8]}>
                              <Col span={8}>
                                <Statistic
                                  title="Cân nặng"
                                  value={fetus.weight || "Chưa có"}
                                  suffix="g"
                                />
                              </Col>
                              <Col span={8}>
                                <Statistic
                                  title="Chiều dài"
                                  value={fetus.height || "Chưa có"}
                                  suffix="cm"
                                />
                              </Col>
                              <Col span={8}>
                                <Statistic
                                  title="Chu vi đầu"
                                  value={fetus.circumference || "Chưa có"}
                                  suffix="mm"
                                />
                              </Col>
                            </Row>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </>
                )}
                <Divider>Ghi chú</Divider>
                <Text type="secondary">
                  {pregnancy.notes || "Không có ghi chú"}
                </Text>
              </Card>
            ))
          ) : (
            <Empty
              description="Chưa có lịch sử thai kỳ"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
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
        <p>Bạn có chắc chắn muốn kết thúc thai kỳ hiện tại không? Hành động này không thể hoàn tác.</p>
      </Modal>
    </div>
  );
}

export default Baby;