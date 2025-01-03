import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import PassPortTable from './PassPortTable';
import * as XLSX from "xlsx"; // Import xlsx library

const PassportVerification = () => {
  const [idNumber, setIdNumber] = useState('');
  const [dob, setDob] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedUsers, setVerifiedUsers] = useState([]);
  const [error, setError] = useState('');

    const [currentIndex, setCurrentIndex] = useState(0);
    const [verificationCounts, setVerificationCounts] = useState({
      pancard: 0,
      aadhar: 0,
      udyancard: 0,
      pandetail: 0,
      voter: 0,
      passport: 0,
      credit: 0,
      gst: 0,
    });
  
    // Extract only the valid keys for verification counts
    const keys = Object.keys(verificationCounts);

    useEffect(() => {
      const fetchVerificationCounts = async () => {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/count/verification-count"
          );
          if (response.status === 200) {
            const filteredData = Object.keys(response.data)
              .filter((key) => verificationCounts.hasOwnProperty(key)) // Filter out unwanted fields
              .reduce((obj, key) => {
                obj[key] = response.data[key];
                return obj;
              }, {});
            setVerificationCounts(filteredData);
          }
        } catch (error) {
          console.error("Error fetching verification counts:", error.message);
        }
      };
  
      fetchVerificationCounts();
    }, []);

    const handleExcelDownload = () => {
      // Mapping the verified users data to the format required for Excel
      const excelData = verifiedUsers.map((user, index) => ({
        'SrNo': index + 1,  // You can adjust this if the `SrNo` is not directly available in the data
        'PassPort ID	': user.verifiedData.data.file_number,
        'Name': user.verifiedData.data.full_name,
        'DOB': user.verifiedData.data.dob,
        'Date of Application': user.verifiedData.data.date_of_application,
        'Verification Date': user.formattedDate,
      }));
    
      // Create a new workbook
      const wb = XLSX.utils.book_new();
      
      // Convert excelData to a worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);
    
      // Append the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, "Verified Users");
    
      // Trigger the download of the Excel file
      XLSX.writeFile(wb, "Verified_Users.xlsx");
    };
  
      // Fetch the verified users from the backend
  useEffect(() => {
    const fetchVerifiedUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/passport/verified"
        );
        setVerifiedUsers(response.data); // Set the fetched data into the state
      } catch (error) {
        console.error("Error fetching verified users:", error);
      }
    };
    fetchVerifiedUsers();
  },[]);


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

  const generatePDF = () => {
    if (!responseData || !responseData.data) {
      alert('No data to generate PDF');
      return;
    }

    const data = responseData.data;
    const doc = new jsPDF();

    let yPosition = 10;
    const labelXPosition = 10;
    const valueXPosition = 50;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Passport Verification Details', 15, yPosition);
    yPosition += 15;

    // Passport Verification Information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    doc.text('Passport Verification Information:', labelXPosition, yPosition);
    yPosition += 10;


    doc.setFont('helvetica', 'bold');
    doc.text(`Status:`, labelXPosition, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(`${responseData.message}`, valueXPosition, yPosition);
    yPosition += 10;
    
    doc.setFont('helvetica', 'bold');
    doc.text(`Reference ID:`, labelXPosition, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(`${responseData.reference_id}`, valueXPosition, yPosition);
    yPosition += 10;

    doc.setFont('helvetica', 'bold');
    doc.text(`File Number:`, labelXPosition, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(`${data.file_number}`, valueXPosition, yPosition);
    yPosition += 10;

    // Full Name
    doc.setFont('helvetica', 'bold');
    doc.text(`Full Name:`, labelXPosition, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(`${data.full_name}`, valueXPosition, yPosition);
    yPosition += 10;

    // Date of Birth
    doc.setFont('helvetica', 'bold');
    doc.text(`Date of Birth:`, labelXPosition, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(`${data.dob}`, valueXPosition, yPosition);
    yPosition += 10;

    // Date of Application
    doc.setFont('helvetica', 'bold');
    doc.text(`Date of Application:`, labelXPosition, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(`${data.date_of_application}`, 55, yPosition);
    yPosition += 10;

    // Application Type
    doc.setFont('helvetica', 'bold');
    doc.text(`Application Type:`, labelXPosition, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(`${data.application_type}`, valueXPosition, yPosition);
    yPosition += 10;

    // Save PDF
    doc.save('Passport_Verification_Details.pdf');
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
    width: "50%",
    boxSizing: "border-box",
  };

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center">
        <div className="p-3" style={{ maxWidth: '1200px', width: '100%' }}>
        <h1 className="card-title" style={{color:'green'}}>PassPort Verification</h1>
        <div style={styles.statusBar} className='mt-2'>
        <div>
            {/* Display specific count for 'credit' */}
            <div>
              <span>No. Of Count : {verificationCounts.passport}</span>
            </div>
          </div>{" "}
          <span>Your available Credit: -62</span>
        </div>
        <div>
        <div className='row'>
           <div className='col-md-6'>
           <label>Enter Passport ID : &nbsp;</label>
        <input
          type="text"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
          placeholder="Enter PassPort Id"
          style={inputStyle}
        />
           </div>
           <div className='col-md-6'>
           <label>Enter Date of Birth : &nbsp;</label>
        <input
          type="date"
          value={dob}
          id="dob"
          onChange={(e) => setDob(e.target.value)}
          style={inputStyle}
        />
           </div>
        </div>
        <div className="buttons mt-3">
        {!isVerified &&<button style={styles.button} onClick={handleVerify} disabled={loading} >{loading ? 'Verifying...' : 'Verify'}</button>}
            <button type="button" style={styles.button} onClick={handleExcelDownload}>Excel Report</button>
            <button style={styles.button} onClick={() => setIdNumber("")}>Clear</button>
            <button style={styles.button}>Search</button>
          </div>
      </div>
      
          {/* <div className="mb-3">
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
            <p><strong>Reference ID:</strong> {responseData.reference_id}</p>
            <p><strong>File Number:</strong> {responseData.data.file_number}</p>
            <p><strong>Full Name:</strong> {responseData.data.full_name}</p>
            <p><strong>Date of Birth:</strong> {responseData.data.dob}</p>
            <p><strong>Date of Application:</strong> {responseData.data.date_of_application}</p>
            <p><strong>Application Type:</strong> {responseData.data.application_type}</p>
            <p><strong>Status:</strong> {responseData.data.status}</p>
          </div>

          {/* Button to generate PDF */}
          <div>
           <button className="btn btn-success mt-3" onClick={generatePDF}>Download PDF</button>
          </div>
        </div>
      )}
      <PassPortTable/>
    </div>
  );
};

export default PassportVerification;
