import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import * as XLSX from 'xlsx';

const PanDetailTable = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [verifiedUsers, setVerifiedUsers] = useState([]);
  const [users, setUsers] = useState([]); // State to store users list

  
    const handleDownload = () => {
      // Filter the users based on the date range
      const filteredUsers = verifiedUsers.filter((user) => {
        // Parse `formattedDate` into a JavaScript Date object
        const [day, month, year] = user.formattedDate.split("/").map(Number);
        const userVerificationDate = new Date(year, month - 1, day); // Create Date object
    
        let isInDateRange = true;
    
        // Parse startDate and endDate from the input fields
        const startDateObj = startDate ? new Date(startDate) : null;
        let endDateObj = endDate ? new Date(endDate) : null;
    
        // Adjust endDate to include the full day
        if (endDateObj) {
          endDateObj.setHours(23, 59, 59, 999);
        }
    
        // Include users with a `formattedDate` equal to `startDate`
        if (startDate && userVerificationDate.toDateString() === startDateObj.toDateString()) {
          return true;
        }
    
        // Handle case where startDate equals endDate (specific day filtering)
        if (startDate && endDate && startDate === endDate) {
          isInDateRange =
            userVerificationDate.toDateString() === startDateObj.toDateString();
        } else {
          // General range filtering
          isInDateRange =
            (!startDateObj || userVerificationDate >= startDateObj) &&
            (!endDateObj || userVerificationDate <= endDateObj);
        }
    
        return isInDateRange;
      });
    
      if (filteredUsers.length === 0) {
        alert('No data to download');
        return;
      }
    
      // Map the filtered data to match the desired format for Excel export
      const exportData = filteredUsers.map((user,index) => ({
        'SrNo': index + 1,  // You can adjust this if the `SrNo` is not directly available in the data
        'Pan No': user.verifiedData.data.idNumber,
        'Full Name': user.verifiedData.data.fullName,
        'Fathers Name': user.verifiedData.data.middleName,
        'Verification Date': user.formattedDate,
      }));
    
      // Prepare data for Excel
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered Users');
    
      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, 'filtered-users.xlsx');
    };

  // Fetch the verified users from the backend
  useEffect(() => {
    const fetchVerifiedUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/pandetail/verified"
        );
        setVerifiedUsers(response.data); // Set the fetched data into the state
      } catch (error) {
        console.error("Error fetching verified users:", error);
      }
    };
    fetchVerifiedUsers();
  },[]);


  

//   const handleDelete = async (aadharNumber) => {
//     // Show confirmation dialog
//     const isConfirmed = window.confirm("Are you sure you want to delete this user?");
  
//     // If user clicks "Yes"
//     if (isConfirmed) {
//       try {
//         const response = await axios.delete(`http://localhost:5000/api/voter/delete/${aadharNumber}`);
        
//         if (response.data.message === "User deleted successfully.") {
//           // If deletion is successful, update state by filtering out the deleted user
//           setUsers((prevUsers) => prevUsers.filter((user) => user.aadharNumber !== aadharNumber));
//           alert("User deleted successfully.");
//         } else {
//           alert("Failed to delete user.");
//         }
//       } catch (error) {
//         console.error("Error deleting user:", error);
//         alert("Failed to delete user. Please try again.");
//       }
//     } else {
//       // If user clicks "No", just return without deleting
//       alert("User deletion canceled.");
//     }
//   };
  

  // Function to generate and download the PDF
//   const handleDownloadPdf = (user) => {
//     const doc = new jsPDF();

//     // Add title
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(16);
//     doc.text("Aadhaar Verification Details", 14, 20);

//     doc.setLineWidth(0.5);
//     doc.line(10, 22, 200, 22);

//     // Add Aadhaar details
//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(12);
//     doc.text(`Aadhaar Number: ${user.aadharNumber}`, 14, 75);
//     doc.text(`Name: ${user.verifiedData?.data?.full_name}`, 14, 85);
//     doc.text(`Gender: ${user.verifiedData?.data?.gender}`, 14, 95);
//     doc.text(`DOB: ${user.verifiedData?.data?.dob}`, 14, 105);

