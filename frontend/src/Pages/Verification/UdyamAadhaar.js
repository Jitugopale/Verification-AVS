import React, { useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';

const UdyamAadhaar = () => {
  const [udyamAadhaar, setUdyamAadhaar] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
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

  const generatePDF = () => {
    if (!responseData || !responseData.verifiedData) return;
  
    const { data } = responseData.verifiedData;
  
    const doc = new jsPDF();
  
    // Title
    doc.setFontSize(18);
    doc.text('Udyam Aadhaar Verification', 20, 20);
  
    // Status
    doc.setFontSize(12);
    doc.text(`Status: ${responseData.status ? 'Verified' : 'Not Verified'}`, 20, 30);
  
    // Document ID
    doc.text(`Document ID: ${data.enterprise_data.document_id}`, 20, 40);
  
    // Enterprise Name
    doc.text(`Enterprise Name: ${data.enterprise_data.name}`, 20, 50);
  
    // Business Type
    doc.text(`Business Type: ${data.enterprise_data.enterprise_type}`, 20, 60);
  
    // Major Activity
    doc.text(`Major Activity: ${data.enterprise_data.major_activity}`, 20, 70);
  
    // Organization Type (Business Type)
    doc.text(`Organization Type: ${data.enterprise_data.organization_type}`, 20, 80);
  
    // Mobile and Email
    doc.text(`Mobile: ${data.enterprise_data.mobile}`, 20, 90);
    doc.text(`Email: ${data.enterprise_data.email}`, 20, 100);
  
    // Address
    const address = `${data.enterprise_data.address.door_no}, ${data.enterprise_data.address.building}, ${data.enterprise_data.address.area}, ${data.enterprise_data.address.city}, ${data.enterprise_data.address.state} - ${data.enterprise_data.address.pincode}`;
    doc.text(`Address: ${address}`, 20, 110);
  
    // Date of Incorporation
    doc.text(`Date of Incorporation: ${data.enterprise_data.date_of_incorporation}`, 20, 120);
  
    // Date of Udyam Registration
    doc.text(`Date of Udyam Registration: ${data.enterprise_data.date_of_udyam_registration}`, 20, 130);
  
    // Dic
    doc.text(`DIC: ${data.enterprise_data.dic}`, 20, 140);
  
    // Msme_DI
    doc.text(`MSME DI: ${data.enterprise_data.msme_di}`, 20, 150);
  
    // Social Category
    doc.text(`Social Category: ${data.enterprise_data.social_category}`, 20, 160);
  
    // NIC Data (Check if exists before iterating)
    // const nicData = data.enterprise_data.nic_data;
    // if (nicData && nicData.length > 0) {
    //   doc.text('NIC Data:', 20, 170);
    //   nicData.forEach((unit, index) => {
    //     doc.text(`NIC 2 Digit: ${unit.nic_2_digit}`, 20, 180 + index * 10);
    //     doc.text(`NIC 4 Digit: ${unit.nic_4_digit}`, 20, 190 + index * 10);
    //     doc.text(`NIC 5 Digit: ${unit.nic_5_digit}`, 20, 200 + index * 10);
    //   });
    // } else {
    //   doc.text('No NIC Data available.', 20, 170);
    // }
  
    // Enterprise Units (Check if exists before iterating)
    // const enterpriseUnits = data.enterprise_units;
    // if (enterpriseUnits && enterpriseUnits.length > 0) {
    //   doc.text('Enterprise Units:', 20, 210);
    //   enterpriseUnits.forEach((unit, index) => {
    //     const unitName = `Unit ${index + 1}: ${unit.name}`;
    //     const unitAddress = `${unit.address.door_no}, ${unit.address.building}, ${unit.address.area}, ${unit.address.city}, ${unit.address.state} - ${unit.address.pincode}`;
    //     doc.text(unitName, 20, 220 + index * 10);
    //     doc.text(unitAddress, 20, 230 + index * 10);
    //   });
    // } else {
    //   doc.text('No enterprise units available.', 20, 210);
    // }
  
    // Save PDF
    doc.save('udyam_aadhaar_verification.pdf');
  };
  
  const styles={
    statusBar: {
      backgroundColor: "#f1f1f1",
      padding: "10px",
      display: "flex",
      justifyContent: "space-between",
      border: "1px solid #ccc",
      marginBottom: "20px",
  
    },
    button: {
      marginRight: "10px",
      padding: "5px 10px",
      backgroundColor: "#008080",
      color: "white",
      border: "none",
      cursor: "pointer",
    },
  }
  const inputStyle = {
    marginBottom: "10px",
    padding: "8px",
    width: "30%",
    boxSizing: "border-box",
  };

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center">
        <div className="p-3" style={{ width: "100%", maxWidth: "1000px" }}>
        <h1 className="card-title" style={{color:'green'}}>Udyam Aadhaar Verification</h1>
          <div style={styles.statusBar} className='mt-3'>
          <span>No. Of Count: 36</span>
          <span>Your available Credit: -62</span>
        </div>
        <div>
        <label>Enter Udyam Number : &nbsp;</label>
        <input
          type="text"
          value={udyamAadhaar}
          id="udyam_aadhaar"
          onChange={(e) => setUdyamAadhaar(e.target.value)}
          placeholder="Enter GST Number"
          style={inputStyle}
        />
        <div className="buttons mt-3">
        {!isVerified &&<button style={styles.button} onClick={handleVerify} disabled={loading} >{loading ? 'Verifying...' : 'Verify'}</button>}
            <button style={styles.button}>Excel Report</button>
            <button style={styles.button} onClick={() => setUdyamAadhaar("")}>Clear</button>
            <button style={styles.button}>Search</button>
          </div>
      </div>
          {/* <h1 className="card-title">Udyam Aadhaar Verification</h1> */}
          {/* <div className="mb-3">
            <label htmlFor="udyam_aadhaar" className="form-label">Enter Udyam Aadhaar Number</label>
            <input
              type="text"
              className="form-control"
              id="udyam_aadhaar"
              value={udyamAadhaar}
              onChange={(e) => setUdyamAadhaar(e.target.value)}
            />
          </div> */}
          {/* <button className="btn btn-primary" onClick={handleVerify} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </button> */}

          {/* Show error if any */}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
      </div>

      {/* Show response data below the card */}
      {responseData && (
        <div className="container mt-5">
          <h3>Verification Result</h3>
          <div className="card shadow p-3">
            <p><strong>Status:</strong> {responseData.status ? 'Verified' : 'Not Verified'}</p>
            <p><strong>Document ID:</strong> {responseData?.verifiedData?.data?.enterprise_data?.document_id}</p>
            <p><strong>Enterprise Name:</strong> {responseData?.verifiedData?.data?.enterprise_data?.name}</p>
            <p><strong>Business Type:</strong> {responseData?.verifiedData?.data?.enterprise_data?.enterprise_type}</p>
            <p><strong>Major Activity:</strong> {responseData?.verifiedData?.data?.enterprise_data?.major_activity}</p>
            <p><strong>Business Type:</strong> {responseData?.verifiedData?.data?.enterprise_data?.organization_type}</p>
            <p><strong>Mobile:</strong> {responseData?.verifiedData?.data?.enterprise_data?.mobile}</p>
            <p><strong>Email:</strong> {responseData?.verifiedData?.data?.enterprise_data?.email}</p>
            <p><strong>Address:</strong> {responseData?.verifiedData?.data?.enterprise_data?.address?.door_no}, {responseData?.verifiedData?.data?.enterprise_data?.address?.building}, {responseData?.verifiedData?.data?.enterprise_data?.address?.area}, {responseData?.verifiedData?.data?.enterprise_data?.address?.city}, {responseData?.verifiedData?.data?.enterprise_data?.address?.state} - {responseData?.verifiedData?.data?.enterprise_data?.address?.pincode}</p>
            <p><strong>Date of Incorporation:</strong> {responseData?.verifiedData?.data?.enterprise_data?.date_of_incorporation}</p>
            <p><strong>Date of Udyam Registration:</strong> {responseData?.verifiedData?.data?.enterprise_data?.date_of_udyam_registration}</p>
            <p><strong>Dic:</strong> {responseData?.verifiedData?.data?.enterprise_data?.dic}</p>
            <p><strong>Msme_Di:</strong> {responseData?.verifiedData?.data?.enterprise_data?.msme_di}</p>
            <p><strong>Social Category:</strong> {responseData?.verifiedData?.data?.enterprise_data?.social_category}</p>

            {/* <h5 className="mt-3">Nic Data</h5>
{responseData?.verifiedData?.data?.enterprise_data?.nic_data ? (
  <div>
    <p><strong>Nic_2_Digit:</strong> {responseData.verifiedData.data.enterprise_data.nic_data.nic_2_digit}</p>
    <p><strong>Nic_4_Digit:</strong> {responseData.verifiedData.data.enterprise_data.nic_data.nic_4_digit}</p>
    <p><strong>Nic_5_Digit:</strong> {responseData.verifiedData.data.enterprise_data.nic_data.nic_5_digit}</p>
  </div>
) : (
  <p>No NIC Data available.</p>
)}

<h5 className="mt-3">Enterprise Units</h5>
{responseData?.verifiedData?.data?.enterprise_data?.enterprise_units?.length > 0 ? (
  responseData.verifiedData.data.enterprise_data.enterprise_units.map((unit, index) => (
    <div key={index}>
      <p><strong>Unit {index + 1} Name:</strong> {unit.name}</p>
      <p><strong>Unit Address:</strong> {unit?.address?.door_no}, {unit?.address?.building}, {unit?.address?.area}, {unit?.address?.city}, {unit?.address?.state} - {unit?.address?.pincode}</p>
    </div>
  ))
) : (
  <p>No Enterprise Units available.</p>
)} */}


          </div>
          <button className="btn btn-success mt-3" onClick={generatePDF}>Download PDF</button>
        </div>
      )}
    </div>
  );
};

export default UdyamAadhaar;
