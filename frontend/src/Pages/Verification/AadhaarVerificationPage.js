import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf"; // Import jsPDF for PDF generation
import "./AadharVerification.css";

const AadhaarVerificationPage = () => {
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [aadhaarDetails, setAadhaarDetails] = useState(null);

  // Date range filtering
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [verifiedUsers, setVerifiedUsers] = useState([]);

  // Fetch verified Aadhaar details (either all or based on date range)
  useEffect(() => {
    const fetchVerifiedUsers = async () => {
      try {
        const storedVerifiedUsers = JSON.parse(localStorage.getItem("verifiedUsers")) || [];
        setVerifiedUsers(storedVerifiedUsers);
      } catch (error) {
        console.error("Error fetching verified users:", error);
      }
    };

    fetchVerifiedUsers();
  }, [startDate, endDate]);


  const handleAdharPdf = (aadhaarDetails) => {
    const doc = new jsPDF();
    
    // Add title to the PDF
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Aadhaar Verification Details", 14, 20);
    
    // Draw a line below the title
    doc.setLineWidth(0.5);
    doc.line(10, 22, 200, 22);
    
    // Add Aadhaar profile image
    const imageData = `data:image/jpeg;base64,${aadhaarDetails.profile_image}`;
    doc.addImage(imageData, 'JPEG', 14, 30, 35, 35);  // (x, y, width, height)
    
    // Add personal details to the PDF
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Aadhaar Number: ${aadhaarDetails.aadhaar_number}`, 14, 75);
    doc.text(`Name: ${aadhaarDetails.full_name}`, 14, 85);
    doc.text(`Gender: ${aadhaarDetails.gender}`, 14, 95);
    doc.text(`DOB: ${aadhaarDetails.dob}`, 14, 105);
    
    // Add address (make sure it's formatted correctly)
    doc.text("Address:", 14, 115);
    const addressLines = [
      aadhaarDetails.address.house,
      aadhaarDetails.address.street,
      aadhaarDetails.address.landmark,
      aadhaarDetails.address.loc,
      aadhaarDetails.address.po,
      aadhaarDetails.address.subdist,
      aadhaarDetails.address.dist,
      aadhaarDetails.address.state,
      aadhaarDetails.address.country,
      aadhaarDetails.address.zip,
    ]
    .filter(Boolean) // Remove any empty lines
    .join(", ");
    
    const addressSplit = doc.splitTextToSize(addressLines, 180);
    doc.text(addressSplit, 14, 120);
    
    // Footer with additional info
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text("Generated by Aadhaar Verification System", 14, 290);
    
    // Save the PDF
    doc.save(`${aadhaarDetails.full_name}_aadhaar_verification.pdf`);
  };
  
  const handleSendOtp = async () => {
    // Check if the Aadhaar number is already verified
    const storedVerifiedUsers = JSON.parse(localStorage.getItem("verifiedUsers")) || [];
    const isAadhaarVerified = storedVerifiedUsers.some(
      (user) => user.aadhaarNumber === aadhaarNumber
    );
  
    if (isAadhaarVerified) {
      // If Aadhaar number already exists in verified users
      alert("User Already Verified")
      return; // Prevent sending OTP
    }
  
    try {
      const response = await axios.post("http://192.168.20.151:5000/api/adhar/adhar", {
        aadharNumber: aadhaarNumber,
      });
  
      if (response.data.message === "OTP sent successfully.") {
        sessionStorage.setItem("clientId", response.data.client_id);
        setIsOtpSent(true);
        setErrorMessage("");
        setSuccessMessage("OTP sent to your registered mobile number.");
      } else {
        setErrorMessage("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to send OTP. Please try again.");
    }
  };
  

  const handleVerifyOtp = async () => {
    try {
      const clientId = sessionStorage.getItem("clientId");

      if (!clientId) {
        setErrorMessage("Client ID not found. Please resend OTP.");
        return;
      }

      const response = await axios.post(
        "http://192.168.20.151:5000/api/adhar/verifyAadhaarOtp",
        {
          clientId: clientId,
          OTP: otp,
        }
      );

      if (response.data.message === "Aadhaar verification successful.") {
        setIsVerified(true);
        setErrorMessage("");
        setSuccessMessage("Aadhaar verification completed successfully.");
        setAadhaarDetails(response.data.aadhaarData.data);

        const newVerifiedUser = {
          aadhaarNumber,
          name: response.data.aadhaarData.data.full_name,
          gender: response.data.aadhaarData.data.gender,
          dob: response.data.aadhaarData.data.dob,
          address: response.data.aadhaarData.data.address,
          verificationDate: new Date().toISOString(),
          profile_image:response.data.aadhaarData.data.profile_image
        };

        const storedUsers = JSON.parse(localStorage.getItem("verifiedUsers")) || [];
        localStorage.setItem("verifiedUsers", JSON.stringify([...storedUsers, newVerifiedUser]));
        setVerifiedUsers((prevUsers) => [...prevUsers, newVerifiedUser]);
      } else {
        setErrorMessage("OTP verification failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Verification failed.");
    }
  };

  // Function to generate and download the PDF
  const handleDownloadPdf = (user) => {
    const doc = new jsPDF();

    // Add title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Aadhaar Verification Details", 14, 20);

    doc.setLineWidth(0.5);
    doc.line(10, 22, 200, 22);

    // Add Aadhaar details
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Aadhaar Number: ${user.aadhaarNumber}`, 14, 75);
    doc.text(`Name: ${user.name}`, 14, 85);
    doc.text(`Gender: ${user.gender}`, 14, 95);
    doc.text(`DOB: ${user.dob}`, 14, 105);

    doc.text("Address:", 14, 115);
    const addressLines = [
        user.address.house,
        user.address.street,
        user.address.landmark,
        user.address.loc,
        user.address.po,
        user.address.subdist,
        user.address.dist,
        user.address.state,
        user.address.country,
        user.address.zip,
    ]
    .filter(Boolean)
    .join(", ");
    const addressSplit = doc.splitTextToSize(addressLines, 180);
    doc.text(addressSplit, 14, 120);

    // Add the profile image
    const imageData = `data:image/jpeg;base64,${user.profile_image}`;
    
    // Add the image to the PDF (positioned at x=14, y=30 with width=50 and height=50)
    doc.addImage(imageData, 'JPEG', 14, 30, 35, 35); 

    // Footer text
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text("Generated by Aadhaar Verification System", 14, 290);

    // Save the PDF
    doc.save(`${user.name}_aadhaar_verification.pdf`);
};


  return (
    <>
    <div className="aadhaar-verification">
      <div className="verification-card">
        <h1>Aadhaar Verification</h1>
        <div className="form-group">
          <label>Aadhaar Number:</label>
          <input
            type="text"
            value={aadhaarNumber}
            onChange={(e) => setAadhaarNumber(e.target.value)}
            placeholder="Enter your Aadhaar number"
            disabled={isOtpSent || isVerified}
          />
        </div>

        {isOtpSent && !isVerified && (
          <div className="form-group">
            <label>Enter OTP:</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the OTP"
            />
          </div>
        )}

        <div className="button-group">
          {!isOtpSent && !isVerified && <button onClick={handleSendOtp}>Send OTP</button>}
          {isOtpSent && !isVerified && <button onClick={handleVerifyOtp}>Verify OTP</button>}
        </div>

        {isVerified && (
          <div>
            <p style={{ color: "green" }}>{successMessage}</p>
            {aadhaarDetails && (
              <div className="details-section">
                <h3 style={{ textAlign: "center" }}>Aadhaar Details:</h3>
                <div style={{ textAlign: "center" }}>
                <img
                    src={`data:image/jpeg;base64,${aadhaarDetails.profile_image}`}
                    alt="Aadhaar Profile"
                    style={{ width: "150px", height: "150px", borderRadius: "5%" }}
                  />
                </div>
                <div
                  style={{
                    marginLeft: "15px",
                    marginTop: "20px",
                    border: "2px solid black",
                    padding: "15px",
                    backgroundColor: "#FFFACD",
                    borderRadius: "8px",
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                    fontSize: "16px",
                    width: "80%",
                    margin: "0 auto",
                  }}
                >
                  <p><strong>Aadhaar Number:</strong> {aadhaarDetails.aadhaar_number}</p>
                  <p><strong>Name:</strong> {aadhaarDetails.full_name}</p>
                  <p><strong>Gender:</strong> {aadhaarDetails.gender}</p>
                  <p><strong>DOB:</strong> {aadhaarDetails.dob}</p>
                  <p><strong>Address:</strong> {[
                    aadhaarDetails.address.house,
                    aadhaarDetails.address.street,
                    aadhaarDetails.address.landmark,
                    aadhaarDetails.address.loc,
                    aadhaarDetails.address.po,
                    aadhaarDetails.address.subdist,
                    aadhaarDetails.address.dist,
                    aadhaarDetails.address.state,
                    aadhaarDetails.address.country,
                    aadhaarDetails.address.zip,
                  ].filter(Boolean).join(", ")}</p>

                  <button
                    onClick={() => handleAdharPdf(aadhaarDetails)}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      </div>
    </div>
    {/* Verified Users Section - placed below the verification form */}
      {/* Verified Users Section - placed below the verification form */}
      <div className="verified-users-section container mt-5">
  <h3>Verified Users</h3>
  <div className="date-range-filter">
    <div className="row mb-5">
      <div className="col-md-2">
      <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      placeholder="Start Date"
    />
      </div>
      <div className="col-md-2 offset-md-8">
      <input
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      placeholder="End Date"
    />
      </div>
    </div>
    
    
  </div>
  <table
    className="verified-users-table"
    style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}
  >
    <thead>
      <tr>
        <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "left" }}>Photo</th>
        <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "left" }}>
          Aadhaar Number
        </th>
        <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "left" }}>Name</th>
        <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "left" }}>Gender</th>
        <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "left" }}>DOB</th>
        <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "left" }}>Address</th>
        <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "left" }}>
          Verification Date
        </th>
        <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "left" }}>Action</th>
      </tr>
    </thead>
    <tbody>
    {verifiedUsers
  .filter((user) => {
    const userVerificationDate = new Date(user.verificationDate);
    let isInDateRange = true;

    // Ensure endDate includes the full last minute of the selected date
    let endDateObj = new Date(endDate); // Create a new Date object from the endDate
    if (endDate) {
      endDateObj.setHours(23, 59, 59, 999); // Set to the last millisecond of the day
    }

    // If startDate equals endDate and is provided, filter for that specific date
    if (startDate === endDate && startDate !== "") {
      if (userVerificationDate.toDateString() !== new Date(startDate).toDateString()) {
        isInDateRange = false;
      }
    } else {
      // Check if the user verification date is within the date range
      isInDateRange =
        (startDate === "" || userVerificationDate >= new Date(startDate)) &&
        (endDate === "" || userVerificationDate <= endDateObj); // Use the modified endDateObj here
    }

    return isInDateRange;
  })
  .map((user, index) => (
    <tr key={index} style={{ border: "1px solid #ddd" }}>
      <td style={{ padding: "8px", border: "1px solid #ddd" }}><img
                    src={`data:image/jpeg;base64,${user.profile_image}`}
                    alt="Aadhaar Profile"
                    style={{ width: "150px", height: "150px", borderRadius: "5%" }}
                  /></td>
      <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.aadhaarNumber}</td>
      <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.name}</td>
      <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.gender}</td>
      <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.dob}</td>
      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
        {[
          user?.address?.house,
          user?.address?.street,
          user?.address?.landmark,
          user?.address?.loc,
          user?.address?.po,
          user?.address?.subdist,
          user?.address?.dist,
          user?.address?.state,
          user?.address?.country,
          user?.address?.zip,
        ]
          .filter(Boolean)
          .join(", ") || "No Address Available"}
      </td>
      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
        {new Date(user.verificationDate).toLocaleDateString()}
      </td>
      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
        <button
          onClick={() => handleDownloadPdf(user)}
          title="Download PDF"
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            padding: "5px 10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Download
        </button>
      </td>
    </tr>
  ))}

    </tbody>
  </table>
  <button 
  onClick={() => {
    localStorage.clear(); // Clears all data from localStorage
    alert("All local storage data has been cleared!");
  }} 
  style={{
    padding: "10px 20px",
    backgroundColor: "#FF6347",  // Color for the button
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  }}
>
  Clear All Data
</button>

</div>

    </>
  );
};

export default AadhaarVerificationPage;