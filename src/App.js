import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layouts";
import HomePage from "./pages/HomePage";
import About from "./pages/About";

function App() {
  return (

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route index element={<About/>} />
        </Route>
      </Routes>
 
  );
}

export default App;
