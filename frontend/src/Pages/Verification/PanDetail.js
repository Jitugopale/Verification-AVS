import React, { useState } from 'react';
import axios from 'axios';
import { jsPDF } from "jspdf";

const PanDetail = () => {
  const [idNumber, setIdNumber] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
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

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth(); // Page width
    const pageHeight = doc.internal.pageSize.getHeight(); // Page height
  
    // Add a full-page border
    doc.setDrawColor(0); // Black color
    doc.setLineWidth(0.7); // Border thickness
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10); // Draw rectangle with a 5-unit margin from each edge
  
    // Center-aligned title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(25);
    const title = "Shankar Nagari Sahakari Bank Ltd";
    doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 20);
  
    // Center-aligned subtitle
    doc.setFontSize(14);
    const subtitle = "Pan Detail Verification Certificate";
    doc.text(subtitle, (pageWidth - doc.getTextWidth(subtitle)) / 2, 28);
  
    // Center-aligned section header
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const header = "TO WHOMSOEVER IT MAY CONCERN";
    doc.text(header, (pageWidth - doc.getTextWidth(header)) / 2, 36);
  
    // Verification Statement
    const verificationText = `This is to Certify that ${
      responseData.verifiedData?.data?.fullName || "N/A"
    }, Pan No. ${responseData.verifiedData?.data?.idNumber} are verified from https://www.pan.utiitsl.com/.`;
    const verificationSplit = doc.splitTextToSize(verificationText, 180);
    doc.text(verificationSplit, 14, 50);
  
    // Define positions and dimensions for the outer border
    const outerX = 10;
    const outerY = 65;
    const outerWidth = 190;
    const outerHeight = 117;
  
    // Draw the outer border
    doc.setDrawColor(0);
    doc.setLineWidth(0.7);
    doc.rect(outerX, outerY, outerWidth, outerHeight);
  
    // Define positions and dimensions for content box
    const contentX = 14;
    const contentY = 70;
    const contentWidth = 120;
    const contentHeight = 90;
  
    // Define positions and dimensions for the profile image box
    const imageX = 150;
    const imageY = 70;
    const imageWidth = 40;
    const imageHeight = 40;
  
    // User Details Content
    doc.setFont("helvetica", "bold");
    doc.text("Status                               :", contentX + 2, contentY + 5);
    doc.setFont("helvetica", "normal");
    doc.text(responseData.status || "N/A", contentX + 54, contentY + 5);
  
    doc.setFont("helvetica", "bold");
    doc.text("Id Number                        :", contentX + 2, contentY + 15);
    doc.setFont("helvetica", "normal");
    doc.text(responseData.verifiedData?.data?.idNumber ? responseData.verifiedData?.data?.idNumber.toString() : "N/A", contentX + 54, contentY + 15);

    doc.setFont("helvetica", "bold");
    doc.text("First Name                       :", contentX + 2, contentY + 25);
    doc.setFont("helvetica", "normal");
    doc.text(responseData.verifiedData?.data?.firstName ? responseData.verifiedData?.data?.firstName.toString() : "N/A", contentX + 54, contentY + 25);

    doc.setFont("helvetica", "bold");
    doc.text("Middle Name                    :", contentX + 2, contentY + 35);
    doc.setFont("helvetica", "normal");
    doc.text(responseData.verifiedData?.data?.middleName ? responseData.verifiedData?.data?.middleName.toString() : "N/A", contentX + 54, contentY + 35);

    doc.setFont("helvetica", "bold");
    doc.text("Last Name                        :", contentX + 2, contentY + 45);
    doc.setFont("helvetica", "normal");
    doc.text(responseData.verifiedData?.data?.lastName ? responseData.verifiedData?.data?.lastName.toString() : "N/A", contentX + 54, contentY + 45);

    doc.setFont("helvetica", "bold");
    doc.text("Full Name                         :", contentX + 2, contentY + 55);
    doc.setFont("helvetica", "normal");
    doc.text(responseData.verifiedData?.data?.fullName ? responseData.verifiedData?.data?.fullName.toString() : "N/A", contentX + 54, contentY + 55);

    doc.setFont("helvetica", "bold");
    doc.text("PAN Status                       :", contentX + 2, contentY + 65);
    doc.setFont("helvetica", "normal");
    doc.text(responseData.verifiedData?.data?.panStatus ? responseData.verifiedData?.data?.panStatus.toString() : "N/A", contentX + 54, contentY + 65);

    doc.setFont("helvetica", "bold");
    doc.text("Category                           :", contentX + 2, contentY + 75);
    doc.setFont("helvetica", "normal");
    doc.text(responseData.verifiedData?.data?.category ? responseData.verifiedData?.data?.category.toString() : "N/A", contentX + 54, contentY + 75);

    doc.setFont("helvetica", "bold");
    doc.text("Aadhaar Seeding Status :", contentX + 2, contentY + 85);
    doc.setFont("helvetica", "normal");
    doc.text(responseData.verifiedData?.data?.aadhaarSeedingStatus ? responseData.verifiedData?.data?.aadhaarSeedingStatus.toString() : "N/A", contentX + 54, contentY + 85);
  
    
    // Footer with signatures
    doc.setFont("helvetica", "bold");
    doc.text("Signature of the Authorised Signatory", 14, 205);
    doc.text("Signature of the Branch Manager", 110, 205);
  
    doc.setFont("helvetica", "normal");
    doc.text("Name: __________________", 14, 215);
    doc.text("Name: __________________", 110, 215);
  
    doc.text("Designation: ____________", 14, 225);
    doc.text("Designation: ____________", 110, 225);
  
    doc.text("Phone no.: ______________", 14, 235);
    doc.text("Date: ___________________", 110, 235);
  
    // Bank Seal
    doc.setFont("helvetica", "normal");
    doc.text("(Bank Seal)", 14, 256);
    doc.text("Verified By : User", 120, 256);
  
    // Save PDF
    const fileName =responseData.verifiedData?.data?.idNumber
      ? `${responseData.verifiedData?.data?.fullName}_verification_certificate.pdf`
      : "verification_certificate.pdf";
    doc.save(fileName);
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
   <>
   
        <div className="container-fluid">

      <div className="d-flex align-items-center">
        <div className=" p-3" style={{width:'1200px'}}>
          <h1 className="card-title" style={{color:'green'}}>PAN Detail Verification</h1>
          <div style={styles.statusBar} className='mt-2'>
          <span>No. Of Count: 36</span>
          <span>Your available Credit: -62</span>
        </div>
          {/* <div className="mb-3">
            <label htmlFor="id_number" className="form-label">Enter PAN ID Number</label>
            <input
              type="text"
              className="form-control"
              id="id_number"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
            />
          </div> */}
          <div>
        <label>Enter ID Number : &nbsp;</label>
        <input
          type="text"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
          placeholder="Enter PAN Number"
          style={inputStyle}
        />
        <div className="buttons mt-3">
        {!isVerified &&<button style={styles.button} onClick={handleVerify} disabled={loading} >{loading ? 'Verifying...' : 'Verify'}</button>}
            <button style={styles.button}>Excel Report</button>
            <button style={styles.button} onClick={() => setIdNumber("")}>Clear</button>
            <button style={styles.button}>Search</button>
          </div>
      </div>
      

          {/* <button className="btn btn-primary" onClick={handleVerify} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </button> */}

          {/* Show error if any */}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
      </div>

      {/* Show response data below the card */}
      {/* {responseData && (
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
      )} */}
       {!isVerified &&responseData && (
  <div className="container mt-5 d-flex justify-content-center">
    <div
      className="card shadow-lg p-4" 
      style={{
        borderRadius: "10px",
        backgroundColor: "#f8f9fa",
        width: "800px",
        height:'610px',
        overflowY: "auto", // Enable vertical scrolling

      }}
    >
      <table
        className="table table-bordered"
        style={{ fontSize: "16px" }}
      >
        <thead>
          <tr>
            <th
              colSpan="2"
              className="text-center"
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: "#686868",
              }}
            >
              VERIFICATION DETAILS
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ fontWeight: "bold", textAlign: "left" }}>Status :</td>
            <td
              style={{
                textAlign: "left",
                color: responseData.status ? "green" : "red",
              }}
            >
              {responseData.status ? "Verified" : "Not Verified"}
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", textAlign: "left" }}>Id Number :</td>
            <td style={{ textAlign: "left" }}>
              {responseData.verifiedData?.data?.idNumber}
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", textAlign: "left" }}>First Name :</td>
            <td style={{ textAlign: "left" }}>
              {responseData.verifiedData?.data?.firstName}
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", textAlign: "left" }}>Middle Name :</td>
            <td style={{ textAlign: "left" }}>
              {responseData.verifiedData?.data?.middleName}
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", textAlign: "left" }}>Last Name :</td>
            <td style={{ textAlign: "left" }}>
              {responseData.verifiedData?.data?.lastName}
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", textAlign: "left" }}>Full Name :</td>
            <td style={{ textAlign: "left" }}>
              {responseData.verifiedData?.data?.fullName || "N/A"}
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", textAlign: "left" }}>PAN Status :</td>
            <td style={{ textAlign: "left" }}>
              {responseData.verifiedData?.data?.panStatus || "N/A"}
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", textAlign: "left" }}>Category :</td>
            <td style={{ textAlign: "left" }}>
              {responseData.verifiedData?.data?.category || "N/A"}
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", textAlign: "left" }}>
              Aadhaar Seeding Status :
            </td>
            <td style={{ textAlign: "left" }}>
              {responseData.verifiedData?.data?.aadhaarSeedingStatus}
            </td>
          </tr>
          {/* <tr>
            <td style={{ fontWeight: "bold", textAlign: "left" }}>
              Verification Date :
            </td>
            <td style={{ textAlign: "left" }}>
              {responseData.formattedDate}
            </td>
          </tr> */}
        </tbody>
      </table>

      <div className="text-center mt-4">
        <button
        onClick={generatePDF}
          className="btn btn-success btn-lg"
          style={{
            fontSize: "16px",
            padding: "12px 20px",
            borderRadius: "5px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          Download PDF
        </button>
      </div>
    </div>
  </div>
)}
      </div>
      
     

    
  </>
  );
};

export default PanDetail;
