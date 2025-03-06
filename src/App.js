<<<<<<< HEAD
import { Routes, Route } from "react-router-dom";  // Remove BrowserRouter import
import Layout from "./layouts/Layouts";
import AdminLayout from "./layouts/AdminLayout";
import "./App.css";
import HomePage from "./pages/HomePage";
import Comunity from "./pages/Comunity";
import Blog from "./pages/Blog";
import Baby from "./pages/Baby";
import FAQ from "./pages/FAQ";  
import Login from "./pages/Login";  
import ForgotPassword from "./pages/Forgot_password";  
import ContactUs from "./pages/ContactUs";  //
=======
import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layouts";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/HomePage";
import Comunity from "./pages/Comunity";
import Blog from "./pages/Blog";
<<<<<<< Updated upstream
// import Mom from "./pages/Mom";
=======
>>>>>>> Stashed changes
import Baby from "./pages/Baby";
import FAQ from "./pages/FAQ";
>>>>>>> 9f8570a96ab593c5ce98f66e0f03343c1e48acfe
import AdminBlog from "./pages/AdminBlog";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMember from "./pages/AdminMember";
import FeePackage from "./pages/FeePackage";
import Payment from "./pages/Payment";
import Confirm from "./pages/Confirm";
<<<<<<< HEAD
import Profile from "./pages/Profile";
import Reminder from "./pages/Reminder";  // Add this import
import Register from "./pages/Register";  // Add this import


function App() {
  return (
    
    <Routes>
     
      {/* Main routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/contact" element={<ContactUs />} /> 
=======

function App() {
  return (
    <Routes>
      {/* Main routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
>>>>>>> 9f8570a96ab593c5ce98f66e0f03343c1e48acfe
        <Route path="comunity" element={<Comunity />} />
        <Route path="blog" element={<Blog />} />
        {/* <Route path="mom" element={<Mom />} /> */}
        <Route path="baby" element={<Baby />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="feepackage" element={<FeePackage />} />
<<<<<<< HEAD
        <Route path="payment" element={<Payment />} />
        <Route path="confirm" element={<Confirm />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />  {/* Add this route */}
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="profile" element={<Profile />} />
        <Route path="reminder" element={<Reminder />} />  {/* Add this route */}
      
      </Route>
=======
        <Route path="/payment" element={<Payment />} />
        <Route path="/confirm" element={<Confirm />} />
      </Route>

>>>>>>> 9f8570a96ab593c5ce98f66e0f03343c1e48acfe
      {/* Admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="members" element={<AdminMember />} />
        <Route path="blog" element={<AdminBlog />} />
      </Route>
    </Routes>
  );
}

export default App;
