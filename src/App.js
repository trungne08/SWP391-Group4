import { Routes, Route, Navigate } from "react-router-dom";  // Remove Router import
import Header from "./components/Header"; 
import Layout from "./layouts/Layouts";
import AdminLayout from "./layouts/AdminLayout";
import "./App.css";
import HomePage from "./pages/HomePage";
import Comunity from "./pages/Comunity";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";  // Add this import
import Mom from "./pages/Mom";
import Baby from "./pages/Baby";
import FAQ from "./pages/FAQ";  
import Login from "./pages/Login";  
import ForgotPassword from "./pages/Forgot_password";  
import ContactUs from "./pages/ContactUs";  //
import AdminBlog from "./pages/AdminBlog";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMember from "./pages/AdminMember";
import AdminMembership from "./pages/AdminMembership";  // Add this import at the top with other imports
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
import ChangePassword from "./pages/ChangePassword"; // Add this import
import Post from './pages/Post';  // Add this import

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
          <Route path="/" element={<Layout />}>
            {/* Public routes */}
            <Route index element={<HomePage />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />

            {/* Protected routes */}
            <Route path="contact" element={
              <PrivateRoute>
                <ContactUs />
              </PrivateRoute>
            } />
            <Route path="comunity" element={
              <PrivateRoute>
                <Comunity />
              </PrivateRoute>
            } />
            <Route path="comunity/post/:postId" element={
              <PrivateRoute>
                <Post />
              </PrivateRoute>
            } />
            <Route path="blog" element={
              <PrivateRoute>
                <Blog />
              </PrivateRoute>
            } />
            <Route path="blog/:blogId" element={
              <PrivateRoute>
                <BlogDetail />
              </PrivateRoute>
            } />
            <Route path="baby" element={
              <PrivateRoute>
                <Baby />
              </PrivateRoute>
            } />
            <Route path="faq" element={
              <PrivateRoute>
                <FAQ />
              </PrivateRoute>
            } />
            <Route path="feepackage" element={
              <PrivateRoute>
                <FeePackage />
              </PrivateRoute>
            } />
            <Route path="payment" element={
              <PrivateRoute>
                <Payment />
              </PrivateRoute>
            } />
            <Route path="confirm" element={
              <PrivateRoute>
                <Confirm />
              </PrivateRoute>
            } />
            <Route path="subscription-history" element={
              <PrivateRoute>
                <SubscriptionHistory />
              </PrivateRoute>
            } />
            <Route path="profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="change-password" element={
              <PrivateRoute>
                <ChangePassword />
              </PrivateRoute>
            } />
            <Route path="reminder" element={
              <PrivateRoute>
                <Reminder />
              </PrivateRoute>
            } />
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
            <Route path="membership" element={
              <AdminRoute>
                <AdminMembership />
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
