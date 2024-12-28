


import React, { useState } from 'react';
import axios from 'axios';
import ReactJson from 'react-json-view';

import { jsPDF } from 'jspdf';

const CreditVerificationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    document_id: '',
    date_of_birth: '',
    address: '',
    pincode: '',
  });
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const renderJson = (data) => {
    if (typeof data === 'object' && !Array.isArray(data)) {
      return (
        <ul style={{ listStyleType: 'none', paddingLeft: '20px' }}>
          {Object.entries(data).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {renderJson(value)}
            </li>
          ))}
        </ul>
      );
    } else if (Array.isArray(data)) {
      return (
        <ul style={{ listStyleType: 'circle', paddingLeft: '20px' }}>
          {data.map((item, index) => (
            <li key={index}>{renderJson(item)}</li>
          ))}
        </ul>
      );
    } else {
      return <span>{String(data)}</span>;
    }
  };

  const handleVerify = async () => {
    const { name, mobile, document_id, date_of_birth, address, pincode } = formData;

    if (!name || !mobile || !document_id || !date_of_birth || !address || !pincode) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError('');
    setResponseData(null);

    try {
      const res = await axios.post('http://192.168.20.151:4000/api/credit/credit_report_checker', formData);

      if (res.data.status === 'success') {
        setResponseData(res.data); // Store the successful response data
      } else {
        setError(res.data.message || 'Verification failed. Please try again.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    if (!responseData || !responseData.verifiedData) {
      alert('No data to generate PDF');
      return;
    }

    const data = responseData.verifiedData.data.cCRResponse.cIRReportDataLst[0]?.cIRReportData;

    if (!data) {
      alert('Incomplete data received.');
      return;
    }

    // Initialize jsPDF
    const doc = new jsPDF();
    let yPosition = 10;

    // Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Credit Verification Details', 15, yPosition);
    yPosition += 15;

    // Add Personal Info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${data.iDAndContactInfo.personalInfo.name.fullName}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Date of Birth: ${data.iDAndContactInfo.personalInfo.dateOfBirth}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Gender: ${data.iDAndContactInfo.personalInfo.gender}`, 10, yPosition);
    yPosition += 10;

    // Add Identity Info
    data.iDAndContactInfo.identityInfo.pANId.forEach((id, index) => {
      doc.text(`PAN ID ${index + 1}: ${id.idNumber} (Reported Date: ${id.reportedDate})`, 10, yPosition);
      yPosition += 10;
    });

    // Add Address Info
    data.iDAndContactInfo.addressInfo.forEach((address, index) => {
      doc.text(
        `Address ${index + 1}: ${address.address}, ${address.state}, ${address.postal} (Reported Date: ${address.reportedDate})`,
        10,
        yPosition
      );
      yPosition += 10;
    });

    // Save the PDF
    doc.save('Credit_Verification_Details.pdf');
  };

  return (
    <div>
      <h1>Credit Verification</h1>
      <div>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <label>
          Mobile:
          <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} />
        </label>
        <label>
          Document ID:
          <input type="text" name="document_id" value={formData.document_id} onChange={handleChange} />
        </label>
        <label>
          Date of Birth:
          <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} />
        </label>
        <label>
          Address:
          <textarea name="address" value={formData.address} onChange={handleChange}></textarea>
        </label>
        <label>
          Pincode:
          <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} />
        </label>
        <button onClick={handleVerify} disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {responseData && (
  <div>
    <h2>Verification Result</h2>
    <div style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
      {renderJson(responseData)}
    </div>
    <button
      onClick={generatePDF}
      style={{
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      Generate PDF
    </button>
  </div>
)}
    </div>
  );
};

export default CreditVerificationPage;
