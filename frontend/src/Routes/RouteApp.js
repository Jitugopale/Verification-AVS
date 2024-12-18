import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../Pages/Authentication/LandingPage";
import Dashboard from "../Layout/Dashboard";
import LoginPage from "../Pages/Authentication/LoginPage";
import RegisterPage from "../Pages/Authentication/RegisterPage";
import Sidebar from "../Layout/Sidebar";
import 'boxicons/css/boxicons.min.css';
import PancardVerificationPage from "../Pages/Verification/PancardVerificationPage";

const RouteApp = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sidebar" element={<Sidebar />} />
          <Route path="/pan" element={<PancardVerificationPage/>} />
        </Routes>
      </Router>
    </>
  );
};

export default RouteApp;
