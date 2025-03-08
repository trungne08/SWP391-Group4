import { Routes, Route, Navigate } from "react-router-dom";  // Remove Router import
import Header from "./components/Header"; 
import Layout from "./layouts/Layouts";
import AdminLayout from "./layouts/AdminLayout";
import "./App.css";
import HomePage from "./pages/HomePage";
import Comunity from "./pages/Comunity";
import Blog from "./pages/Blog";
import Mom from "./pages/Mom";
import Baby from "./pages/Baby";
import FAQ from "./pages/FAQ";  
import Login from "./pages/Login";  
import ForgotPassword from "./pages/Forgot_password";  
import ContactUs from "./pages/ContactUs";  //
import AdminBlog from "./pages/AdminBlog";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMember from "./pages/AdminMember";
import FeePackage from "./pages/FeePackage";
import Payment from "./pages/Payment";
import Confirm from "./pages/Confirm";
import Profile from "./pages/Profile";
import Reminder from "./pages/Reminder";  // Add this import
import Register from "./pages/Register";  // Add this import
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';  // Add this import
import SubscriptionHistory from "./pages/SubscriptionHistory";

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <>
        <Routes>
          {/* Main routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/contact" element={<ContactUs />} /> 
            <Route path="comunity" element={<Comunity />} />
            <Route path="blog" element={<Blog />} />
            {/* <Route path="mom" element={<Mom />} /> */}
            <Route path="baby" element={<Baby />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="feepackage" element={<FeePackage />} />
            <Route path="payment" element={<Payment />} />
            <Route path="confirm" element={<Confirm />} />
            <Route path="subscription-history" element={
              <PrivateRoute>
                <SubscriptionHistory />
              </PrivateRoute>
            } />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />  {/* Add this route */}
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="profile" element={<Profile />} />
            <Route path="reminder" element={<Reminder />} />  {/* Add this route */}
          </Route>
          {/* Admin routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route index element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="dashboard" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="members" element={
              <AdminRoute>
                <AdminMember />
              </AdminRoute>
            } />
            <Route path="blog" element={
              <AdminRoute>
                <AdminBlog />
              </AdminRoute>
            } />
          </Route>
        </Routes>
      </>
    </AuthProvider>
  );
}

export default App;
