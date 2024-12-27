import React from 'react';
import "./Loan.css";
const Loan = () => {
  // const styles = {
    
    
  // };

  return (
    <>
           <div className="container my-4 border" style={{width:'70%'}}>
  <div className="row">
    <div className="col-12 text-center">
      <h1 className="text-primary">CIBIL Combo Report</h1>
    </div>
  </div>
  <div className="row my-3">
    <div className="col-md-4">
      <table className="table table-borderless">
        <tbody><tr>
            <td><strong>Consumer Name:</strong></td>
            <td>RANJANA</td>
          </tr>
          <tr>
            <td><strong>Enquiry ID:</strong></td>
            <td>MF8311001_10</td>
          </tr>
          <tr>
            <td><strong>Member Reference No:</strong></td>
            <td>284032</td>
          </tr>
          <tr>
            <td><strong>Branch ID:</strong></td>
            <td>1123</td>
          </tr>
        </tbody></table>
    </div>
    <div className="col-md-4 offset-md-4">
      <table className="table table-borderless">
        <tbody><tr>
            <td><strong>Date:</strong></td>
            <td>16-12-2024</td>
          </tr>
          <tr>
            <td><strong>Time:</strong></td>
            <td>09:46:12</td>
          </tr>
          <tr>
            <td><strong>Control Number:</strong></td>
            <td>000050270017</td>
          </tr>
          <tr>
            <td><strong>Kendra / Centre:</strong></td>
            <td />
          </tr>
        </tbody></table>
    </div>
  </div>
  <div className="p-4">
    <div className="row my-2">
      <div className="col-12">
        <table className="table table-bordered data-table" style={{width: '100%', tableLayout: 'fixed'}}>
          <tbody><tr>
              <th colSpan={2} style={{backgroundColor: 'yellow'}}>BORROWER DETAILS</th>
              <th colSpan={2} style={{backgroundColor: 'yellow'}}>IDENTIFICATION</th>
              <th colSpan={2} style={{backgroundColor: 'yellow'}}>FAMILY DETAILS</th>
            </tr>
            <tr>
              <th>Name</th>
              <td>RANJANA PANDURANG MOHITE</td>
              <th>PAN</th>
              <td>ERPPM0099P</td>
              <th>No. of Dependents</th>
              <td>2</td>
            </tr>
            <tr>
              <th>DOB</th>
              <td>01-03-1990</td>
              <th />
              <td />
              <th>Husband</th>
              <td>PANDURANG GANPAT MOHITE</td>
            </tr>
            <tr>
              <th>Gender</th>
              <td>FEMALE</td>
              <th />
              <td />
              <th />
              <td />
            </tr>
            <tr>
              <th>Marital Status</th>
              <td>MARRIED</td>
              <th />
              <td />
              <th />
              <td />
            </tr>
            <tr>
              <th>Address</th>
              <td colSpan={3}>
                2 SHREE CHARAN CHWAL SHANTI NAGAR MUMBRA COLONY ROAD, DIVA EAST, THANE, MAHARASHTRA
                400612
              </td>
              <th>Reported Date</th>
              <td>14-03-2024</td>
            </tr>
            <tr>
              <th>ADDRESS</th>
              <td colSpan={3}>
                2 SHREE CHARAN CHWAL SHANTI NAGAR MUMBRA COLONY ROAD, DIVA EAST, THANE, MAHARASHTRA
                400612
              </td>
              <th>Reported Date</th>
              <td>14-03-2024</td>
            </tr>
          </tbody></table>
      </div>
    </div>
    <div className="sub-title">ACCOUNT STATUS: CLOSED</div>
    <div className="row my-3">
      <div className="col-12">
        <table className="table table-bordered data-table" style={{width: '100%', tableLayout: 'fixed'}}>
          <tbody><tr>
              <th colSpan={6} style={{backgroundColor: 'yellow'}}>ACCOUNT INFORMATION</th>
            </tr>
            <tr>
              <th>Account Type</th>
              <td>JLG INDIVIDUAL</td>
              <th>Credit Grantor</th>
              <td>UNITY SMALL FINANCE BANK LIMITED</td>
              <th>No. of Installments</th>
              <td>24</td>
            </tr>
            <tr>
              <th>Account No.</th>
              <td>1123-0014554</td>
              <th>Loan Purpose</th>
              <td>MANUFACTURING</td>
              <th>Repayment Frequency</th>
              <td>MONTHLY</td>
            </tr>
            <tr>
              <th>BRANCH ID</th>
              <td>1123</td>
              <th>Kendra ID</th>
              <td>1123</td>
              <th />
              <td />
            </tr>
          </tbody></table>
        <table className="table table-bordered " style={{width: '100%', tableLayout: 'fixed'}}>
          <tbody><tr><th colSpan={6} style={{backgroundColor: 'yellow'}}>DATES</th></tr>
            <tr>
              <th>OPEN / DISURSHED Date</th>
              <td>05-05-2023</td>
              <th>WRITTEN-OFF Date</th>
              <td>10-04-2024</td>
              <th>CLOSED Date</th>
              <td>30-06-2024</td>
            </tr>
            <tr>
              <th>Sanctioned Date</th>
              <td>05-05-2023</td>
              <th>Last Payment Date</th>
              <td>10-04-2024</td>
              <th>Reported Date</th>
              <td>30-06-2024</td>
            </tr>
          </tbody></table>
        <table className="table table-bordered " style={{width: '100%', tableLayout: 'fixed'}}>
          <tbody><tr><th colSpan={6} style={{backgroundColor: 'yellow'}}>AMOUNT</th></tr>
            <tr>
              <th>DISBURED AMOUNT </th>
              <td>35,000</td>
              <th>WRITTEN-OFF AMOUNT</th>
              <td />
              <th>CURRENT BALANCE</th>
              <td />
            </tr>
            <tr>
              <th>SANCTIONED AMMOUNT</th>
              <td>35,000</td>
              <th>LAST PAYMENT AMMOUNT</th>
              <td>1,870</td>
              <th>OVERDUE</th>
              <td />
            </tr>
            <tr>
              <th>INSTALLMENT AMMOUNT</th>
              <td>1,870</td>
              <th />
              <td />
              <th />
              <td />
            </tr>
          </tbody></table>
        <table className="table table-bordered " style={{width: '50%', tableLayout: 'fixed'}}>
          <tbody><tr><th colSpan={2} style={{backgroundColor: 'yellow'}}>ACCOUNT STATUS</th></tr>
            <tr>
              <th>ACCOUNT STATUS</th>
              <td>CLOSED</td>
            </tr>
            <tr>
              <th>REASON</th>
              <td />
            </tr>
          </tbody></table>
      </div>
    </div>
    <div className="row my-3">
      <div className="col-12">
        <div className="section-title">DAYS PAST DUE</div>
        <table className="table table-bordered text-center">
          <thead>
            <tr>
              <th>Year</th>
              <th>DEC</th>
              <th>NOV</th>
              <th>OCT</th>
              <th>SEP</th>
              <th>AUG</th>
              <th>JUL</th>
              <th>JUN</th>
              <th>MAY</th>
              <th>APR</th>
              <th>MAR</th>
              <th>FEB</th>
              <th>JAN</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2024</td>
              <td />
              <td />
              <td />
              <td>000</td>
              <td>000</td>
              <td>000</td>
              <td>000</td>
              <td>000</td>
              <td>000</td>
              <td>000</td>
              <td>000</td>
              <td>000</td>
            </tr>
            <tr>
              <td>2023</td>
              <td>000</td>
              <td>000</td>
              <td>000</td>
              <td>000</td>
              <td>000</td>
              <td>000</td>
              <td>000</td>
              <td>000</td>
              <td>000</td>
              <td>000</td>
              <td>000</td>
              <td>000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

    </>
  );
};

export default Loan;
