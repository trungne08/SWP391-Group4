import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layouts";
import HomePage from "./pages/HomePage";
import Comunity from "./pages/Comunity";
import Blog from "./pages/Blog";
import Mom from "./pages/Mom";
import Baby from "./pages/Baby";
import FAQ from "./pages/FAQ";  

function App() {
  return (

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route  path="/comunity" index element={<Comunity />} />
          <Route  path="/blog" index element={<Blog />} />
          <Route  path="/mom" index element={<Mom />} />
          <Route  path="/baby" index element={<Baby />} />
          <Route  path="/faq" index element={<FAQ />} />
         
        </Route>
      </Routes>
 
  );
}

export default App;
