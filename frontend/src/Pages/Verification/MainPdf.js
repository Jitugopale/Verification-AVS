import React from "react";

const MainPdf = ({ data }) => {
    ;

  return (
    <>
      <div className="container border p-5" style={{fontSize:"75%"}}>
  <div className="row mb-4">
      <h1 className="">CIBIL COMBO REPORT</h1>
    <div className="col-md-4" id="firstheader">
      <table className="table table-borderless">
        <tbody><tr>
            <th>Consumer Name</th>
            <td>{data?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo?.personalInfo?.name?.firstName}</td>
          </tr>
          <tr >
            <th>Enquiry ID</th>
            <td>MF83111001_10</td>
          </tr>
          <tr>
            <th>Member Reference No</th>
            <td>{data?.verifiedData?.reference_id}
            </td>
          </tr>
          <tr>
            <th>Branch ID</th>
            <td />
          </tr>
        </tbody></table>
    </div>
    <div className="col-md-4 offset-md-4">
      <table className="table table-borderless" style={{borderWidth: '0.5px'}}>
        <tbody><tr>
            <th>Date</th>
            <td>16-12-2024</td>
          </tr>
          <tr>
            <th>Time</th>
            <td>09:46:12</td>
          </tr>
          <tr>
            <th>Control Number</th>
            <td>000050270017</td>
          </tr>
          <tr>
            <th>Kendra/Centre</th>
            <td />
          </tr>
        </tbody></table>
    </div>
  </div>
  <div className="card">
    <div className="card-body">
    <div className="alert alert-dark text-white fw-bold" style={{padding:"5px",backgroundColor:'#33a7c9'}} role="alert">
        <strong style={{fontSize:"18px"}}>SEARCH INFORMATION</strong>
      </div>
      {/* Add the table-bordered class for borders */}
      <table className="table table-bordered">
        <tbody><tr>
            <th>Name</th>
            <td>{data?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo?.personalInfo?.name?.firstName}</td>
            <th>PAN</th>
            <td>{data?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.identityInfo?.pANId?.[0]?.idNumber}
            </td>
          </tr>
          <tr>
            <th>KEY PERSON NAME</th>
            <td>{data?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo?.personalInfo?.name?.middleName} {data?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo?.personalInfo?.name?.lastName}</td>
            <th>UID</th>
            <td>XXXXXXXXXXXX</td>
          </tr>
          <tr>
            <th>DOB</th>
            <td>{data?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo?.personalInfo?.dateOfBirth}</td>
            <th>Mobile</th>
            <td>{data?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo?.phoneInfo?.[0]?.number}
            </td>
          </tr>
          <tr>
            <th>Gender</th>
            <td>{data?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo?.personalInfo?.gender}</td>
          </tr>
          <tr>
            <th>Current Address</th>
            <td colSpan={3}>2 Shree Charan Chwal Shanti Nagar, Mumbra Colony Road, DIVA East, Thane,
              Maharashtra 400612</td>
          </tr>
        </tbody></table>
      <div className="alert alert-dark text-white fw-bold" style={{padding:"5px",backgroundColor:'#33a7c9'}} role="alert">
        <strong style={{fontSize:"18px"}}>CONSUMER INFORMATION</strong>
      </div>
      {/* Add the table-bordered class for borders */}
      <table className="table table-bordered">
        <tbody><tr className="bg-secondary">
            <th className="card-header" colSpan={2} style={{backgroundColor:'#f5f52a'}}>Borrower Details</th>
            <th className="card-header" colSpan={2} style={{backgroundColor:'#f5f52a'}}>Identification</th>
            <th className="card-header" colSpan={2} style={{backgroundColor:'#f5f52a'}}>Telephone Details</th>
          </tr>
          <tr>
            <th>Name</th>
            <td>{data?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo?.personalInfo?.name?.fullName}</td>
            <th>PAN</th>
            <td>{data?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.identityInfo?.pANId?.[0]?.idNumber}
            {data?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.identityInfo?.pANId?.[0]?.idNumber}
            {data?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.identityInfo?.pANId?.[0]?.idNumber}


            </td>
            <th>Home</th>
            <td>9594598994</td>
          </tr>
          <tr>
            <th>DOB</th>
            <td>{data?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo?.personalInfo?.dateOfBirth}</td>
            <th>CKYC</th>
            <td>{data?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.identityInfo?.otherId?.[0]?.idNumber}
            </td>
            <th>Mobile</th>
            <td>{data?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo?.phoneInfo?.[0]?.number}

            </td>
          </tr>
          <tr>
            <th>Gender</th>
            <td>{data?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo?.personalInfo?.gender}</td>
            <th>UID</th>
            <td>XXXXXXXXXXXX</td>
            <th>Not Classified</th>
            <td>9137765485</td>
          </tr>
          <tr>
            <th />
            <td />
            <th>Ration Card</th>
            <td>47AA965450</td>
            <th>Email</th>
            <td>{data?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo?.personalInfo?.email}
            </td>
          </tr>
          <tr>
            <th>Address</th>
            <td colSpan={3}>{data?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo?.addressInfo?.[0]?.address}
            </td>
            <th>Date Reported</th>
            <td>14-03-2024</td>
          </tr>
          <tr>
            <th>Category</th>
            <td colSpan={3}>Current Address</td>
            <td />
            <td />
          </tr>
          <tr>
            <th>Address</th>
            <td colSpan={3}>2 Shree Charan Chwal Shanti Nagar, Mumbra Colony Road, DIVA East, Thane,
              Maharashtra 400612</td>
            <th>Date Reported</th>
            <td>14-03-2024</td>
          </tr>
          <tr>
            <th>Category</th>
            <td colSpan={3}>Permanent Address</td>
            <td />
            <td />
          </tr>
        </tbody></table>
        <div className="alert alert-dark text-white fw-bold" style={{padding:"5px",backgroundColor:'#33a7c9'}} role="alert">
        <strong style={{fontSize:"18px"}}>CREDIT REPORT SUMMARY</strong>
      </div>
      {/* Table with 13 Columns */}
      <table className="table table-bordered">
        {/* First Row (Column Headers) */}
        <thead>
          <tr>
            <th style={{backgroundColor:'#f5f52a'}}>Name of MFI Instruction</th>
            <th style={{backgroundColor:'#f5f52a'}}>Recent Date Reported</th>
            <th style={{backgroundColor:'#f5f52a'}}>Oldest Date Reported</th>
            <th style={{backgroundColor:'#f5f52a'}}>Total Account</th>
            <th style={{backgroundColor:'#f5f52a'}}>Live Account</th>
            <th style={{backgroundColor:'#f5f52a'}}>Closed Account</th>
            <th style={{backgroundColor:'#f5f52a'}}>Overdue Account</th>
            <th style={{backgroundColor:'#f5f52a'}}>Written off Account</th>
            <th style={{backgroundColor:'#f5f52a'}}>Total Sanctioned Amount</th>
            <th style={{backgroundColor:'#f5f52a'}}>Total Current Balance</th>
            <th style={{backgroundColor:'#f5f52a'}}>Total Overdue Amount</th>
            <th style={{backgroundColor:'#f5f52a'}}>Total Installment Amount</th>
            <th style={{backgroundColor:'#f5f52a'}}>Total Written Off Amount</th>
          </tr>
        </thead>
        {/* Second Row (Data Entry) */}
        <tbody>
          <tr>
            <td>UNITY SMALL FINANCE BANK LIMITED</td>
            <td>01-11-2024</td>
            <td>01-04-2024</td>
            <td>2</td>
            <td>1</td>
            <td>1</td>
            <td>0</td>
            <td>0</td>
            <td>60,000</td>
            <td>45,389</td>
            <td />
            <td>3,210</td>
            <td />
          </tr>
          <tr>
            <td>UNNATI FINSERV PRIVATE LIMITED</td>
            <td>01-11-2024</td>
            <td>01-10-2023</td>
            <td>1</td>
            <td>1</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>43,700</td>
            <td>23,645</td>
            <td />
            <td>2,530</td>
            <td />
          </tr>
          {/* Total Row */}
          <tr>
            <td className="text-end"><strong>Total</strong></td>
            <td />
            <td />
            <td>10</td>
            <td>8</td>
            <td>2</td>
            <td>0</td>
            <td>0</td>
            <td>2,43,700</td>
            <td>1,93,645</td>
            <td />
            <td>14,530</td>
            <td />
          </tr>
        </tbody>
      </table>
      <small>*Ammount , Balance and Written-off status are only for live accounts</small>
    </div>
  </div>
</div>

    </>
  );
};

export default MainPdf;
