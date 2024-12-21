import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../Pages/Authentication/LandingPage";
import Dashboard from "../Layout/Dashboard";
import LoginPage from "../Pages/Authentication/LoginPage";
import RegisterPage from "../Pages/Authentication/RegisterPage";
import Sidebar from "../Layout/Sidebar";
import 'boxicons/css/boxicons.min.css';
import PancardVerificationPage from "../Pages/Verification/PancardVerificationPage";
import AadhaarVerificationPage from "../Pages/Verification/AadhaarVerificationPage";
import VoterVerificationPage from "../Pages/Verification/VoterVerificationPage";
import GSTVerificationPage from "../Pages/Verification/GSTVerificationPage";
import PanDetail from "../Pages/Verification/PanDetail";
import UdyamAadhaar from "../Pages/Verification/UdyamAadhaar";
import Cont from "../NewDash/Cont";
import PassportVerification from "../Pages/Verification/PassportVerification";

const RouteApp = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sidebar" element={<Sidebar />} />
          <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<Cont/>} /> 
              <Route path="pan" element={<PancardVerificationPage/>} />
              <Route path="aadhaar" element={<AadhaarVerificationPage/>}/>
              <Route path="voter" element={<VoterVerificationPage/>}/>
              <Route path="gst" element={<GSTVerificationPage/>}/>
              <Route path="pandetail" element={<PanDetail/>}/>
              <Route path="udyam" element={<UdyamAadhaar/>}/>
              <Route path="passport" element={<PassportVerification/>}/>
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default RouteApp;
