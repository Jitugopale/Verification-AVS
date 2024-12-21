import React, { useState } from 'react';
import axios from 'axios';

const PanDetail = () => {
  const [idNumber, setIdNumber] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!idNumber) {
      setError('ID Number is required');
      return;
    }

    setLoading(true);
    setError('');
    setResponseData(null);

    try {
      // Sending request to backend API for PAN verification
      const res = await axios.post('http://localhost:5000/api/pandetail/pandetails_verify', { id_number: idNumber });
      
      // Check if response contains status and handle accordingly
      if (res.data.status === 'success') {
        setResponseData(res.data);  // Store the successful response data
      } else {
        setError(res.data.message || 'Verification failed. Please try again.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="card shadow p-3" style={{ width: '500px' }}>
          <h1 className="card-title">PAN Card Verification</h1>
          <p className="card-text">
            Securely verify PAN card information online with ease and reliability.
          </p>
          <div className="mb-3">
            <label htmlFor="id_number" className="form-label">Enter PAN ID Number</label>
            <input
              type="text"
              className="form-control"
              id="id_number"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
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
            <p><strong>Status:</strong> {responseData.status === 'success' ? 'Verified' : 'Not Verified'}</p>
            <p><strong>Full Name:</strong> {responseData.verifiedData.data.fullName}</p>
            <p><strong>Father's Name:</strong> {responseData.verifiedData.data.fatherName || 'N/A'}</p>
            <p><strong>PAN Status:</strong> {responseData.verifiedData.data.panStatus}</p>
            <p><strong>Category:</strong> {responseData.verifiedData.data.category}</p>
            <p><strong>Aadhaar Seeding Status:</strong> {responseData.verifiedData.data.aadhaarSeedingStatus}</p>
            <p><strong>Masked Aadhaar:</strong> {responseData.verifiedData.data.maskedAadhaar || 'N/A'}</p>
            <p><strong>Verification Date:</strong> {responseData.verifiedData.formattedDate} at {responseData.verifiedData.formattedTime}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanDetail;
