import React from 'react';

const Loan = () => {
  const styles = {
    body: {
      fontFamily: 'Arial, sans-serif',
      margin: 0,
      padding: 0,
      backgroundColor: '#f4f4f4',
    },
    container: {
      width: '80%',
      margin: '20px auto',
      background: '#fff',
      padding: '20px',
      border: '1px solid #ddd',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '2px solid #004aad',
      paddingBottom: '10px',
      marginBottom: '20px',
    },
    headerImg: {
      width: '150px',
    },
    headerH1: {
      color: '#004aad',
      fontSize: '20px',
    },
    section: {
      marginBottom: '20px',
    },
    sectionH2: {
      backgroundColor: '#004aad',
      color: '#fff',
      padding: '10px',
      margin: 0,
      fontSize: '16px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '10px',
    },
    tableBorder: {
      border: '1px solid #ddd',
    },
    th: {
      backgroundColor: '#f2f2f2',
      padding: '10px',
      textAlign: 'left',
    },
    td: {
      padding: '10px',
      textAlign: 'left',
    },
    highlight: {
      backgroundColor: '#ffcc00',
      fontWeight: 'bold',
    },
    center: {
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerH1}>TransUnion CIBIL</h1>
        <img style={styles.headerImg} src="https://via.placeholder.com/150" alt="TransUnion CIBIL Logo" />
      </div>
      <div style={styles.section}>
        <h2 style={styles.sectionH2}>CIBIL Combo Report</h2>
        <table style={styles.table}>
          <tbody>
            <tr style={styles.tableBorder}>
              <th style={styles.th}>Consumer Name</th>
              <td style={styles.td}>Ranjana</td>
              <th style={styles.th}>Date</th>
              <td style={styles.td}>16-12-2024</td>
            </tr>
            <tr style={styles.tableBorder}>
              <th style={styles.th}>Enquiry ID</th>
              <td style={styles.td}>RM#113001_10</td>
              <th style={styles.th}>Time</th>
              <td style={styles.td}>09:41:12</td>
            </tr>
            <tr style={styles.tableBorder}>
              <th style={styles.th}>Member Reference No.</th>
              <td style={styles.td}>264382</td>
              <th style={styles.th}>Control Number</th>
              <td style={styles.td}>0005207017</td>
            </tr>
            <tr style={styles.tableBorder}>
              <th style={styles.th}>Branch ID</th>
              <td colSpan={3} style={styles.td}>--</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={styles.section}>
        <h2 style={styles.sectionH2}>Member Name: Unity Small Finance Bank Limited</h2>
        <table style={styles.table}>
          <tbody>
            <tr style={styles.tableBorder}>
              <th style={styles.th}>Borrower Details</th>
              <th style={styles.th}>Identification</th>
              <th style={styles.th}>Family Details</th>
            </tr>
            <tr style={styles.tableBorder}>
              <td style={styles.td}>
                <p>Name: Ranjana Pandurang Mohite</p>
                <p>DOB: 01-03-1990</p>
                <p>Gender: Female</p>
                <p>Marital Status: Married</p>
                <p>Address: 2 Shree Charan Chawl...</p>
              </td>
              <td style={styles.td}>
                <p>PAN: ERPPM0095P</p>
              </td>
              <td style={styles.td}>
                <p>No. of Dependents: 2</p>
                <p>Husband: Pandurang Ganpat Mohite</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={styles.section}>
        <h2 style={styles.sectionH2}>Account Status: Active</h2>
        <table style={styles.table}>
          <tbody>
            <tr style={styles.tableBorder}>
              <th style={styles.th}>Account Type</th>
              <td style={styles.td}>702</td>
              <th style={styles.th}>Credit Grantor</th>
              <td style={styles.td}>Unity Small Finance Bank Limited</td>
            </tr>
            <tr style={styles.tableBorder}>
              <th style={styles.th}>Account No.</th>
              <td style={styles.td}>1125-0015765</td>
              <th style={styles.th}>Loan Purpose</th>
              <td style={styles.td}>Manufacturing</td>
            </tr>
            <tr style={styles.tableBorder}>
              <th style={styles.th}>Sanctioned Amount</th>
              <td style={styles.td}>60,000</td>
              <th style={styles.th}>Current Balance</th>
              <td style={styles.td}>45,389</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={styles.section}>
        <h2 style={styles.sectionH2}>Days Past Due</h2>
        <table style={styles.table}>
          <tbody>
            <tr style={styles.tableBorder}>
              <th style={styles.th}>Year</th>
              <th style={styles.th}>Jan</th>
              <th style={styles.th}>Feb</th>
              <th style={styles.th}>Mar</th>
              <th style={styles.th}>Apr</th>
              <th style={styles.th}>May</th>
              <th style={styles.th}>Jun</th>
              <th style={styles.th}>Jul</th>
              <th style={styles.th}>Aug</th>
              <th style={styles.th}>Sep</th>
              <th style={styles.th}>Oct</th>
              <th style={styles.th}>Nov</th>
              <th style={styles.th}>Dec</th>
            </tr>
            <tr style={styles.tableBorder}>
              <td style={styles.td}>2024</td>
              <td style={{ ...styles.td, ...styles.center }}>000</td>
              <td style={{ ...styles.td, ...styles.center }}>000</td>
              <td style={{ ...styles.td, ...styles.center }}>000</td>
              <td style={{ ...styles.td, ...styles.center }}>000</td>
              <td style={{ ...styles.td, ...styles.center }}>000</td>
              <td style={{ ...styles.td, ...styles.center }}>000</td>
              <td style={{ ...styles.td, ...styles.center }}>000</td>
              <td style={{ ...styles.td, ...styles.center }}>000</td>
              <td style={{ ...styles.td, ...styles.center }}>000</td>
              <td style={{ ...styles.td, ...styles.center }}>000</td>
              <td style={{ ...styles.td, ...styles.center }}>000</td>
              <td style={{ ...styles.td, ...styles.center }}>000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Loan;
