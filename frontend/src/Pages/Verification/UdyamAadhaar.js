import React, { useState } from 'react';
import axios from 'axios';

const UdyamAadhaar = () => {
  const [udyamAadhaar, setUdyamAadhaar] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!udyamAadhaar) {
      setError('Udyam Aadhaar number is required');
      return;
    }

    setLoading(true);
    setError('');
    setResponseData(null);

    try {
      // API call to your backend with the correct variable name in the payload
      const res = await axios.post('http://localhost:5000/api/udyam/udyam_aadhaar_verify', { udyam_aadhaar: udyamAadhaar });
      setResponseData(res.data);  // Store the response data in state
    } catch (err) {
      // Displaying detailed error if available
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="card shadow p-3" style={{ width: '500px' }}>
          <h1 className="card-title">Udyam Aadhaar Verification</h1>
          <p className="card-text">
            Securely verify Udyam Aadhaar information online with ease and reliability.
          </p>
          <div className="mb-3">
            <label htmlFor="udyam_aadhaar" className="form-label">Enter Udyam Aadhaar Number</label>
            <input
              type="text"
              className="form-control"
              id="udyam_aadhaar"
              value={udyamAadhaar}
              onChange={(e) => setUdyamAadhaar(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleVerify} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>

          {/* Show error if any */}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
      </div>

      {/* Show response data below the card */}
      {responseData && (
        <div className="container mt-4">
          <h3>Verification Result</h3>
          <div className="card shadow p-3">
            <p><strong>Status:</strong> {responseData.status ? 'Verified' : 'Not Verified'}</p>
            <p><strong>Document ID:</strong> {responseData?.verifiedData?.data?.enterprise_data?.document_id}</p>
            <p><strong>Enterprise Name:</strong> {responseData?.verifiedData?.data?.enterprise_data?.name}</p>
            <p><strong>Business Type:</strong> {responseData?.verifiedData?.data?.enterprise_data?.enterprise_type}</p>
            <p><strong>Major Activity:</strong> {responseData?.verifiedData?.data?.enterprise_data?.major_activity}</p>
            <p><strong>Mobile:</strong> {responseData?.verifiedData?.data?.enterprise_data?.mobile}</p>
            <p><strong>Email:</strong> {responseData?.verifiedData?.data?.enterprise_data?.email}</p>
            <p><strong>Address:</strong> {responseData?.verifiedData?.data?.enterprise_data?.address?.door_no}, {responseData?.verifiedData?.data?.enterprise_data?.address?.building}, {responseData?.verifiedData?.data?.enterprise_data?.address?.area}, {responseData?.verifiedData?.data?.enterprise_data?.address?.city}, {responseData?.verifiedData?.data?.enterprise_data?.address?.state} - {responseData?.verifiedData?.data?.enterprise_data?.address?.pincode}</p>
            <p><strong>Date of Incorporation:</strong> {responseData?.verifiedData?.data?.enterprise_data?.date_of_incorporation}</p>
            <p><strong>Social Category:</strong> {responseData?.verifiedData?.data?.enterprise_data?.social_category}</p>

            <h5 className="mt-3">Enterprise Units</h5>
            {responseData?.verifiedData?.data?.enterprise_data?.enterprise_units?.map((unit, index) => (
              <div key={index}>
                <p><strong>Unit {index + 1} Name:</strong> {unit.name}</p>
                <p><strong>Unit Address:</strong> {unit?.address?.door_no}, {unit?.address?.building}, {unit?.address?.area}, {unit?.address?.city}, {unit?.address?.state} - {unit?.address?.pincode}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UdyamAadhaar;
