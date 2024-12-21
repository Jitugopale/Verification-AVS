import React, { useState } from 'react';
import axios from 'axios';

const GSTVerificationPage = () => {
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
      const res = await axios.post('http://localhost:5000/api/gst/gst_verify', { id_number: idNumber });

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
          <h1 className="card-title">GST Verification</h1>
          <p className="card-text">
            Securely verify GST information online with ease and reliability.
          </p>
          <div className="mb-3">
            <label htmlFor="id_number" className="form-label">Enter GST Number</label>
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
            <p><strong>GSTIN:</strong> {responseData.verifiedData.data.gstin}</p>
            <p><strong>Business Name:</strong> {responseData.verifiedData.data.business_name}</p>
            <p><strong>Legal Name:</strong> {responseData.verifiedData.data.legal_name}</p>
            <p><strong>State Jurisdiction:</strong> {responseData.verifiedData.data.state_jurisdiction}</p>
            <p><strong>Taxpayer Type:</strong> {responseData.verifiedData.data.taxpayer_type}</p>
            <p><strong>GST Status:</strong> {responseData.verifiedData.data.gstin_status}</p>
            <p><strong>Filing Status (Latest GSTR1):</strong> {responseData.verifiedData.data.filing_status[0][0]?.status || 'N/A'}</p>
            <p><strong>Last Filed GSTR3B:</strong> {responseData.verifiedData.data.filing_status[0][1]?.status || 'N/A'}</p>
            <p><strong>Date of Registration:</strong> {responseData.verifiedData.data.date_of_registration}</p>
            <p><strong>Nature of Core Business:</strong> {responseData.verifiedData.data.nature_of_core_business_activity_description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GSTVerificationPage;
