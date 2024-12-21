import React, { useState } from 'react';
import axios from 'axios';

const VoterVerificationPage = () => {
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
      const res = await axios.post('http://localhost:5000/api/voter/voter_verify', { id_number: idNumber });
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
          <h1 className="card-title">Voter Verification</h1>
          <p className="card-text">
            Securely verify voter information online with ease and reliability.
          </p>
          <div className="mb-3">
            <label htmlFor="id_number" className="form-label">Enter Voter ID</label>
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
            <p><strong>Status:</strong> {responseData.status ? 'Verified' : 'Not Verified'}</p>
            <p><strong>Entered ID Number:</strong> {idNumber}</p> {/* Display the entered ID */}
            <p><strong>Name:</strong> {responseData.data.name}</p>
            <p><strong>Age:</strong> {responseData.data.age || 'N/A'}</p>
            <p><strong>Gender:</strong> {responseData.data.gender}</p>
            <p><strong>State:</strong> {responseData.data.state}</p>
            <p><strong>District:</strong> {responseData.data.district}</p>
            <p><strong>Polling Station:</strong> {responseData.data.polling_station}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoterVerificationPage;
