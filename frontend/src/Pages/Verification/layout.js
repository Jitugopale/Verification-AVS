import React from "react";

const AadhaarVerificationPage = () => {
  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      margin: "20px",
      padding:"10px"
    },
    header: {
      backgroundColor: "#008080",
      color: "white",
      padding: "10px",
      display: "flex",
      justifyContent: "space-between",
    },
    headerTitle: {
      margin: "0",
      fontSize: "18px",
    },
    userInfo: {
      display: "flex",
      flexDirection: "column",
      textAlign: "right",
    },
    content: {
      margin: "20px 0",
    },
    sectionTitle : {
      fontSize: "25px", // Slightly larger than before
      fontWeight: "bold", // Bold font for emphasis
      textAlign: "left", // Center align the text
      color: "#00796B", // Greenish-blue color matching the theme
      margin: "10px 0", // Space around the heading
    },
    
    statusBar: {
      backgroundColor: "#f1f1f1",
      padding: "10px",
      display: "flex",
      justifyContent: "space-between",
      border: "1px solid #ccc",
      marginBottom: "20px",
    },
    verificationSection: {
      marginBottom: "20px",
    },
    label: {
      marginRight: "10px",
    },
    input: {
      marginRight: "10px",
      padding: "5px",
    },
    button: {
      marginRight: "10px",
      padding: "5px 10px",
      backgroundColor: "#008080",
      color: "white",
      border: "none",
      cursor: "pointer",
    },
    buttonHover: {
      backgroundColor: "#005757",
    },
  };

  return (
    <div style={styles.container}>

      <div style={styles.content}>
        <h2 style={styles.sectionTitle}>Aadhar Verification V2 Preview</h2>
        <div style={styles.statusBar}>
          <span>No. Of Count: 36</span>
          <span>Your available Credit: -62</span>
        </div>

        <div style={styles.verificationSection}>
          <label htmlFor="aadhar-number" style={styles.label}>
            Enter Aadhar No.:
          </label>
          <input
            type="text"
            id="aadhar-number"
            placeholder="Aadhar Number"
            style={styles.input}
          />
          <div className="buttons mt-3">
            <button style={styles.button}>Verify Aadhar</button>
            <button style={styles.button}>Excel Report</button>
            <button style={styles.button}>Clear</button>
            <button style={styles.button}>Search</button>
          </div>
        </div>

        <div className="date-section">
          <label htmlFor="from-date" style={styles.label}>
            From Date:
          </label>
          <input type="date" id="from-date" style={styles.input} />
          <label htmlFor="to-date" style={styles.label}>
            To Date:
          </label>
          <input type="date" id="to-date" style={styles.input} />
          <button style={styles.button}>Excel Download</button>
        </div>
      </div>
    </div>
  );
}

export default AadhaarVerificationPage;
