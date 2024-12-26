


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
      const res = await axios.post('http://localhost:5000/api/credit/credit_report_checker', formData);

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

    const doc = new jsPDF();
    let yPosition = 10;
// Generate a shorter unique enquiry ID
const enquiryID = `ENQ-${Math.floor(Date.now() % 1000000)}-${Math.floor(Math.random() * 1000)}`;


    // Main Page - Header and User Details
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('CREDIT VERIFICATION REPORT', 15, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 15, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(`Consumer Name: ${data.iDAndContactInfo.personalInfo.name.fullName}`, 15, yPosition);
    yPosition += 10;
    doc.text(`Enquiry ID: ${enquiryID}`, 15, yPosition);
    yPosition += 10;
    doc.text(`Date of Birth: ${data.iDAndContactInfo.personalInfo.dateOfBirth}`, 15, yPosition);
    yPosition += 10;
    doc.text(`Gender: ${data.iDAndContactInfo.personalInfo.gender}`, 15, yPosition);
    yPosition += 10;
    doc.text(`Date: ${data.iDAndContactInfo.personalInfo.occupation}`,  200, 10,{ align: 'right' } );
    yPosition += 10;
    doc.text(`Time: ${data.iDAndContactInfo.personalInfo.occupation}`,  210, 10,{ align: 'right' } );
    yPosition += 10;
    doc.text(`Control Number: ${data.iDAndContactInfo.personalInfo.occupation}`,  220, 10,{ align: 'right' } );
    yPosition += 10;


doc.setFontSize(18);
doc.setFont('helvetica', 'normal');
doc.text('SEARCH INFORMATION', 15, yPosition);
yPosition += 10;

// Table header
doc.setFontSize(12);
doc.setFont('helvetica', 'bold');
doc.text('Name', 15, yPosition);
doc.text('Ranjana', 60, yPosition);
doc.text('PAN', 150, yPosition);
doc.text('EPRPM0099P', 180, yPosition);
yPosition += 10;

doc.text('Key Person Name', 15, yPosition);
doc.text('Pandurang Mohite', 60, yPosition);
doc.text('UID', 150, yPosition);
doc.text('XXXXXXXXXXXX', 180, yPosition);
yPosition += 10;

doc.text('DOB', 15, yPosition);
doc.text('01-01-1980', 60, yPosition);
doc.text('Mobile', 150, yPosition);
doc.text('9898989898', 180, yPosition);
yPosition += 10;

doc.text('Gender', 15, yPosition);
doc.text('Female', 60, yPosition);
doc.text('Current Address', 150, yPosition);
doc.text('Room No. 22, Shree Charan Chawl, Mumbai', 180, yPosition);
yPosition += 20;

  /////////////  

    doc.setFontSize(18);
    doc.setFont('helvetica', 'normal');
    doc.text('CONSUMER INFORMATION', 15, yPosition);
    yPosition += 10;

    doc.setFontSize(18);
    doc.setFont('helvetica', 'normal');
    doc.text('CREDIT REPORT SUMMARY', 15, yPosition);
    yPosition += 10;





    data.iDAndContactInfo.addressInfo.forEach((address, index) => {
        doc.text(`Address ${index + 1}: ${address.address}, ${address.state}, ${address.postal}`, 15, yPosition);
        yPosition += 10;
    });

    yPosition += 5; // Add space before summary
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Loan Summary', 15, yPosition);
    yPosition += 10;

    const summary = data.retailAccountsSummary;
    if (summary) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Total Accounts: ${summary.noOfAccounts}`, 15, yPosition);
        yPosition += 10;
        doc.text(`Active Accounts: ${summary.noOfActiveAccounts}`, 15, yPosition);
        yPosition += 10;
        doc.text(`Total Balance: ₹${summary.totalBalanceAmount}`, 15, yPosition);
        yPosition += 10;
        doc.text(`Total Sanction Amount: ₹${summary.totalSanctionAmount}`, 15, yPosition);
        yPosition += 15;
    }

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('*Amounts, balances, and written-off status are for live accounts only.', 15, yPosition);
    yPosition += 15;

    // Loan Details Pages
    const loans = data.retailAccountDetails || [];
    loans.forEach((loan, index) => {
        doc.addPage();
        yPosition = 10;

        // Loan Header
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(`Loan ${index + 1}`, 15, yPosition);
        yPosition += 15;

        // Loan Details
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(`Account Number: ${loan.accountNumber}`, 15, yPosition);
        yPosition += 10;
        doc.text(`Institution: ${loan.institution}`, 15, yPosition);
        yPosition += 10;
        doc.text(`Account Type: ${loan.accountType}`, 15, yPosition);
        yPosition += 10;
        doc.text(`Sanctioned Amount: ₹${loan.sanctionAmount}`, 15, yPosition);
        yPosition += 10;
        doc.text(`Current Balance: ₹${loan.balance}`, 15, yPosition);
        yPosition += 10;
        doc.text(`EMI Amount: ₹${loan.installmentAmount}`, 15, yPosition);
        yPosition += 10;
        doc.text(`Repayment Tenure: ${loan.repaymentTenure} months`, 15, yPosition);
        yPosition += 10;
        doc.text(`Date Opened: ${loan.dateOpened}`, 15, yPosition);
        yPosition += 10;
        doc.text(`Date Closed: ${loan.dateClosed || 'N/A'}`, 15, yPosition);
        yPosition += 10;
        doc.text(`Status: ${loan.accountStatus}`, 15, yPosition);
        yPosition += 15;

        // Payment History
        doc.setFont('helvetica', 'bold');
        doc.text('Payment History (Last 8 Months):', 15, yPosition);
        yPosition += 10;

        loan.history48Months?.forEach((history, idx) => {
            doc.setFont('helvetica', 'normal');
            doc.text(`${idx + 1}. Month: ${history.key}, Status: ${history.paymentStatus}`, 15, yPosition);
            yPosition += 10;
        });
    });

    // Save the PDF
    doc.save('Credit_Verification_Report.pdf');
};


  return (
    <div class="container mt-5">

    <h1 class="text-center">Credit Verification</h1>
    
   
    <form>
   
      <div class="mb-3">
        <label for="name" class="form-label">Name:</label>
        <input 
          type="text" 
          class="form-control" 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
        />
      </div>
 
      <div class="mb-3">
        <label for="mobile" class="form-label">Mobile:</label>
        <input 
          type="text" 
          class="form-control" 
          id="mobile" 
          name="mobile" 
          value={formData.mobile} 
          onChange={handleChange} 
        />
      </div>
  

      <div class="mb-3">
        <label for="document_id" class="form-label">Document ID:</label>
        <input 
          type="text" 
          class="form-control" 
          id="document_id" 
          name="document_id" 
          value={formData.document_id} 
          onChange={handleChange} 
        />
      </div>
  
   
      <div class="mb-3">
        <label for="date_of_birth" class="form-label">Date of Birth:</label>
        <input 
          type="date" 
          class="form-control" 
          id="date_of_birth" 
          name="date_of_birth" 
          value={formData.date_of_birth} 
          onChange={handleChange} 
        />
      </div>
  
 
      <div class="mb-3">
        <label for="address" class="form-label">Address:</label>
        <textarea 
          class="form-control" 
          id="address" 
          name="address" 
          rows="3" 
          value={formData.address} 
          onChange={handleChange}
        ></textarea>
      </div>
  
   
      <div class="mb-3">
        <label for="pincode" class="form-label">Pincode:</label>
        <input 
          type="text" 
          class="form-control" 
          id="pincode" 
          name="pincode" 
          value={formData.pincode} 
          onChange={handleChange} 
        />
      </div>
  
      <button 
        type="button" 
        class="btn btn-primary" 
        onClick={handleVerify} 
        disabled={loading}
      >
        {loading ? 'Verifying...' : 'Verify'}
      </button>
    </form>
  

    {error && <p class="text-danger mt-3">{error}</p>}
  

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
