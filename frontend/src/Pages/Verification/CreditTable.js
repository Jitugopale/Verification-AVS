import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx"; // Import xlsx library


const CreditTable = ({ generatePDF }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [verifiedUsers, setVerifiedUsers] = useState([]);
  const [users, setUsers] = useState([]); // State to store users list

  // Fetch the verified users from the backend
  useEffect(() => {
    const fetchVerifiedUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/credit/verified"
        );
        setVerifiedUsers(response.data); // Set the fetched data into the state
      } catch (error) {
        console.error("Error fetching verified users:", error);
      }
    };
    fetchVerifiedUsers();
  }, []);


  // Function to handle Excel download with proper spacing and formatting


const handleExcelDownload = () => {
  // Map verified users data to Excel format
  const excelData = verifiedUsers.map((user, index) => ({
    "Sr No": index + 1,
    "Pancard No": user.verifiedData?.data?.cCRResponse
      ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
      ?.identityInfo?.pANId?.[0]?.idNumber || "Not available",
    Name: user.verifiedData?.data?.cCRResponse
      ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
      ?.personalInfo?.name?.fullName || "Not available",
    "Mobile No": user.verifiedData?.data?.cCRResponse
      ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo?.phoneInfo
      ?.find((phone) => phone.typeCode === "M")?.number || "Not available",
    Address: user.verifiedData?.data?.cCRResponse
      ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
      ?.addressInfo?.[0]?.address || "Not available",
    "Date of Birth (DOB)": user.verifiedData?.data?.cCRResponse
      ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
      ?.personalInfo?.dateOfBirth || "Not available",
    "Verification Date": user.formattedDate || "Not available",
  }));

  // Create a workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);

  // Dynamically calculate column widths for better readability
  const columnWidths = excelData.reduce((colWidths, row) => {
    Object.values(row).forEach((cell, colIndex) => {
      const valueLength = cell ? cell.toString().length : 10;
      colWidths[colIndex] = Math.max(colWidths[colIndex] || 10, valueLength);
    });
    return colWidths;
  }, []);

  ws["!cols"] = columnWidths.map((width) => ({ wch: width + 2 })); // Add padding to widths

  // Append worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, "Verified Users");

  // Trigger file download
  XLSX.writeFile(wb, "Verified_Users.xlsx");
};

  const handleDelete = async (aadharNumber) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
  
    // If user clicks "Yes"
    if (isConfirmed) {
      try {
        const response = await axios.delete(`http://192.168.20.151:4000/api/adhar/delete/${aadharNumber}`);
        
        if (response.data.message === "User deleted successfully.") {
          // If deletion is successful, update state by filtering out the deleted user
          setUsers((prevUsers) => prevUsers.filter((user) => user.aadharNumber !== aadharNumber));
          alert("User deleted successfully.");
        } else {
          alert("Failed to delete user.");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      }
    } else {
      // If user clicks "No", just return without deleting
      alert("User deletion canceled.");
    }
  };
  

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



  return (
    <>
      <h3 style={{
                  marginTop:'120px'
                }}>Verified Users</h3>
      <div className="row mb-5">
        <div className="col-md-2 d-flex">
        <span>From Date</span>

          <input
          style={{marginLeft:'10px'}}
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
          />
        </div>
        <div className="col-md-2 d-flex offset-md-2">
        <span>From Date</span>

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
          />
        </div>
        <div className="col-2">
          <button onClick={handleExcelDownload}>Excel Download</button>
        </div>
      </div>

      <div
        style={{
          maxHeight: "400px", // Set the desired maximum height for the table container
          overflowY: "auto", // Enable vertical scrolling
          border: "1px solid #ddd", // Optional: Add a border to the container
        }}
      >
        <table>
          <thead>
            <tr>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                }}
              >
                Pancard No
              </th>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                }}
              >
                Name
              </th>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                }}
              >
                Mobile No
              </th>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                }}
              >
                Address
              </th>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                }}
              >
                DOB
              </th>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                }}
              >
                Verification Date
              </th>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                }}
              >
                Download
              </th>
              {/* <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                }}
              >
                Delete
              </th> */}
            </tr>
          </thead>
          <tbody>
            {verifiedUsers
              .filter((user) => {
                const userVerificationDate = new Date(user.verificationDate);
                let isInDateRange = true;

                // Ensure endDate includes the full last minute of the selected date
                let endDateObj = new Date(endDate);
                if (endDate) {
                  endDateObj.setHours(23, 59, 59, 999); // Set to the last millisecond of the day
                }

                // If startDate equals endDate and is provided, filter for that specific date
                if (startDate === endDate && startDate !== "") {
                  if (
                    userVerificationDate.toDateString() !==
                    new Date(startDate).toDateString()
                  ) {
                    isInDateRange = false;
                  }
                } else {
                  // Check if the user verification date is within the date range
                  isInDateRange =
                    (startDate === "" ||
                      userVerificationDate >= new Date(startDate)) &&
                    (endDate === "" || userVerificationDate <= endDateObj); // Use the modified endDateObj here
                }

                return isInDateRange;
              })
              .map((user, index) => (
                <tr key={index} style={{ border: "1px solid #ddd" }}>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {user.verifiedData?.data?.cCRResponse
                        ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
                        ?.identityInfo?.pANId?.[0]?.idNumber  || "Not available"}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.verifiedData?.data?.cCRResponse
                        ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
                        ?.personalInfo?.name?.fullName  || "Not available"}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo?.phoneInfo?.find(
                        (phone) => phone.typeCode === "M"
                      )?.number  || "Not available"}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.verifiedData?.data?.cCRResponse
                        ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
                        ?.addressInfo?.[0]?.address  || "Not available"}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.verifiedData?.data?.cCRResponse
                        ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
                        ?.personalInfo?.dateOfBirth || "Not available"}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    {user.formattedDate  || "Not available"}
                </td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    <button 
                      onClick={generatePDF}
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
     
    </>
  );
};

export default CreditTable;
