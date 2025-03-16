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
  Space,
  Form,
  InputNumber,
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
  const [standardData, setStandardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPregnancyActive, setIsPregnancyActive] = useState(true);
  const [isPregnancyListModalOpen, setIsPregnancyListModalOpen] =
    useState(false);
  const [isCreatePregnancyModalOpen, setIsCreatePregnancyModalOpen] =
    useState(false);
  const [isCreateFetusRecordModalOpen, setIsCreateFetusRecordModalOpen] =
    useState(false);
  const [fetusRecords, setFetusRecords] = useState([]);
  const [standards, setStandards] = useState(null);
  const [fetusChartData, setFetusChartData] = useState({});
  // Add these state declarations at the top with other states

  const [weightData, setWeightData] = useState({
    labels: [],
    datasets: [],
  });
  const [heightData, setHeightData] = useState({
    labels: [],
    datasets: [],
  });
  const [circumferenceData, setCircumferenceData] = useState({
    labels: [],
    datasets: [],
  });

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

  const handleUpdateStatus = async (pregnancyId, fetusId = null) => {
    try {
      // Update single fetus - change to CANCEL for miscarriage
      if (fetusId) {
        const response = await api.pregnancy.updatePregnancyStatus(
          pregnancyId,
          fetusId,
          "CANCEL" // Changed from ISSUE to CANCEL
        );
        if (response) {
          // Refresh data to show updated status
          const updatedPregnancy = await api.pregnancy.getOngoingPregnancy();
          if (updatedPregnancy) {
            setPregnancyData(updatedPregnancy);
            setIsPregnancyActive(true);
          }
        }
      }
      // Update entire pregnancy to COMPLETED
      else if (pregnancyId) {
        const response = await api.pregnancy.updatePregnancyStatus(
          pregnancyId,
          null,
          "COMPLETED"
        );
        if (response) {
          setIsPregnancyActive(false);
        }
      }

      // Refresh pregnancy history
      const historyResponse = await api.pregnancy.getUserPregnancies();
      if (Array.isArray(historyResponse)) {
        setPregnancyHistoryData(historyResponse);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      throw error; // Throw the error so it can be caught by the calling function
    }
  };

  const allFetusesCompleted = (pregnancies, pregnancyId) => {
    const pregnancy = pregnancies.find((p) => p.pregnancyId === pregnancyId);
    return (
      pregnancy?.fetuses?.every((fetus) => fetus.status === "COMPLETED") ??
      false
    );
  };

  const confirmEndPregnancy = async () => {
    if (pregnancyData?.pregnancyId) {
      await handleUpdateStatus(pregnancyData.pregnancyId);
    }
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

  const fetchPregnancyData = async () => {
    try {
      const response = await api.pregnancy.getOngoingPregnancy();
      if (response) {
        setPregnancyData(response);
        setSelectedWeek(response.gestationalWeeks || "");
        setSelectedDay(response.gestationalDays || "");
        setIsPregnancyActive(response.status !== "COMPLETED");
        if (response.fetuses && response.fetuses.length > 0) {
          setNumberOfFetuses(response.fetuses.length);
        }
      }
    } catch (error) {
      console.error("Error fetching pregnancy data:", error);
      message.error("Không thể lấy dữ liệu thai kỳ");
    }
  };

  const fetchPregnancyHistory = async () => {
    try {
      const response = await api.pregnancy.getUserPregnancies();
      if (Array.isArray(response)) {
        setPregnancyHistoryData(response);
      } else if (response) {
        setPregnancyHistoryData([response]);
      }
    } catch (error) {
      console.error("Error fetching pregnancy history:", error);
      message.error("Không thể lấy lịch sử thai kỳ");
    }
  };

  const handleFormSubmit = async () => {
    try {
      if (!pregnancyData?.pregnancyId) {
        throw new Error("Không tìm thấy ID thai kỳ");
      }

      if (!selectedWeek || !selectedDay || !formData.checkupDate) {
        message.error("Vui lòng nhập đầy đủ thông tin ngày khám và tuần thai");
        return;
      }

      const formattedDate = new Date(formData.checkupDate)
        .toISOString()
        .split("T")[0];

      // Create fetus record if measurements are provided
      if (formData.weight || formData.height || formData.circumference) {
        await api.fetus.createFetusRecord({
          fetusId: pregnancyData.fetuses[currentAvatar].fetusId,
          weight: parseFloat(formData.weight) || 0,
          height: parseFloat(formData.height) || 0,
          headCircumference: parseFloat(formData.circumference) || 0,
          examDate: formattedDate,
        });
      }

      const updateData = {
        examDate: formattedDate,
        gestationalWeeks: parseInt(selectedWeek),
        gestationalDays: parseInt(selectedDay),
        totalFetuses: parseInt(pregnancyData.totalFetuses || 1),
      };

      // Send update request
      await api.pregnancy.updatePregnancy(
        pregnancyData.pregnancyId,
        updateData
      );

      // Refresh all data
      await fetchPregnancyData();
      await fetchPregnancyHistory();

      message.success("Cập nhật thành công");
      setIsModalOpen(false);
      setFormData({
        weight: "",
        height: "",
        circumference: "",
        checkupDate: "",
      });
      setSelectedWeek("");
      setSelectedDay("");
    } catch (error) {
      console.error("Update error:", error);
      message.error("Cập nhật thất bại: " + error.message);
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
    {
      icon: faList,
      label: "Danh sách thai kì",
      onClick: handlePregnancyListClick,
    },
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

        // First fetch pregnancy data
        const response = await api.pregnancy.getOngoingPregnancy();
        console.log("Ongoing pregnancy response:", response);

        if (response) {
          setPregnancyData(response);
          setSelectedWeek(response.gestationalWeeks || "");
          setSelectedDay(response.gestationalDays || "");
          setIsPregnancyActive(response.status !== "COMPLETED");

          // If there are fetuses, update the number of fetuses
          if (response.fetuses && response.fetuses.length > 0) {
            setNumberOfFetuses(response.fetuses.length);
          }
        }

        // Then fetch pregnancy history
        const historyResponse = await api.pregnancy.getUserPregnancies();
        console.log("Pregnancy history response:", historyResponse);

        if (Array.isArray(historyResponse)) {
          setPregnancyHistoryData(historyResponse);
        } else if (historyResponse) {
          setPregnancyHistoryData([historyResponse]);
        }
      } catch (error) {
        console.error("Error fetching pregnancy data:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại");
          localStorage.clear();
          navigate("/login", { state: { from: "/baby" } });
        } else {
          setError("Không thể lấy dữ liệu thai kỳ");
          message.error("Không thể lấy dữ liệu thai kỳ");
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

  useEffect(() => {
    const fetchFetusRecords = async () => {
      if (pregnancyData?.fetuses) {
        try {
          // Fetch records for all fetuses
          const allRecordsPromises = pregnancyData.fetuses.map(async (fetus) => {
            console.log("Fetching for fetusId:", fetus.fetusId);
            const records = await api.fetus.getFetusMeasurements(fetus.fetusId);
            return { fetusId: fetus.fetusId, records };
          });

          const allRecordsResults = await Promise.all(allRecordsPromises);
          console.log("All fetuses raw data:", allRecordsResults);

          // Transform and combine all records
          const allTransformedRecords = allRecordsResults.flatMap(
            ({ fetusId, records }) => {
              if (!records || !Array.isArray(records)) {
                console.error("Invalid records format for fetusId:", fetusId);
                return [];
              }

              return records.map((record, index) => ({
                key: `${fetusId}-${index}`,
                fetusId: fetusId,
                week: record.week,
                fetalWeight: record.fetalWeight,
                femurLength: record.femurLength,
                headCircumference: record.headCircumference,
              }));
            }
          );

          console.log("All transformed records:", allTransformedRecords);
          setFetusRecords(allTransformedRecords);
        } catch (error) {
          console.error("Error fetching fetus records:", error);
          message.error("Không thể lấy dữ liệu đo lường thai nhi");
          setFetusRecords([]);
        }
      } else {
        console.log("No pregnancy data available");
        setFetusRecords([]);
      }
    };

    fetchFetusRecords();
  }, [pregnancyData]);

  useEffect(() => {
    const fetchStandards = async () => {
      if (pregnancyData?.totalFetuses) {
        try {
          const standardsData = await api.standards.getPregnancyStandards(
            pregnancyData.totalFetuses
          );
          console.log("Fetched standards:", standardsData);
          setStandards(standardsData);
        } catch (error) {
          console.error("Error fetching standards:", error);
          message.error("Không thể lấy dữ liệu tiêu chuẩn");
        }
      }
    };

    fetchStandards();
  }, [pregnancyData?.totalFetuses]);

  useEffect(() => {
    if (standards && fetusRecords.length > 0) {
      const newFetusChartData = {};

      pregnancyData?.fetuses?.forEach((fetus, index) => {
        const currentFetusRecords = fetusRecords.filter(
          (record) => record.fetusId === fetus.fetusId
        );

        const weeks = [
          ...new Set([
            ...currentFetusRecords.map((r) => r.week),
            ...standards.map((s) => s.week),
          ]),
        ].sort((a, b) => a - b);

        newFetusChartData[fetus.fetusId] = {
          weightData: {
            labels: weeks,
            datasets: [
              {
                label: `Cân nặng thực tế - Thai ${String.fromCharCode(
                  65 + index
                )}`,
                data: weeks.map((week) => {
                  const record = currentFetusRecords.find((r) => r.week === week);
                  return record ? parseFloat(record.fetalWeight) : null;
                }),
                borderColor: "#1890ff",
                backgroundColor: "rgba(24, 144, 255, 0.1)",
                fill: false,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
              },
              {
                label: "Tiêu chuẩn",
                data: weeks.map((week) => {
                  const standard = standards.find((s) => s.week === week);
                  return standard ? parseFloat(standard.avgWeight) : null;
                }),
                borderColor: "#52c41a",
                borderDash: [5, 5],
                fill: false,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
              },
              {
                label: "Giới hạn trên",
                data: weeks.map((week) => {
                  const standard = standards.find((s) => s.week === week);
                  return standard ? parseFloat(standard.maxWeight) : null;
                }),
                borderColor: "#ff4d4f",
                borderDash: [2, 2],
                fill: false,
                tension: 0.4,
                pointRadius: 0,
              },
              {
                label: "Giới hạn dưới",
                data: weeks.map((week) => {
                  const standard = standards.find((s) => s.week === week);
                  return standard ? parseFloat(standard.minWeight) : null;
                }),
                borderColor: "#ff4d4f",
                borderDash: [2, 2],
                fill: false,
                tension: 0.4,
                pointRadius: 0,
              },
            ],
          },
          heightData: {
            labels: weeks,
            datasets: [
              {
                label: `Chiều dài thực tế - Thai ${String.fromCharCode(
                  65 + index
                )}`,
                data: weeks.map((week) => {
                  const record = currentFetusRecords.find(
                    (r) => r.week === week
                  );
                  return record ? parseFloat(record.femurLength) : null;
                }),
                borderColor: "#1890ff",
                backgroundColor: "rgba(24, 144, 255, 0.1)",
                fill: false,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
              },
              {
                label: "Tiêu chuẩn",
                data: weeks.map((week) => {
                  const standard = standards.find((s) => s.week === week);
                  return standard ? parseFloat(standard.avgLength) : null;
                }),
                borderColor: "#52c41a",
                borderDash: [5, 5],
                fill: false,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
              },
              {
                label: "Giới hạn trên",
                data: weeks.map((week) => {
                  const standard = standards.find((s) => s.week === week);
                  return standard ? parseFloat(standard.maxLength) : null;
                }),
                borderColor: "#ff4d4f",
                borderDash: [2, 2],
                fill: false,
                tension: 0.4,
                pointRadius: 0,
              },
              {
                label: "Giới hạn dưới",
                data: weeks.map((week) => {
                  const standard = standards.find((s) => s.week === week);
                  return standard ? parseFloat(standard.minLength) : null;
                }),
                borderColor: "#ff4d4f",
                borderDash: [2, 2],
                fill: false,
                tension: 0.4,
                pointRadius: 0,
              },
            ],
          },
          circumferenceData: {
            labels: weeks,
            datasets: [
              {
                label: `Chu vi đầu thực tế - Thai ${String.fromCharCode(
                  65 + index
                )}`,
                data: weeks.map((week) => {
                  const record = currentFetusRecords.find(
                    (r) => r.week === week
                  );
                  return record ? parseFloat(record.headCircumference) : null;
                }),
                borderColor: "#1890ff",
                backgroundColor: "rgba(24, 144, 255, 0.1)",
                fill: false,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
              },
              {
                label: "Tiêu chuẩn",
                data: weeks.map((week) => {
                  const standard = standards.find((s) => s.week === week);
                  return standard
                    ? parseFloat(standard.avgHeadCircumference)
                    : null;
                }),
                borderColor: "#52c41a",
                borderDash: [5, 5],
                fill: false,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
              },
              {
                label: "Giới hạn trên",
                data: weeks.map((week) => {
                  const standard = standards.find((s) => s.week === week);
                  return standard
                    ? parseFloat(standard.maxHeadCircumference)
                    : null;
                }),
                borderColor: "#ff4d4f",
                borderDash: [2, 2],
                fill: false,
                tension: 0.4,
                pointRadius: 0,
              },
              {
                label: "Giới hạn dưới",
                data: weeks.map((week) => {
                  const standard = standards.find((s) => s.week === week);
                  return standard
                    ? parseFloat(standard.minHeadCircumference)
                    : null;
                }),
                borderColor: "#ff4d4f",
                borderDash: [2, 2],
                fill: false,
                tension: 0.4,
                pointRadius: 0,
              },
            ],
          },
        };
      });

      setFetusChartData(newFetusChartData);
    }
  }, [standards, fetusRecords, pregnancyData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,  // This allows the chart to fill its container
    plugins: {
      legend: {
        position: "top",
        align: "start",
        labels: {
          padding: 20,
          boxWidth: 40,
        }
      },
      title: {
        display: true,
        text: "So sánh với tiêu chuẩn",
        padding: 20,
        font: {
          size: 16
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          drawBorder: true,
        },
        title: {
          display: true,
          text: "Tuần thai",
          font: {
            size: 14
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          drawBorder: true,
        },
        title: {
          display: true,
          text: "Giá trị đo lường",
          font: {
            size: 14
          }
        }
      }
    }
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
              <div style={{ width: 120 }}>
                {pregnancyData?.totalFetuses === 1
                  ? "Đơn thai"
                  : pregnancyData?.totalFetuses === 2
                    ? "Song thai"
                    : pregnancyData?.totalFetuses > 2
                      ? `${pregnancyData.totalFetuses} thai`
                      : "Chưa có thông tin"}
              </div>
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
                />
              )}
              {[...Array(numberOfFetuses)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Avatar
                      size={100}
                      style={{
                        cursor: "pointer",
                        border:
                          currentAvatar === index
                            ? "2px solid #1890ff"
                            : "none",
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
                        Thai nhi {String.fromCharCode(65 + index)}
                      </Title>
                    </div>
                    {pregnancyData?.fetuses && pregnancyData.fetuses[index] && (
                      <Space direction="vertical" size="small">
                        {numberOfFetuses > 1 &&
                          pregnancyData.status === "ONGOING" &&
                          pregnancyData.fetuses[index].status === "ACTIVE" && (
                            <Button
                              type="primary"
                              danger
                              size="small"
                              onClick={() => {
                                Modal.confirm({
                                  title: `Xác nhận kết thúc thai nhi ${String.fromCharCode(
                                    65 + index
                                  )}`,
                                  content:
                                    "Bạn có chắc chắn muốn kết thúc thai nhi này không? Hành động này không thể hoàn tác.",
                                  okText: "Xác nhận",
                                  cancelText: "Hủy",
                                  onOk: async () => {
                                    try {
                                      await handleUpdateStatus(
                                        pregnancyData.pregnancyId,
                                        pregnancyData.fetuses[index].fetusId
                                      );
                                      message.success(
                                        `Đã kết thúc thai nhi ${String.fromCharCode(
                                          65 + index
                                        )} thành công`
                                      );
                                    } catch (error) {
                                      message.error(
                                        "Không thể kết thúc thai nhi"
                                      );
                                    }
                                  },
                                });
                              }}
                            >
                              Kết thúc thai {String.fromCharCode(65 + index)}
                            </Button>
                          )}
                        <Tag
                          color={
                            pregnancyData.fetuses[index].status === "ISSUE"
                              ? "error"
                              : pregnancyData.fetuses[index].status === "CANCEL"
                                ? "default"
                                : pregnancyData.fetuses[index].status ===
                                  "COMPLETED"
                                  ? "success"
                                  : "processing"
                          }
                        >
                          {pregnancyData.fetuses[index].status === "ISSUE"
                            ? "Có vấn đề"
                            : pregnancyData.fetuses[index].status === "CANCEL"
                              ? "Đã sảy thai"
                              : pregnancyData.fetuses[index].status ===
                                "COMPLETED"
                                ? "Đã hoàn thành"
                                : "Đang phát triển"}
                        </Tag>
                      </Space>
                    )}
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
                />
              )}
            </div>
          </div>
        </Col>
      </Row>

      <Col span={24}>
        <hr style={{ border: "1px solid #ddd", margin: "10px 0" }} />
      </Col>

      {/* Add this new section for the records table */}
      {/* Replace the single table with multiple tables based on number of fetuses */}
      {pregnancyData?.fetuses?.map((fetus, index) => (
        <Col
          span={20}
          offset={2}
          style={{ marginBottom: "20px" }}
          key={fetus.fetusId}
        >
          <Card
            title={`Lịch sử đo lường thai nhi ${String.fromCharCode(
              65 + index
            )}`}
            extra={
              <Tag
                color={
                  fetus.status === "ISSUE"
                    ? "error"
                    : fetus.status === "CANCEL"
                      ? "default"
                      : fetus.status === "COMPLETED"
                        ? "success"
                        : "processing"
                }
              >
                {fetus.status === "ISSUE"
                  ? "Có vấn đề"
                  : fetus.status === "CANCEL"
                    ? "Đã sảy thai"
                    : fetus.status === "COMPLETED"
                      ? "Đã hoàn thành"
                      : "Đang phát triển"}
              </Tag>
            }
          >
            <Table
              dataSource={fetusRecords.filter(
                (record) => record.fetusId === fetus.fetusId
              )}
              columns={[
                {
                  title: "Tuần thai",
                  dataIndex: "week",
                  key: "week",
                  sorter: (a, b) => a.week - b.week,
                  render: (weeks) => (weeks ? `${weeks} ` : "N/A"),
                },
                {
                  title: "Cân nặng (g)",
                  dataIndex: "fetalWeight",
                  key: "fetalWeight",
                  render: (value) => value?.toFixed(1) || "N/A",
                  sorter: (a, b) => (a.fetalWeight || 0) - (b.fetalWeight || 0),
                },
                {
                  title: "Chiều dài (cm)",
                  dataIndex: "femurLength",
                  key: "femurLength",
                  render: (value) => value?.toFixed(1) || "N/A",
                  sorter: (a, b) => (a.femurLength || 0) - (b.femurLength || 0),
                },
                {
                  title: "Chu vi đầu (mm)",
                  dataIndex: "headCircumference",
                  key: "headCircumference",
                  render: (value) => value?.toFixed(1) || "N/A",
                  sorter: (a, b) =>
                    (a.headCircumference || 0) - (b.headCircumference || 0),
                },
              ]}
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Col>
      ))}

      <Col span={24}>
        <hr style={{ border: "1px solid #ddd", margin: "20px 0" }} />
      </Col>

      <Modal
        title="Tạo thai kỳ mới"
        open={isCreatePregnancyModalOpen}
        onCancel={() => setIsCreatePregnancyModalOpen(false)}
        footer={null}
      >
        <Form
          onFinish={async (values) => {
            try {
              const response = await api.pregnancy.createPregnancy({
                gestationalWeeks: parseInt(values.gestationalWeeks),
                gestationalDays: parseInt(values.gestationalDays),
                totalFetuses: parseInt(values.totalFetuses),
                examDate: new Date().toISOString().split("T")[0],
              });
              if (response) {
                message.success("Tạo thai kỳ thành công");
                setIsCreatePregnancyModalOpen(false);
                fetchPregnancyData();
              }
            } catch (error) {
              console.error("Create pregnancy error:", error);
              message.error(
                "Không thể tạo thai kỳ: " +
                (error.response?.data?.message || error.message)
              );
            }
          }}
        >
          <Form.Item
            label="Số tuần thai"
            name="gestationalWeeks"
            rules={[{ required: true, message: "Vui lòng nhập số tuần thai" }]}
          >
            <InputNumber min={1} max={40} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Số ngày thai"
            name="gestationalDays"
            rules={[{ required: true, message: "Vui lòng nhập số ngày thai" }]}
          >
            <InputNumber min={0} max={6} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Số thai"
            name="totalFetuses"
            rules={[{ required: true, message: "Vui lòng nhập số thai" }]}
          >
            <InputNumber min={1} max={3} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Ngày khám"
            name="examDate"
            rules={[{ required: true, message: "Vui lòng chọn ngày khám" }]}
          >
            <Input type="date" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Tạo thai kỳ
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Tạo bản ghi thai nhi"
        open={isCreateFetusRecordModalOpen}
        onCancel={() => setIsCreateFetusRecordModalOpen(false)}
        footer={null}
      >
        <Form
          onFinish={async (values) => {
            try {
              // Handle both fetuses if multiple fetuses exist
              const promises = [];

              // First fetus (always exists)
              const firstFetusData = {
                fetalWeight: `${values.weight1 || 0}`,
                femurLength: `${values.height1 || 0}`,
                headCircumference: `${values.headCircumference1 || 0}`,
                examDate: pregnancyData.examDate,
                gestationalWeeks: pregnancyData.gestationalWeeks,
                gestationalDays: pregnancyData.gestationalDays,
              };
              promises.push(
                api.fetus.createFetusRecord(
                  pregnancyData.fetuses[0].fetusId,
                  firstFetusData
                )
              );

              // Second fetus (if exists)
              if (pregnancyData?.fetuses?.length > 1 && values.weight2) {
                const secondFetusData = {
                  fetalWeight: `${values.weight2 || 0}`,
                  femurLength: `${values.height2 || 0}`,
                  headCircumference: `${values.headCircumference2 || 0}`,
                  examDate: pregnancyData.examDate,
                  gestationalWeeks: pregnancyData.gestationalWeeks,
                  gestationalDays: pregnancyData.gestationalDays,
                };
                promises.push(
                  api.fetus.createFetusRecord(
                    pregnancyData.fetuses[1].fetusId,
                    secondFetusData
                  )
                );
              }

              await Promise.all(promises);
              message.success("Tạo bản ghi thai nhi thành công");
              setIsCreateFetusRecordModalOpen(false);
              fetchPregnancyData();
            } catch (error) {
              console.error("Create fetus record error:", error);
              message.error("Không thể tạo bản ghi thai nhi: " + error.message);
            }
          }}
        >
          {/* First Fetus Form */}
          <Card title={`Thai A`} style={{ marginBottom: 16 }}>
            <Form.Item
              label="Cân nặng (g)"
              name="weight1"
              rules={[{ required: true, message: "Vui lòng nhập cân nặng" }]}
            >
              <InputNumber
                min={0}
                step={0.1}
                precision={1}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="Chiều dài (cm)"
              name="height1"
              rules={[{ required: true, message: "Vui lòng nhập chiều dài" }]}
            >
              <InputNumber
                min={0}
                step={0.1}
                precision={1}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="Chu vi đầu (mm)"
              name="headCircumference1"
              rules={[{ required: true, message: "Vui lòng nhập chu vi đầu" }]}
            >
              <InputNumber
                min={0}
                step={0.1}
                precision={1}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Card>

          {/* Second Fetus Form (only show if multiple fetuses) */}
          {pregnancyData?.fetuses?.length > 1 && (
            <Card title={`Thai B`} style={{ marginBottom: 16 }}>
              <Form.Item
                label="Cân nặng (g)"
                name="weight2"
                rules={[{ required: true, message: "Vui lòng nhập cân nặng" }]}
              >
                <InputNumber
                  min={0}
                  step={0.1}
                  precision={1}
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                label="Chiều dài (cm)"
                name="height2"
                rules={[{ required: true, message: "Vui lòng nhập chiều dài" }]}
              >
                <InputNumber
                  min={0}
                  step={0.1}
                  precision={1}
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                label="Chu vi đầu (mm)"
                name="headCircumference2"
                rules={[
                  { required: true, message: "Vui lòng nhập chu vi đầu" },
                ]}
              >
                <InputNumber
                  min={0}
                  step={0.1}
                  precision={1}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Card>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Tạo bản ghi
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {!pregnancyData ? (
        <Row justify="center" align="middle" style={{ minHeight: "30vh" }}>
          <Col>
            <Result
              icon={<UserOutlined />}
              title="Bạn chưa có thai kỳ nào đang theo dõi"
              subTitle="Hãy tạo một thai kỳ mới để bắt đầu theo dõi"
              extra={
                <Button
                  type="primary"
                  size="large"
                  onClick={() => setIsCreatePregnancyModalOpen(true)}
                >
                  Tạo thai kỳ mới
                </Button>
              }
            />
          </Col>
        </Row>
      ) : (
        <>
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

          <div
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <Button
              type="primary"
              onClick={() => setIsModalOpen(true)}
              style={{ marginTop: "10px" }}
            >
              Nhập số liệu của em bé
            </Button>
            <Button
              type="primary"
              onClick={() => setIsCreateFetusRecordModalOpen(true)}
              style={{ marginTop: "10px" }}
            >
              Tạo bản ghi thai nhi
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
                  title: "Thai sống trong tử cung",
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

          {/* Weight Charts */}
          <Row>
            {pregnancyData?.fetuses?.map((fetus, index) => (
              <Col
                span={20}
                offset={2}
                style={{ marginBottom: "20px" }}
                key={`weight-${fetus.fetusId}`}
              >
                <Card
                  title={`Biểu đồ cân nặng - Thai ${String.fromCharCode(65 + index)}`}
                  style={{ width: '100%' }}
                >
                  <div style={{ height: '600px', width: '100%' }}>
                    {fetusChartData[fetus.fetusId]?.weightData ? (
                      <Line
                        data={fetusChartData[fetus.fetusId].weightData}
                        options={chartOptions}
                      />
                    ) : (
                      <div>Loading...</div>
                    )}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Height Charts */}
          <Row>
            {pregnancyData?.fetuses?.map((fetus, index) => (
              <Col
                span={20}
                offset={2}
                style={{ marginBottom: "20px" }}
                key={`height-${fetus.fetusId}`}
              >
                <Card
                  title={`Biểu đồ chiều dài - Thai ${String.fromCharCode(65 + index)}`}
                  style={{ width: '100%' }}
                >
                  <div style={{ height: '600px', width: '100%' }}>
                    {fetusChartData[fetus.fetusId]?.heightData ? (
                      <Line
                        data={fetusChartData[fetus.fetusId].heightData}
                        options={chartOptions}
                      />
                    ) : (
                      <div>Loading...</div>
                    )}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Head Circumference Charts */}
          <Row>
            {pregnancyData?.fetuses?.map((fetus, index) => (
              <Col
                span={20}
                offset={2}
                style={{ marginBottom: "20px" }}
                key={`circumference-${fetus.fetusId}`}
              >
                <Card
                  title={`Biểu đồ chu vi đầu - Thai ${String.fromCharCode(65 + index)}`}
                  style={{ width: '100%' }}
                >
                  <div style={{ height: '600px', width: '100%' }}>
                    {fetusChartData[fetus.fetusId]?.circumferenceData ? (
                      <Line
                        data={fetusChartData[fetus.fetusId].circumferenceData}
                        options={chartOptions}
                      />
                    ) : (
                      <div>Loading...</div>
                    )}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

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
                    title={`Thai kỳ thứ ${index + 1} - Trạng thái: ${pregnancy.status === "ONGOING"
                        ? "Đang mang thai"
                        : "Đã kết thúc"
                      }`}
                    style={{ marginBottom: 16 }}
                    extra={
                      pregnancy.status === "ONGOING" && (
                        <Space>
                          {pregnancy.fetuses?.length > 1 ? (
                            <Button
                              type="primary"
                              danger
                              onClick={() => {
                                Modal.confirm({
                                  title: "Xác nhận kết thúc toàn bộ thai kỳ",
                                  content:
                                    "Bạn có chắc chắn muốn kết thúc toàn bộ thai kỳ này không? Hành động này không thể hoàn tác.",
                                  okText: "Xác nhận",
                                  cancelText: "Hủy",
                                  onOk: () =>
                                    handleUpdateStatus(pregnancy.pregnancyId),
                                });
                              }}
                            >
                              Kết thúc toàn bộ thai kỳ
                            </Button>
                          ) : (
                            <Button
                              type="primary"
                              danger
                              onClick={() => {
                                Modal.confirm({
                                  title: "Xác nhận kết thúc thai kỳ",
                                  content:
                                    "Bạn có chắc chắn muốn kết thúc thai kỳ này không? Hành động này không thể hoàn tác.",
                                  okText: "Xác nhận",
                                  cancelText: "Hủy",
                                  onOk: () =>
                                    handleUpdateStatus(pregnancy.pregnancyId),
                                });
                              }}
                            >
                              Kết thúc thai kỳ
                            </Button>
                          )}
                        </Space>
                      )
                    }
                  >
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <p>
                          <strong>Ngày bắt đầu:</strong>{" "}
                          {pregnancy.startDate
                            ? new Date(pregnancy.startDate).toLocaleDateString(
                              "vi-VN"
                            )
                            : "Chưa có"}
                        </p>
                        <p>
                          <strong>Ngày dự sinh:</strong>{" "}
                          {pregnancy.dueDate
                            ? new Date(pregnancy.dueDate).toLocaleDateString(
                              "vi-VN"
                            )
                            : "Chưa có"}
                        </p>
                        <p>
                          <strong>Ngày khám gần nhất:</strong>{" "}
                          {pregnancy.examDate
                            ? new Date(pregnancy.examDate).toLocaleDateString(
                              "vi-VN"
                            )
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
                          <strong>Số thai:</strong>{" "}
                          {pregnancy.totalFetuses || 1}
                        </p>
                        <p>
                          <strong>Trạng thái:</strong>{" "}
                          <Tag
                            color={
                              pregnancy.status === "ONGOING"
                                ? "processing"
                                : pregnancy.status === "COMPLETED"
                                  ? "success"
                                  : "default"
                            }
                          >
                            {pregnancy.status === "ONGOING"
                              ? "Đang mang thai"
                              : pregnancy.status === "COMPLETED"
                                ? "Đã hoàn thành"
                                : "Đã kết thúc"}
                          </Tag>
                        </p>
                      </Col>
                    </Row>
                    {pregnancy?.fetuses && pregnancy.fetuses.length > 0 && (
                      <>
                        <Divider>Thông tin thai nhi</Divider>
                        <Row gutter={[16, 16]}>
                          {pregnancy.fetuses.map((fetus, idx) => (
                            <Col span={24} key={fetus.fetusId || idx}>
                              <Card
                                type="inner"
                                title={`Thai nhi ${String.fromCharCode(
                                  65 + idx
                                )}`}
                                extra={
                                  pregnancy.status === "ONGOING" &&
                                  fetus.status === "ACTIVE" && (
                                    <Button
                                      type="primary"
                                      danger
                                      size="small"
                                      onClick={() => {
                                        Modal.confirm({
                                          title: `Xác nhận kết thúc thai nhi ${String.fromCharCode(
                                            65 + idx
                                          )}`,
                                          content:
                                            "Bạn có chắc chắn muốn kết thúc thai nhi này không? Hành động này không thể hoàn tác.",
                                          okText: "Xác nhận",
                                          cancelText: "Hủy",
                                          onOk: async () => {
                                            try {
                                              await api.pregnancy.updatePregnancyStatus(
                                                pregnancy.pregnancyId,
                                                fetus.fetusId,
                                                "CANCEL"
                                              );
                                              message.success(
                                                `Đã kết thúc thai nhi ${String.fromCharCode(
                                                  65 + idx
                                                )}`
                                              );
                                              await fetchPregnancyData();
                                              await fetchPregnancyHistory();
                                            } catch (error) {
                                              console.error(
                                                "Error updating fetus status:",
                                                error
                                              );
                                              message.error(
                                                "Không thể kết thúc thai nhi"
                                              );
                                            }
                                          },
                                        });
                                      }}
                                    >
                                      Kết thúc thai nhi{" "}
                                      {String.fromCharCode(65 + idx)}
                                    </Button>
                                  )
                                }
                              >
                                <Row gutter={[16, 8]}>
                                  <Col span={24} style={{ marginBottom: 16 }}>
                                    <Tag
                                      color={
                                        fetus.status === "ISSUE"
                                          ? "error"
                                          : fetus.status === "CANCEL"
                                            ? "default"
                                            : fetus.status === "COMPLETED"
                                              ? "success"
                                              : "processing"
                                      }
                                    >
                                      {fetus.status === "ISSUE"
                                        ? "Có vấn đề"
                                        : fetus.status === "CANCEL"
                                          ? "Đã sảy thai"
                                          : fetus.status === "COMPLETED"
                                            ? "Đã hoàn thành"
                                            : "Đang phát triển"}
                                    </Tag>
                                  </Col>
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
            <p>
              Bạn có chắc chắn muốn kết thúc thai kỳ hiện tại không? Hành động
              này không thể hoàn tác.
            </p>
          </Modal>
        </>
      )}
    </div>
  );
}

export default Baby;
