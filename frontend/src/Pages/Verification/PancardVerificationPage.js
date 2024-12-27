import React, { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";

const PancardVerificationPage = ({
  verificationCount,
  updateVerificationCount,
}) => {
  const [pannumber, setPannumber] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Added loading state
  const [isVerified, setIsVerified] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setSuccessMessage(""); // Reset success message on new submission
    setError(null); // Clear any previous errors

    try {
      const response = await axios.post(
        "http://localhost:5000/api/pan/verifyPanCard",
        { pannumber }
      );
      setVerificationResult(response.data.verifiedData);
      setSuccessMessage("PAN Card verified successfully!");
    } catch (error) {
      console.error("Error verifying PAN card", error);
      setError(
        error.response?.data?.message ||
          "Something went wrong while verifying the PAN card."
      );
      setVerificationResult(null); // Clear any previous verification result
    } finally {
      setLoading(false); // Stop loading after request finishes
    }
  };


// const generatePDF = () => {
//   if (verificationResult) {
//     const doc = new jsPDF();

//     // Add title with a larger font size and bold style
//     doc.setFontSize(18);
//     doc.setFont("helvetica", "bold");
//     doc.text("PAN Card Verification Report", 20, 20);

//     // Add a space before the data
//     doc.setFontSize(12);
//     doc.setFont("helvetica", "normal");

//     // Add the name with bold styling
//     doc.text(`Name:`, 20, 40);
//     doc.setFont("helvetica", "bold");
//     doc.text(verificationResult.full_name, 60, 40);

//     // Add PAN number with bold styling
//     doc.setFont("helvetica", "normal");
//     doc.text(`PAN Number:`, 20, 50);
//     doc.setFont("helvetica", "bold");
//     doc.text(verificationResult.pan_number, 60, 50);

//     // Add the date in a smaller font size
//     doc.setFontSize(10);
//     doc.setFont("helvetica", "normal");
//     doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 60);

//     // Save the PDF with a styled name
//     doc.save("PAN_Verification_Report.pdf");
//   }
// };


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
  const subtitle = "Pan Verification Certificate";
  doc.text(subtitle, (pageWidth - doc.getTextWidth(subtitle)) / 2, 28);

  // Center-aligned section header
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const header = "TO WHOMSOEVER IT MAY CONCERN";
  doc.text(header, (pageWidth - doc.getTextWidth(header)) / 2, 36);

  // Verification Statement
  const verificationText = `This is to Certify that ${
    verificationResult.full_name || "N/A"
  } are verified from https://www.pan.utiitsl.com/ using and verified Pan No. ${verificationResult.pan_number}.`;
  const verificationSplit = doc.splitTextToSize(verificationText, 180);
  doc.text(verificationSplit, 14, 50);

  // Define positions and dimensions for the outer border
  const outerX = 10;
  const outerY = 65;
  const outerWidth = 190;
  const outerHeight = 45;

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
  doc.text("Name                    :", contentX + 2, contentY + 5);
  doc.setFont("helvetica", "normal");
  doc.text(verificationResult.full_name || "N/A", contentX + 40, contentY + 5);

  doc.setFont("helvetica", "bold");
  doc.text("Pan Number :", contentX + 2, contentY + 15);
  doc.setFont("helvetica", "normal");
  doc.text(verificationResult.pan_number ? verificationResult.pan_number.toString() : "N/A", contentX + 40, contentY + 15);

  
  // Footer with signatures
  doc.setFont("helvetica", "bold");
  doc.text("Signature of the Authorised Signatory", 14, 130);
  doc.text("Signature of the Branch Manager", 110, 130);

  doc.setFont("helvetica", "normal");
  doc.text("Name: __________________", 14, 140);
  doc.text("Name: __________________", 110, 140);

  doc.text("Designation: ____________", 14, 150);
  doc.text("Designation: ____________", 110, 150);

  doc.text("Phone no.: ______________", 14, 160);
  doc.text("Date: ___________________", 110, 160);

  // Bank Seal
  doc.setFont("helvetica", "normal");
  doc.text("(Bank Seal)", 14, 180);
  doc.text("Verified By : User", 120, 180);

  // Save PDF
  const fileName =verificationResult.pan_number
    ? `${verificationResult.full_name}_verification_certificate.pdf`
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
    <div className="container-fluid">
      <div className="container d-flex align-items-center">
      <div
        className="p-2 mt-2"
        style={{ width: "100%", maxWidth: "1000px" }}
      >
        <h2 className="mb-4">PAN Card Verification</h2>
          <div style={styles.statusBar} className='mt-2'>
          <span>No. Of Count: 36</span>
          <span>Your available Credit: -62</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            {/* <label htmlFor="pannumber" className="form-label">
              PAN Number
            </label>
            <input
              type="text"
              className="form-control"
              id="pannumber"
              value={pannumber}
              onChange={(e) => setPannumber(e.target.value)}
              required
            /> */}
            <label>Enter ID Number : &nbsp;</label>
        <input
          type="text"
          value={pannumber}
          onChange={(e) => setPannumber(e.target.value)}
          placeholder="Enter PAN Number"
          id="pannumber"
          style={inputStyle}
        />
          </div>
          {/* <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify PAN"}
          </button> */}
          <div className="buttons mt-3">
        {!isVerified &&<button type="submit" style={styles.button} disabled={loading} >{loading ? 'Verifying...' : 'Verify PAN'}</button>}
            <button style={styles.button}>Excel Report</button>
            <button style={styles.button} onClick={() => setPannumber("")}>Clear</button>
            <button style={styles.button}>Search</button>
          </div>
        </form>

        {loading && <p className="text-center mt-3">Loading...</p>}

        {verificationResult && (
          <div className="mt-4">
            <h3 className="text-success text-center">PAN Verification Result</h3>
            <p className="text-center">Name: {verificationResult.full_name}</p>
            <p className="text-center">PAN Number: {verificationResult.pan_number}</p>

            {/* Button to download PDF */}
            <div className="text-center mt-3">
              <button
                className="btn btn-success"
                onClick={generatePDF}
                disabled={!verificationResult}
              >
                Download PDF
              </button>
            </div>
          </div>
        )}

        {verificationCount >= 5 && (
          <div
            className="alert alert-success mt-3"
            role="alert"
            onClick={updateVerificationCount}
          >
            {successMessage}
          </div>
        )}

        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
    </div>
    
  );
};

export default PancardVerificationPage;
