import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DashBoard from "./components/DashBoard";
import ViewLiveResultPage from "./pages/ResultPage";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashBoard/>} />
        <Route path="/results" element={<ViewLiveResultPage/>} />
      </Routes>
    </Router>
  )
};

export default App;