//     doc.text("Address:", 14, 115);
//     const addressLines = [
//       user?.verifiedData?.data?.address?.house,
//       user?.verifiedData?.data?.address?.street,
//       user?.verifiedData?.data?.address?.landmark,
//       user?.verifiedData?.data?.address?.loc,
//       user?.verifiedData?.data?.address?.po,
//       user?.verifiedData?.data?.address?.subdist,
//       user?.verifiedData?.data?.address?.dist,
//       user?.verifiedData?.data?.address?.state,
//       user?.verifiedData?.data?.address?.country,
//       user?.verifiedData?.data?.address?.zip,
//     ]
//       .filter(Boolean)
//       .join(", ");
//     const addressSplit = doc.splitTextToSize(addressLines, 180);
//     doc.text(addressSplit, 14, 120);

//     // Add the profile image
//     const imageData = `data:image/jpeg;base64,${user.verifiedData.data.profile_image}`;

//     // Add the image to the PDF (positioned at x=14, y=30 with width=50 and height=50)
//     doc.addImage(imageData, "JPEG", 14, 30, 35, 35);

//     // Footer text
//     doc.setFont("helvetica", "italic");
//     doc.setFontSize(10);
//     doc.text("Generated by Aadhaar Verification System", 14, 290);

//     // Save the PDF
//     doc.save(`${user.verifiedData?.data?.full_name}_aadhaar_verification.pdf`);
//   };
const handleDownloadPdf = (user) => {
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
      user.verifiedData.data.fullName || "N/A"
    }, Pan No. ${user.verifiedData.data.idNumber} are verified from https://www.pan.utiitsl.com/.`;
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
    doc.text(user.status || "N/A", contentX + 54, contentY + 5);
  
    doc.setFont("helvetica", "bold");
    doc.text("Id Number                        :", contentX + 2, contentY + 15);
    doc.setFont("helvetica", "normal");
    doc.text(user.verifiedData.data.idNumber ? user.verifiedData.data.idNumber.toString() : "N/A", contentX + 54, contentY + 15);

    doc.setFont("helvetica", "bold");
    doc.text("First Name                       :", contentX + 2, contentY + 25);
    doc.setFont("helvetica", "normal");
    doc.text(user.verifiedData.data.firstName ? user.verifiedData.data.firstName.toString() : "N/A", contentX + 54, contentY + 25);

    doc.setFont("helvetica", "bold");
    doc.text("Middle Name                    :", contentX + 2, contentY + 35);
    doc.setFont("helvetica", "normal");
    doc.text(user.verifiedData.data.middleName ? user.verifiedData.data.middleName.toString() : "N/A", contentX + 54, contentY + 35);

    doc.setFont("helvetica", "bold");
    doc.text("Last Name                        :", contentX + 2, contentY + 45);
    doc.setFont("helvetica", "normal");
    doc.text(user.verifiedData.data.lastName ? user.verifiedData.data.lastName.toString() : "N/A", contentX + 54, contentY + 45);

    doc.setFont("helvetica", "bold");
    doc.text("Full Name                         :", contentX + 2, contentY + 55);
    doc.setFont("helvetica", "normal");
    doc.text(user.verifiedData.data.fullName ? user.verifiedData.data.fullName.toString() : "N/A", contentX + 54, contentY + 55);

    doc.setFont("helvetica", "bold");
    doc.text("PAN Status                       :", contentX + 2, contentY + 65);
    doc.setFont("helvetica", "normal");
    doc.text(user.verifiedData.data.panStatus ? user.verifiedData.data.panStatus.toString() : "N/A", contentX + 54, contentY + 65);

    doc.setFont("helvetica", "bold");
    doc.text("Category                           :", contentX + 2, contentY + 75);
    doc.setFont("helvetica", "normal");
    doc.text(user.verifiedData.data.category ? user.verifiedData.data.category.toString() : "N/A", contentX + 54, contentY + 75);

    doc.setFont("helvetica", "bold");
    doc.text("Aadhaar Seeding Status :", contentX + 2, contentY + 85);
    doc.setFont("helvetica", "normal");
    doc.text(user.verifiedData.data.aadhaarSeedingStatus ? user.verifiedData.data.aadhaarSeedingStatus.toString() : "N/A", contentX + 54, contentY + 85);
  
    
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
    const fileName =user.verifiedData.data.idNumber
      ? `${user.verifiedData.data.fullName}_verification_certificate.pdf`
      : "verification_certificate.pdf";
    doc.save(fileName);
  };

  
  

  return (
    <>
      <h3 style={{
                  marginTop:'120px',fontSize:'28px',color:'darkgoldenrod'
                }}>Verified Users</h3>
      <div className="row mb-3" style={{marginTop:'14px'}}>
  <div className="col-12 col-md-1" style={{width:'100px', marginTop:'13px'}}>
    <p style={{color:'black'}}>From Date</p>
  </div>
  <div className="col-12 col-md-2">
    <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      placeholder="Start Date"
    />
  </div>

  <div className="col-12 col-md-1 mt-md-0 offset-md-1">
    <p  style={{marginTop:'13px',color:'black'}}>To Date</p>
  </div>
  <div className="col-12 col-md-2">
    <input
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      placeholder="End Date"
    />
  </div>

  <div className="col-12 col-md-2 mt-1 mt-md-0">
    <button onClick={handleDownload}>Excel Download</button>
  </div>
</div>

      <div
        style={{
          maxHeight: "400px", // Set the desired maximum height for the table container
          overflowY: "auto", // Enable vertical scrolling
          border: "1px solid #ddd", // Optional: Add a border to the container
        }}
      >
        <table style={{width:'100%'}}>
          <thead>
            <tr>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                  backgroundColor:'hsl(0, 22.60%, 93.90%)'
                }}
              >
                Sr No
              </th>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                  backgroundColor:'hsl(0, 22.60%, 93.90%)'
                }}
              >
                Pan No
              </th>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                  backgroundColor:'hsl(0, 22.60%, 93.90%)'
                }}
              >
                Name
              </th>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                  backgroundColor:'hsl(0, 22.60%, 93.90%)'
                }}
              >
                Father's Name
              </th>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                  backgroundColor:'hsl(0, 22.60%, 93.90%)'
                }}
              >
                Verification Date
              </th>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                  backgroundColor:'hsl(0, 22.60%, 93.90%)'
                }}
              >
                Download
              </th>
            </tr>
          </thead>
          <tbody>
          {verifiedUsers
  .filter((user) => {
    // Parse `formattedDate` into a JavaScript Date object
    const [day, month, year] = user.formattedDate.split("/").map(Number);
    const userVerificationDate = new Date(year, month - 1, day); // Create Date object

    let isInDateRange = true;

    // Parse startDate and endDate from the input fields
    const startDateObj = startDate ? new Date(startDate) : null;
    let endDateObj = endDate ? new Date(endDate) : null;

    // Adjust endDate to include the full day
    if (endDateObj) {
      endDateObj.setHours(23, 59, 59, 999);
    }

     // Include users with a `formattedDate` equal to `startDate`
     if (startDate && userVerificationDate.toDateString() === startDateObj.toDateString()) {
      return true;
    }

    // Handle case where startDate equals endDate (specific day filtering)
    if (startDate && endDate && startDate === endDate) {
      isInDateRange =
        userVerificationDate.toDateString() === startDateObj.toDateString();
    } else {
      // General range filtering
      isInDateRange =
        (!startDateObj || userVerificationDate >= startDateObj) &&
        (!endDateObj || userVerificationDate <= endDateObj);
    }

    return isInDateRange;
  })


              .map((user, index) => (
                <tr key={index} style={{ border: "1px solid #ddd" }}>
                                   <td style={{ padding: "8px", border: "1px solid #ddd" }}>
          {index + 1}
        </td>

                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.verifiedData.data.idNumber}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.verifiedData.data.fullName || "Name not available"}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.verifiedData.data.middleName || "DOB not available"}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.formattedDate || "DOB not available"}</td>

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
                      <box-icon name='download'></box-icon>
                    </button>
                  </td>
                  {/* <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    <button
                    onClick={() => handleDelete(user.aadharNumber)}
                    title="Delete"
                    style={{
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                    >
                      <box-icon name="trash" type="solid"></box-icon>

                    </button>
                </td> */}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* <button
        onClick={() => {
          localStorage.clear(); // Clears all data from localStorage
          alert("All local storage data has been cleared!");
        }}
        style={{
          padding: "10px 20px",
          backgroundColor: "#FF6347", // Color for the button
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Clear All Data
      </button> */}
    </>
  );
};

export default PanDetailTable;
