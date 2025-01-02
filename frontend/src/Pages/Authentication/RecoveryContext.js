import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

// Create context
const RecoveryContext= createContext();

// Custom hook to use the RecoveryContext
export const useRecoveryContext= () => {
  return useContext(RecoveryContext);
};

// RecoveryContextprovider component
export const RecoveryProvider = ({ children }) => {
  const [email, setEmail] = useState('');
  const [OTP, setOTP] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [page, setPage] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  
  const sendRecoveryEmail = async () => {
    if (!email) {
      setMessage('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/send_recovery_email', {
        recipient_email: email,
        OTP: OTP,
      });
      setMessage(response.data || 'OTP sent successfully!');
    } catch (error) {
      setMessage(error.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RecoveryContext.Provider
      value={{
        email,
        setEmail,
        OTP,
        setOTP,
        isLoading,
        message,
        setPage,
        page,
        sendRecoveryEmail,
        recoveryEmail,
        setRecoveryEmail
      }}
    >
      {children}
    </RecoveryContext.Provider>
  );
};
