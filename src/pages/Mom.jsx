// import React from "react";
// import { Avatar, Typography, Row, Col, Table } from "antd";
// import { UserOutlined } from "@ant-design/icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faWeightScale,
//   faStethoscope,
//   faSyringe,
//   faBookOpen,
//   faComments,
//   faBell,
 
// } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

<<<<<<< HEAD
function Mom() {
  return (
    <div>Mom</div>
  )
}
=======
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title as ChartTitle,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   ChartTitle,
//   Tooltip,
//   Legend
// );


// const { Title } = Typography;

// function Baby() {
//   const navigate = useNavigate();
  
  
//   const columns = [
//     { title: "Lần khám", dataIndex: "lanKham", key: "lanKham" },
//     { title: "Thời điểm khám thai", dataIndex: "thoiDiem", key: "thoiDiem" }
//   ];

//   const data = [
//     { key: "1", lanKham: "Lần 1", thoiDiem: "Ngay sau khi thử que 2 vạch hoặc chậm kinh 1 tuần" },
//     { key: "2", lanKham: "Lần 2", thoiDiem: "Tuần 7 - 8" },
//     { key: "3", lanKham: "Lần 3", thoiDiem: "Tuần 11 tuần 5 ngày - 13 tuần 6 ngày" },
//     { key: "4", lanKham: "Lần 4", thoiDiem: "Tuần 16 - 18" },
//     { key: "5", lanKham: "Lần 5", thoiDiem: "Tuần 20 - 22" },
//     { key: "6", lanKham: "Lần 6", thoiDiem: "Tuần 24 - 28" },
//     { key: "7", lanKham: "Lần 7", thoiDiem: "Tuần 30 - 32" },
//     { key: "8", lanKham: "Lần 8", thoiDiem: "Tuần 33 - 40" }
//   ];

//   // Dữ liệu biểu đồ
  
  
//   const iconList = [
//     { icon: faWeightScale, label: "Cân nặng" },
//     { icon: faStethoscope, label: "Lịch khám thai" },
//     { icon: faSyringe, label: "Lịch tiêm chủng" },
//     { icon: faBookOpen, label: "Blog" },
//     { icon: faComments, label: "Com" },
//     { icon: faBell, label: "Tổng số bước đạp" },
//   ];

//   return (
//     <div
//       style={{
//         padding: 20,
//         boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
//         borderRadius: 10,
//         background: "#fff",
//       }}
//     >
// <Row gutter={[16, 16]} align="middle" justify="center">
//   {/* Cột 1: Avatar */}
//   <Col xs={24} md={4} className="text-center">
//     <Avatar size={100} icon={<UserOutlined />} />
//   </Col>

//   {/* Cột 2: Thông tin cơ bản */}
//   <Col xs={24} md={6}>
//     <Title level={4}>Mom Information</Title>
//     {[
//       { label: "Name", value: "[Insert Name]" },
//       { label: "Current Week of Pregnancy", value: "[Insert Week]" },
//       { label: "Baby's Birthday", value: "[Insert Date]" },
//       { label: "Estimated Due Date", value: "[Insert Date]" }
//     ].map((item, index) => (
//       <p key={index} className="info-text">
//         <strong>{item.label}:</strong> {item.value}
//       </p>
//     ))}
//   </Col>

//   {/* Cột 3: Thông tin liên hệ */}
//   <Col xs={24} md={6}>
//     <Title level={4} className="hidden-title">Contact Information</Title>
//     {[
//       { label: "Email", value: "[Insert Email]" },
//       { label: "Phone", value: "[Insert Phone]" },
//       { label: "Address", value: "[Insert Address]" }
//     ].map((item, index) => (
//       <p key={index} className="info-text">
//         <strong>{item.label}:</strong> {item.value}
//       </p>
//     ))}
//     <div className="button-group">
//       <button>Edit</button>
//       <button>Update</button>
//     </div>
//   </Col>

//   {/* Cột 4: Avatar */}
//   <Col xs={24} md={4} className="text-center">
//           <Avatar size={100} icon={<UserOutlined />} onClick={() => navigate("/baby")} style={{ cursor: "pointer" }} />
//         </Col>
// </Row>

//       {/* Đường kẻ ngang */}
//       <Col span={24}>
//         <hr style={{ border: "1px solid #ddd", margin: "10px 0" }} />
//       </Col>

//       {/* Cột 3: Các icon */}
//       <Col xs={24} md={24} style={{ width: "100%" }}>
//       <Row gutter={[16, 16]} justify="space-between" style={{ width: "100%" }}>
//         {iconList.map((item, index) => (
//           <Col
//             flex={1}
//             style={{ textAlign: "center", position: "relative" }}
//             key={index}
          
//           >
//             <div
//               style={{
//                 display: "inline-block",
//                 position: "relative",
//                 cursor: "pointer",
//               }}
//               onMouseEnter={(e) => {
//                 const icon = e.currentTarget.querySelector(".icon");
//                 const text = e.currentTarget.querySelector(".tooltip");
//                 icon.style.transform = "scale(1.2)";
//                 icon.style.color = "#a6a9ab";
//                 text.style.opacity = "1";
//                 text.style.visibility = "visible";
//               }}
//               onMouseLeave={(e) => {
//                 const icon = e.currentTarget.querySelector(".icon");
//                 const text = e.currentTarget.querySelector(".tooltip");
//                 icon.style.transform = "scale(1)";
//                 icon.style.color = "black";
//                 text.style.opacity = "0";
//                 text.style.visibility = "hidden";
//               }}
//             >
//               {/* Icon */}
//               <FontAwesomeIcon
//                 icon={item.icon}
//                 size="3x"
//                 className="icon"
//                 style={{
//                   transition: "transform 0.2s, color 0.2s",
//                 }}
//               />

//               {/* Tooltip hiển thị ngay trên icon */}
//               <span
//                 className="tooltip"
//                 style={{
//                   position: "absolute",
//                   top: "50%",
//                   left: "50%",
//                   transform: "translate(-50%, -50%)",
//                   background: "rgba(0, 0, 0, 0.8)",
//                   color: "white",
//                   padding: "5px 10px",
//                   borderRadius: "5px",
//                   fontSize: "14px",
//                   whiteSpace: "nowrap",
//                   opacity: 0,
//                   visibility: "hidden",
//                   transition: "opacity 0.2s ease",
//                 }}
//               >
//                 {item.label}
//               </span>
//             </div>
//           </Col>
//         ))}
//       </Row>
//     </Col>

//       {/* Đường kẻ ngang */}
//       <Col span={24}>
//         <hr style={{ border: "1px solid #ddd", margin: "20px 0" }} />
//       </Col>
//        {/* Bảng lịch khám thai */}
//        <Col xs={24} md={16} style={{ margin: "0 auto" }}>
//         <Title level={4} style={{ marginTop: "20px", textAlign: "center" }}>Lịch Khám Thai</Title>
//         <Table columns={columns} dataSource={data} pagination={false} bordered size="small" />
//       </Col>
    
//       {/* Đường kẻ ngang */}
//       <Col span={24}>
//         <hr style={{ border: "1px solid #ddd", margin: "10px 0" }} />
//       </Col>
 

//       {/* Đường kẻ ngang */}  
//       <Col span={24}>
//         <hr style={{ border: "1px solid #ddd", margin: "20px 0" }} />
//       </Col>
  
//     </div>
//   );
// }

// export default Baby;
>>>>>>> 9f8570a96ab593c5ce98f66e0f03343c1e48acfe
