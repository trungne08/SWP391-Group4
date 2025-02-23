import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layouts";
import HomePage from "./pages/HomePage";
import Comunity from "./pages/Comunity";
import Blog from "./pages/Blog";
import Mom from "./pages/Mom";
import Baby from "./pages/Baby";
import FAQ from "./pages/FAQ";  
import Login from "./pages/Login";  
import ForgotPassword from "./pages/Forgot_password";  
import ContactUs from "./pages/ContactUs";  // Add this import

function App() {
  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/comunity" element={<Comunity />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/mom" element={<Mom />} />
          <Route path="/baby" element={<Baby />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/contact" element={<ContactUs />} />  {/* Add this route */}
        </Route>
      </Routes>
  );
}

export default App;
