import React, { useState } from 'react';
import axios from 'axios';

const PassportVerification = () => {
  const [idNumber, setIdNumber] = useState('');
  const [dob, setDob] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!idNumber || !dob) {
      setError('ID Number and Date of Birth are required');
      return;
    }

    setLoading(true);
    setError('');
    setResponseData(null);

    try {
      const res = await axios.post('http://localhost:5000/api/passport/passport_verify', { 
        id_number: idNumber, 
        dob 
      });
      if (res.data.status === 'success') {
        setResponseData(res.data.verifiedData);
      } else {
        setError(res.data.message || 'Verification failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="card shadow p-3" style={{ width: '500px' }}>
          <h1 className="card-title">Passport Verification</h1>
          <p className="card-text">
            Securely verify passport information online with ease and reliability.
          </p>
          <div className="mb-3">
            <label htmlFor="id_number" className="form-label">Enter Passport ID</label>
            <input
              type="text"
              className="form-control"
              id="id_number"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="dob" className="form-label">Enter Date of Birth</label>
            <input
              type="date"
              className="form-control"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
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
            <p><strong>Reference ID:</strong> {responseData.reference_id}</p>
            <p><strong>Full Name:</strong> {responseData.data.full_name}</p>
            <p><strong>Date of Birth:</strong> {responseData.data.dob}</p>
            <p><strong>Date of Application:</strong> {responseData.data.date_of_application}</p>
            <p><strong>Application Type:</strong> {responseData.data.application_type}</p>
            <p><strong>Status:</strong> {responseData.data.status}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassportVerification;
