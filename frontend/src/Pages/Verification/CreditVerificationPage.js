import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactJson from "react-json-view";
import { jsPDF } from "jspdf";
import MainPdf from "./MainPdf";
import Loan from "./Loan";
// import React, { useRef } from "react"; // Import useRef


const CreditVerificationPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    document_id: "",
    date_of_birth: "",
    address: "",
    pincode: "",
  });
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // useEffect(() => {
  //   // Simulate fetching data or ensure this is your API response logic
  //   setResponseData(responseData.); // Replace apiResponse with your actual data
  // }, []);
  

  // const generatePDF = () => {
  //   const doc = new jsPDF();
    
  //   // Capture the content to be converted into PDF
  //   doc.html(contentRef.current, {
  //     callback: function (doc) {
  //       doc.save("verification_details.pdf");  // Save the generated PDF
  //     },
  //     x: 10,  // Positioning on the page
  //     y: 10,
  //     width: 180, // Width of the content
  //   });
  // };
  
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const renderJson = (data) => {
    if (typeof data === "object" && !Array.isArray(data)) {
      return (
        <ul style={{ listStyleType: "none", paddingLeft: "20px" }}>
          {Object.entries(data).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {renderJson(value)}
            </li>
          ))}
        </ul>
      );
    } else if (Array.isArray(data)) {
      return (
        <ul style={{ listStyleType: "circle", paddingLeft: "20px" }}>
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
    const { name, mobile, document_id, date_of_birth, address, pincode } =
      formData;

    if (
      !name ||
      !mobile ||
      !document_id ||
      !date_of_birth ||
      !address ||
      !pincode
    ) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");
    setResponseData(null);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/credit/credit_report_checker",
        formData
      );

      if (res.data.status === "success") {
        setResponseData(res.data); // Store the successful response data
      } else {
        setError(res.data.message || "Verification failed. Please try again.");
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="container mt-5">
      <h1 class="text-center">Credit Verification</h1>

      <form>
        <div class="mb-3">
          <label for="name" class="form-label">
            Name:
          </label>
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
          <label for="mobile" class="form-label">
            Mobile:
          </label>
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
          <label for="document_id" class="form-label">
            Document ID:
          </label>
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
          <label for="date_of_birth" class="form-label">
            Date of Birth:
          </label>
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
          <label for="address" class="form-label">
            Address:
          </label>
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
          <label for="pincode" class="form-label">
            Pincode:
          </label>
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
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>

      {error && <p class="text-danger mt-3">{error}</p>}

      {responseData && (
        <div>
          <h2>Verification Result</h2>
          <div
            style={{
              padding: "10px",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Container for content to be converted into PDF */}
            {/* ref={contentRef} */}
            <div > 
              {/* Render the main PDF page */}
              <MainPdf data={responseData} />
            
              {/* Dynamically render Loan components */}
              {responseData?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.retailAccountDetails?.length > 0 ? (
                responseData.verifiedData.data.cCRResponse.cIRReportDataLst[0].cIRReportData.retailAccountDetails.map((loan, index) => (
                  <Loan key={index} loanData={loan} />
                ))
              ) : (
                <p>No loan details available.</p>
              )}
            </div>
            
            {/* Button to generate PDF */}
            {/* <button onClick={generatePDF}>Download PDF</button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditVerificationPage;
