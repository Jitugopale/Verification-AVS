import React, { useState } from "react";
import axios from "axios";

const PancardVerificationPage = ({
  verificationCount,
  updateVerificationCount,
}) => {
  const [pannumber, setPannumber] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Added loading state
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

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="card p-4 shadow-sm"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <h2 className="text-center mb-4">PAN Card Verification</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="pannumber" className="form-label">
              PAN Number
            </label>
            <input
              type="text"
              className="form-control"
              id="pannumber"
              value={pannumber}
              onChange={(e) => setPannumber(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify PAN"}
          </button>
        </form>

        {loading && <p className="text-center mt-3">Loading...</p>}

        {verificationResult && (
          <div className="mt-4">
            <h3 className="text-success text-center">
              PAN Verification Result
            </h3>
            <p className="text-center">Name: {verificationResult.full_name}</p>
            <p className="text-center">
              PAN Number: {verificationResult.pan_number}
            </p>
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
  );
};

export default PancardVerificationPage;
