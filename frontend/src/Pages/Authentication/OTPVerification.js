import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import { useRecoveryContext } from '../Authentication/RecoveryContext';

const OTPVerification = () => {
  const [email, setEmail] = useState(''); // Add email state
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { email: recoveryEmail } = useRecoveryContext(); // Assuming email is coming from RecoveryContext
  const navigate = useNavigate(); // Initialize navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check if the new password is provided
    if (!newPassword) {
      setError('New password is required.');
      setLoading(false);
      return;
    }

    try {
      // Send email, OTP, and newPassword to backend
      const response = await axios.post('http://localhost:5000/api/auth/verify_otp', {
        email: email || recoveryEmail, // Use email from state or context
        otp,
        newPassword,  // New password is being sent to the backend
      });

      // Handle success response
      if (response.data.message) {
        alert('Password successfully updated!');
        navigate('/login'); // Redirect to login after success
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container contain-2 mt-5">
      <h2 className="heading-login">Verify OTP and Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Enter Your Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Handle email input change
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="otp" className="form-label">Enter OTP</label>
          <input
            type="text"
            className="form-control"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-danger">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default OTPVerification;
