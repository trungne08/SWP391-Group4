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
import AdminBlog from "./pages/AdminBlog";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMember from "./pages/AdminMember";
import FeePackage from "./pages/FeePackage";
import Payment from "./pages/Payment";
import Confirm from "./pages/Confirm";

function App() {
  return (
    <Routes>
      {/* Main routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="comunity" element={<Comunity />} />
        <Route path="blog" element={<Blog />} />
        {/* <Route path="mom" element={<Mom />} /> */}
        <Route path="baby" element={<Baby />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="feepackage" element={<FeePackage />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/confirm" element={<Confirm />} />
      </Route>

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
