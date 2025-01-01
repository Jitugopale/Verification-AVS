import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Register = () => {

  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup the timer
  }, []);

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bankName: "",
    noOfBranches: "",
    address: "",
    totalTurnover: "",
    state: "",
    email: "",
    projectOfficer: "",
    dateOfAdmission: "",
    registrationNo: "",
    contactPerson: "",
    mobile: "",
    district: "",
    taluka: "",
    pinCode: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/createUser", formData);

      if (response.status === 201) {
        setSuccess("Registration successful! Redirecting to login...");
        setError("");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(response.data.error || "Registration failed. Please try again.");
        setSuccess("");
      }
    } catch (error) {
      setError(
        error.response?.data?.error || "Network error. Please try again later."
      );
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <div>
        <div className="container mt-5">
      <h2 className="text-center mb-4">Client Master</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
      <div className="row">
  <div className="col-md-8 mb-3 d-flex flex-wrap align-items-center">
    <label
      htmlFor="bankName"
      className="mb-2 mb-md-0"
      style={{ width: "110px", minWidth: "110px" }}
    >
      Bank Name *
    </label>
    <input
      type="text"
      className="form-control"
      id="bankName"
      name="bankName"
      value={formData.bankName}
      onChange={handleChange}
      required
      style={{ flexGrow: 1 }}
    />
  </div>
  <div className="col-md-4 mb-3 d-flex flex-wrap align-items-center">
    <label
      htmlFor="dateOfAdmission"
      className="mb-2 mb-md-0"
      style={{ width: "220px", minWidth: "220px" }}
    >
      Date of Admission
    </label>
    <p id="dateOfAdmission" style={{ flexGrow: 1, marginTop: "8px" }}>
        {formatDate(currentDate)}
      </p>
  </div>
</div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="noOfBranches">No of Branches *</label>
            <input
              type="text"
              className="form-control"
              id="noOfBranches"
              name="noOfBranches"
              value={formData.noOfBranches}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="registrationNo">Bank Registration No *</label>
            <input
              type="text"
              className="form-control"
              id="registrationNo"
              name="registrationNo"
              value={formData.registrationNo}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="address">Address *</label>
            <textarea
              className="form-control"
              id="address"
              name="address"
              rows="2"
              value={formData.address}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="contactPerson">Contact Person Name *</label>
            <input
              type="text"
              className="form-control"
              id="contactPerson"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="totalTurnover">Total Turnover of Bank *</label>
            <input
              type="text"
              className="form-control"
              id="totalTurnover"
              name="totalTurnover"
              value={formData.totalTurnover}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="mobile">Mobile Number *</label>
            <input
              type="text"
              className="form-control"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label htmlFor="state">State *</label>
            {/* <select
              className="form-control"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            >
              <option value="">--Select--</option>
              <option value="State1">State 1</option>
              <option value="State2">State 2</option>
            </select> */}
            <input
              type="text"
              className="form-control"
              id="state"
              name="stae"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <label htmlFor="district">District *</label>
            <input
              type="text"
              className="form-control"
              id="district"
              name="district"
              value={formData.district}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <label htmlFor="taluka">Taluka *</label>
            <input
              type="text"
              className="form-control"
              id="taluka"
              name="taluka"
              value={formData.taluka}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="email">Email ID *</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="pinCode">Pin Code *</label>
            <input
              type="text"
              className="form-control"
              id="pinCode"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 mb-3">
            <label htmlFor="projectOfficer">Name Project Officer *</label>
            <select
              className="form-control"
              id="projectOfficer"
              name="projectOfficer"
              value={formData.projectOfficer}
              onChange={handleChange}
              required
            >
              <option value="">--Select--</option>
              <option value="Officer1">Officer 1</option>
              <option value="Officer2">Officer 2</option>
            </select>
          </div>
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Submitting..." : "Register"}
          </button>
          <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </form>
    </div>
        </div>
    </>
  );
};

export default Register;
