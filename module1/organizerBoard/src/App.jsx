import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DashBoard from "./components/DashBoard";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashBoard/>} />
      </Routes>
    </Router>
  )
};

export default App;