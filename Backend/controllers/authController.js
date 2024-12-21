import bcrypt from "bcrypt"
import dotenv from 'dotenv';
import {validationResult} from 'express-validator';
import jwt from "jsonwebtoken"
import Adhar from "../models/AadhaarSchema.js"
import User from "../models/userSchema.js"
import Pan from "../models/PanSchema.js"
import GST from "../models/GSTSchema.js"
import VOTER from "../models/VoterSchema.js"
import PanDetail from "../models/PanDetailSchema.js";
import Passport from "../models/PassportSchema.js"
import Udyam from "../models/UdyamSchema.js"
import VerificationCount from "../models/VerificationCount.js"
import axios from 'axios';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const SendOTP= process.env.SendOTP;
const VerifyOTP=process.env.VerifyOTP;
const Agent = process.env.Agent;
const PanVerify = process.env.PanVerify;
const authorisedkey = process.env.authorisedkey;
const VerifyVoter = process.env.VerifyVoter;
const VerifyPassport = process.env.VerifyPassport;
const VerifyCredit = process.env.VerifyCredit;
const VerifyGST = process.env.VerifyGST;
const VerifyUdyam = process.env.VerifyUdyam;
const VerifyPanDetails = process.env.VerifyPanDetails;
const partnerId = process.env.partnerId;
const API_SECRET = process.env.API_SECRET;
const Check = process.env.Check;

//Create User
export const createUserController =  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        fname: req.body.fname,
        Lname: req.body.Lname,
        Address: req.body.Address,
        PhoneNo: req.body.PhoneNo,
        email: req.body.email,
        password: secPass,
        City: req.body.City,
      });

      const data = { id: user.id };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.status(201).json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }

//login User
export const loginController =  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      console.log("Password Comparison:", passwordCompare); 

      if (!passwordCompare) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const data = { id: user.id };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken });
      console.log(JWT_SECRET);
    } catch (error) {
      console.log(JWT_SECRET);
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
}

//Get user
export const getuserController =  async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.json(user); 
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
}

//Sent otp Aadhar
export const aadhaarOtpController = async (req, res) => {
  const { aadharNumber } = req.body;

  if (!aadharNumber) {
    return res.status(400).json({ message: "Aadhar number is required" });
  }

  // Check if Voter data already exists in the database
  const existingAadhaar = await Adhar.findOne({ aadharNumber });
  if (existingAadhaar) {
    return res.status(200).json({
      status: 'success',
      message: 'Aadhaar is already verified.',
      verifiedData: existingAadhaar.verifiedData, // Returning existing verified data
    });
  }

  try {
    const token = createToken();
    console.log(token)

    const otpResponse = await axios.post(
      SendOTP,
      { id_number: aadharNumber },
      {
        headers: {
          'Token': token,
          // 'Authorization': `Bearer ${token}` ,
          'User-Agent': Agent,
        }
      }
    );

    if (otpResponse.status === 200) {
      const otpToken = jwt.sign(
        { client_id: otpResponse.data.data.client_id },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.json({
        message: "OTP sent successfully.",
        token: otpToken, 
        client_id: otpResponse.data.data.client_id,
      });
    } else {
      return res.status(500).json({ message: "Failed to generate OTP" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.response?.data?.message || "Error generating OTP. Please try again."
    });
  }
};

function createToken() {
  const secretKey = process.env.secretKey;
  const symmetricKey = Buffer.from(secretKey, 'utf8');
  const unixTimeStamp = Math.floor(Date.now() / 1000);

  const token = jwt.sign(
    { timestamp: unixTimeStamp, partnerId: Agent, reqid: '1111' },
    symmetricKey,
    { algorithm: 'HS256', expiresIn: '1h' }
  );
  return token;
}


//Verify Aadhar
export const verifyAadhaarOtpController = async (req, res) => {
  const { clientId, OTP, aadharNumber } = req.body;

  if (!clientId || !OTP || !aadharNumber) {
    return res.status(400).json({ message: "Client ID, OTP, and Aadhar number are required" });
  }

  try {
    const token = createToken();
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const secretKey = process.env.secretKey; 
    jwt.verify(token, Buffer.from(secretKey, 'utf8'), (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Signature verification failed" });
      }
      
      verifyOtp(clientId, OTP, token,aadharNumber, res);
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.response?.data?.message || "Error verifying OTP. Please try again."
    });
  }
};

async function verifyOtp(clientId, OTP, token,aadharNumber, res) {
  try {
    const otpVerifyResponse = await axios.post(
      VerifyOTP,
      { client_id: clientId, otp: OTP },
      {
        headers: {
          'Token': token,  
          'User-Agent': Agent
        }
      }
    );
    console.log('OTP Verification Response:', otpVerifyResponse.data);


    if (otpVerifyResponse.data.statuscode === 200 && otpVerifyResponse.data.status === true) {
      const aadhaarData = otpVerifyResponse.data;

      const formatDateAndTime = (isoString) => {
        const date = new Date(isoString);

        const formattedDate = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });

        const formattedTime = date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        return { formattedDate, formattedTime };
      };

      const currentDateTime = new Date();
      const { formattedDate, formattedTime } = formatDateAndTime(currentDateTime);

      // Save the verified Aadhaar details to the database
      const newAadhar = new Adhar({
        aadharNumber,  // Storing Aadhaar Number
        clientId,      // Storing Client ID
        status: 'verified',
        createdAt: currentDateTime, // ISO timestamp
        formattedDate, // "DD-MM-YYYY"
        formattedTime, // "hh:mm AM/PM"
        verifiedData: aadhaarData, // Storing the OTP verification response
      });

      await newAadhar.save();

      // Update the verification count for Aadhaar card in the database
      await updateVerificationCount('aadhar');
      return res.json({
        message: "Aadhaar verification successful.",
        aadhaarData,
      });
    } else {
      return res.status(400).json({ message: "OTP verification failed" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.response?.data?.message || "Error verifying OTP. Please try again."
    });
  }
}


//Pancard
// export const verifyPanCardController = async (req, res) => {
//   const { pannumber } = req.body;

//   if (!pannumber) {
//     return res.status(400).json({
//       status: 'error',
//       message: 'PAN number is required',
//     });
//   }

//   try {
//     const token = createToken();
//     if (!token) {
//       return res.status(400).json({
//         status: 'error',
//         message: 'Unable to generate token for verification',
//       });
//     }

//     const response = await axios.post(
//       PanVerify,
//       { pannumber },
//       {
//         headers: {
//           Token: token,
//           'User-Agent': Agent,
//         },
//       }
//     );

//     console.log('API Response:', response.data);

//     if (response.data.statuscode === 200 && response.data.status === true) {
//       const { full_name, pan_number } = response.data.data;

//       req.body.verifiedData = { full_name, pan_number };

//       return res.status(200).json({
//         status: 'success',
//         message: response.data.message || 'PAN Card verified successfully.',
//         verifiedData: { full_name, pan_number },
//       });
//     } else {
//       return res.status(400).json({
//         status: 'error',
//         message:
//           response.data.message || 'PAN verification failed. Invalid details.',
//       });
//     }
//   } catch (error) {
//     console.error('PAN Verification Error:', error);

//     return res.status(500).json({
//       status: 'error',
//       message:
//         error.response?.data?.message ||
//         'An error occurred during PAN verification.',
//     });
//   }
// };

//Voter
  export const voterIdVerification = async (req, res) => {
    const { id_number } = req.body;
  
    if (!id_number) {
        return res.status(400).json({ error: 'id_number are required' });
    }

     // Check if Voter data already exists in the database
     const existingVoter = await VOTER.findOne({ id_number });
     if (existingVoter) {
         return res.status(200).json({
             status: 'success',
             message: 'Voter Id is already verified.',
             verifiedData: existingVoter.verifiedData, // Returning existing verified data
         });
     }

    const payload = { 
      timestamp: Math.floor(Date.now() / 1000), 
      partnerId: partnerId, 
      reqid: "748374637" 
    };
    
    const token = jwt.sign(payload, API_SECRET); 
  
    try {
        const response = await axios.post(
            VerifyVoter,
            { id_number },  
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Token': token,  

                    // 'authorisedkey': authorisedkey,  
                    'accept': 'application/json',
                    'User-Agent': 'CORP0000363', 
  
                },
            }
        );
  
        res.status(200).json(response.data);
        const formatDateAndTime = (isoString) => {
          const date = new Date(isoString);
  
          // Format the date as "DD-MM-YYYY"
          const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
  
          // Format the time as "hh:mm AM/PM"
          const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });
  
          return { formattedDate, formattedTime };
        };
  
        // Get the current date and time
        const currentDateTime = new Date();
        const { formattedDate, formattedTime } = formatDateAndTime(currentDateTime);
  
        // Save the verified PAN details to the database
        const newVoter = new VOTER({
          id_number,
          status: 'verified',
          createdAt: currentDateTime, // ISO timestamp
          formattedDate, // "DD-MM-YYYY"
          formattedTime, // "hh:mm AM/PM"
          verifiedData: response.data, // Store response data in verifiedData field
        });
  
        await newVoter.save();

           // Update the verification count for Voter card in the database
      await updateVerificationCount('voter');
    } catch (error) {
        console.error('Error verifying Voter ID:', error.message);
  
        if (error.response) {
            res.status(error.response.status).json(error.response.data); 
        } else {
            res.status(500).json({ error: 'Internal Server Error' }); 
        }
    }
  };
  
//Verify Passport

  export const passportVerification = async (req, res) => {
    const { id_number, dob } = req.body;

    if (!id_number || !dob) {
        return res.status(400).json({ error: 'refid, id_number, and dob are required' });
    }

     // Check if GST data already exists in the database
     const existingPassport = await Passport.findOne({ id_number });
     if (existingPassport) {
         return res.status(200).json({
             status: 'success',
             message: 'Passport is already verified.',
             verifiedData: existingPassport.verifiedData, // Returning existing verified data
         });
     }

    const payload = {
        timestamp: Math.floor(Date.now() / 1000), 
        partnerId: partnerId, 
        reqid: "873487378", 
    };

    const token = jwt.sign(payload, API_SECRET); 

    try {
        const response = await axios.post(
          VerifyPassport,
            { id_number, dob },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Token': token, 
                    // 'authorisedkey': authorisedkey, 
                    'User-Agent': 'CORP0000363', 
                    'accept': 'application/json',  

                },
            }
        );

        res.status(200).json(response.data);

        const formatDateAndTime = (isoString) => {
          const date = new Date(isoString);
  
          // Format the date as "DD-MM-YYYY"
          const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
  
          // Format the time as "hh:mm AM/PM"
          const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });
  
          return { formattedDate, formattedTime };
        };
  
        // Get the current date and time
        const currentDateTime = new Date();
        const { formattedDate, formattedTime } = formatDateAndTime(currentDateTime);
  
        // Save the verified PAN details to the database
        const newPassport = new Passport({
          id_number,
          status: 'verified',
          createdAt: currentDateTime, // ISO timestamp
          formattedDate, // "DD-MM-YYYY"
          formattedTime, // "hh:mm AM/PM"
          verifiedData: response.data, // Store response data in verifiedData field
        });
  
        await newPassport.save();
        // Update the verification count for Voter card in the database
      await updateVerificationCount('passport');
    } catch (error) {
        console.error('Error verifying Passport:', error.message);

        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

//Verify Credit

export const creditReportCheckController = async (req, res) => {
  const { refid, name, mobile, document_id, date_of_birth, address, pincode } = req.body;

  if (!refid || !name || !mobile || !document_id) {
      return res.status(400).json({ error: 'refid, name, mobile, and document_id are required' });
  }

  const payload = {
      timestamp: Math.floor(Date.now() / 1000),
      partnerId: partnerId,
      reqid: refid,
  };
  const token = jwt.sign(payload, API_SECRET);

  try {
      const response = await axios.post(
          VerifyCredit,
          { refid, name, mobile, document_id, date_of_birth, address, pincode },
          {
              headers: {
                  'Content-Type': 'application/json',
                  'Token': token,
                  // 'authorisedkey': authorisedkey,
                  'accept': 'application/json',
                  'User-Agent': 'CORP0000363',
              },
          }
      );

      res.status(200).json(response.data);
  } catch (error) {
      console.error('Error fetching credit report:', error.message);

      if (error.response) {
          res.status(error.response.status).json(error.response.data);
      } else {
          res.status(500).json({ error: 'Internal Server Error' });
      }
  }
};



// GST Verification
export const gstVerifyController = async (req, res) => {
    const {  id_number } = req.body;

    if (typeof id_number === 'undefined') {
      return res.status(400).json({
          error: 'Missing required fields: id_number are mandatory.',
      });
  }

      // Check if GST data already exists in the database
      const existingGst = await GST.findOne({ id_number });
      if (existingGst) {
          return res.status(200).json({
              status: 'success',
              message: 'GST Card is already verified.',
              verifiedData: existingGst.verifiedData, // Returning existing verified data
          });
      }
        

    const payload = {
        timestamp: Math.floor(Date.now() / 1000),
        partnerId: partnerId,
        reqid: "7767267",
    };
    

    const token = jwt.sign(payload, API_SECRET); 

    try {
        const apiPayload = {
            id_number,
        };

        const headers = {
            'Content-Type': 'application/json',
            'Token': token,
            // 'authorisedkey': authorisedkey,
            'accept': 'application/json',
            'User-Agent': 'CORP0000363',
        };

        const response = await axios.post(
          VerifyGST,
            apiPayload,
            { headers }
        );

        res.status(200).json(response.data);
         // Format date and time
      const formatDateAndTime = (isoString) => {
        const date = new Date(isoString);

        // Format the date as "DD-MM-YYYY"
        const formattedDate = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });

        // Format the time as "hh:mm AM/PM"
        const formattedTime = date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        return { formattedDate, formattedTime };
      };

      // Get the current date and time
      const currentDateTime = new Date();
      const { formattedDate, formattedTime } = formatDateAndTime(currentDateTime);

      // Save the verified PAN details to the database
      const newGst = new GST({
        id_number,
        status: 'verified',
        createdAt: currentDateTime, // ISO timestamp
        formattedDate, // "DD-MM-YYYY"
        formattedTime, // "hh:mm AM/PM"
        verifiedData: response.data, // Store response data in verifiedData field
      });

      await newGst.save();
      
      // Update the verification count for PAN card in the database
      await updateVerificationCount('gst');
    } catch (error) {
        console.error('Error during GST verification:', error.message);

        if (error.response) {
            res.status(error.response.status).json({ error: error.response.data });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};



//Udyam Aadhaar verification
export const udyamAadhaarVerifyController = async (req, res) => {
    const { udyam_aadhaar } = req.body;

    if (!udyam_aadhaar) {
        return res.status(400).json({ error: 'Missing required fields: refid and udyam_aadhaar are mandatory.' });
    }
      // Check if GST data already exists in the database
      const existingUdyam = await Udyam.findOne({ udyam_aadhaar });
      if (existingUdyam) {
          return res.status(200).json({
              status: 'success',
              message: 'Udyam Aadhaar is already verified.',
              verifiedData: existingUdyam.verifiedData, // Returning existing verified data
          });
      }

    const payload = {
        timestamp: Math.floor(Date.now() / 1000),
        partnerId: partnerId,
        reqid: "37659138",
    };

    const token = jwt.sign(payload, API_SECRET);

    try {
        const apiPayload = {
            udyam_aadhaar
        };

        const headers = {
            'Content-Type': 'application/json',
            'Token': token,
            // 'authorisedkey': authorisedkey, 
            'accept': 'application/json',
            'User-Agent': 'CORP0000363'
        };

        const response = await axios.post(
          VerifyUdyam,
            apiPayload,
            { headers }
        );

        res.status(200).json(response.data);

         // Format date and time
      const formatDateAndTime = (isoString) => {
        const date = new Date(isoString);

        // Format the date as "DD-MM-YYYY"
        const formattedDate = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });

        // Format the time as "hh:mm AM/PM"
        const formattedTime = date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        return { formattedDate, formattedTime };
      };

      // Get the current date and time
      const currentDateTime = new Date();
      const { formattedDate, formattedTime } = formatDateAndTime(currentDateTime);

      // Save the verified PAN details to the database
      const newUdyam = new Udyam({
        udyam_aadhaar,
        status: 'verified',
        createdAt: currentDateTime, // ISO timestamp
        formattedDate, // "DD-MM-YYYY"
        formattedTime, // "hh:mm AM/PM"
        verifiedData: response.data, // Store response data in verifiedData field
      });

      await newUdyam.save();
        // Update the verification count for PAN card in the database
      await updateVerificationCount('udyancard');
    } catch (error) {
        console.error('Error during Udyam Aadhaar verification:', error.message);

        if (error.response) {
            res.status(error.response.status).json({ error: error.response.data });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};




// PAN details verification
export const panDetailedInfoGetController = async (req, res) => {
  const { id_number } = req.body; // Using idnumber as per your schema

  if (!id_number) {
      return res.status(400).json({ error: 'Missing required fields: idnumber is mandatory.' });
  }

  // Check if PAN detail already exists in the database
  const existingPanDetail = await PanDetail.findOne({ id_number }); // Searching with idnumber
  if (existingPanDetail) {
      return res.status(200).json({
          status: 'success',
          message: 'Pan Detail is already verified.',
          verifiedData: existingPanDetail.verifiedData, // Returning existing verified data
      });
  }

  const payload = {
      timestamp: Math.floor(Date.now() / 1000),
      partnerId: partnerId,
      reqid: "123456",
  };

  const token = jwt.sign(payload, API_SECRET);

  try {
      const apiPayload = {
          id_number // Sending the idnumber as payload
      };

      const headers = {
          'Content-Type': 'application/json',
          'Token': token,
          'accept': 'application/json',
          'User-Agent': 'CORP0000363',
      };

      const response = await axios.post(VerifyPanDetails, apiPayload, { headers });

      if (response.data.statuscode === 200 && response.data.status === true) {
          console.log(response.data);


          // Format date and time
          const formatDateAndTime = (isoString) => {
              const date = new Date(isoString);

              // Format the date as "DD-MM-YYYY"
              const formattedDate = date.toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
              });

              // Format the time as "hh:mm AM/PM"
              const formattedTime = date.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
              });

              return { formattedDate, formattedTime };
          };

          // Get the current date and time
          const currentDateTime = new Date();
          const { formattedDate, formattedTime } = formatDateAndTime(currentDateTime);

          // Save the verified PAN details to the database
          const newPanDetail = new PanDetail({
              id_number, // Save idnumber field in the database
              status: 'verified',
              verifiedData: response.data, // Store response data in verifiedData field
              createdAt: currentDateTime, // ISO timestamp
              formattedDate, // "DD-MM-YYYY"
              formattedTime, // "hh:mm AM/PM"
          });

          await newPanDetail.save();

          // Update the verification count for PAN Detail in the database
          await updateVerificationCount('pandetail');


          return res.status(200).json({
              status: 'success',
              message: response.data.message || 'PAN Card verified successfully.',
              verifiedData: response.data,
          });
      } else {
          return res.status(400).json({
              status: 'error',
              message: response.data.message || 'PAN Detail verification failed. Invalid details.',
          });
      }
  } catch (error) {
      console.error('Error during PAN details verification:', error.message);

      if (error.response) {
          res.status(error.response.status).json({ error: error.response.data });
      } else {
          res.status(500).json({ error: 'Internal Server Error' });
      }
  }
};


//Get Count

// Fetch current verification counts
export const getVerificationCounts = async (req, res) => {
  try {
    const countData = await VerificationCount.findOne();
    if (!countData) {
      return res.status(404).json({ error: 'Verification count data not found' });
    }
    res.status(200).json(countData);
  } catch (error) {
    console.error('Error fetching verification counts:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const verifyPanCardController = async (req, res) => {
  const { pannumber } = req.body;

  if (!pannumber) {
    return res.status(400).json({
      status: 'error',
      message: 'PAN number is required',
    });
  }

  try {
    // Check if PAN data already exists in the database
    const existingPan = await Pan.findOne({ pannumber });
    if (existingPan) {
      return res.status(200).json({
        status: 'success',
        message: 'PAN Card is already verified.',
        verifiedData: existingPan.verifiedData, // Returning existing verified data
      });
    }

    // Generate token for the verification API
    const token = createToken();
    if (!token) {
      return res.status(400).json({
        status: 'error',
        message: 'Unable to generate token for verification',
      });
    }

    // Make the API request to verify PAN card
    const response = await axios.post(
      PanVerify,
      { pannumber },
      {
        headers: {
          Token: token,
          'User-Agent': Agent,
        },
      }
    );

    // If the PAN verification is successful
    if (response.data.statuscode === 200 && response.data.status === true) {
      console.log(response.data);
      const { full_name, pan_number } = response.data.data;

      // Format date and time
      const formatDateAndTime = (isoString) => {
        const date = new Date(isoString);

        // Format the date as "DD-MM-YYYY"
        const formattedDate = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });

        // Format the time as "hh:mm AM/PM"
        const formattedTime = date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        return { formattedDate, formattedTime };
      };

      // Get the current date and time
      const currentDateTime = new Date();
      const { formattedDate, formattedTime } = formatDateAndTime(currentDateTime);

      // Save the verified PAN details to the database
      const newPan = new Pan({
        pannumber: pan_number,
        status: 'verified',
        verifiedData: {
          full_name,
          pan_number,
        },
        createdAt: currentDateTime, // ISO timestamp
        formattedDate, // "DD-MM-YYYY"
        formattedTime, // "hh:mm AM/PM"
      });

      await newPan.save();

      // Update the verification count for PAN card in the database
      await updateVerificationCount('pancard');

      req.body.verifiedData = { full_name, pan_number };

      return res.status(200).json({
        status: 'success',
        message: response.data.message || 'PAN Card verified successfully.',
        verifiedData: { full_name, pan_number },
      });
    } else {
      return res.status(400).json({
        status: 'error',
        message:
          response.data.message || 'PAN verification failed. Invalid details.',
      });
    }
  } catch (error) {
    console.error('PAN Verification Error:', error);

    return res.status(500).json({
      status: 'error',
      message:
        error.response?.data?.message ||
        'An error occurred during PAN verification.',
    });
  }
};

// Helper function to update the verification count
export const updateVerificationCount = async (verificationType) => {
  try {
    // Fetch the current verification count data from the database
    const countData = await VerificationCount.findOne();

    if (!countData) {
      // If no count data exists, create a new one with the given verification type
      const newCountData = new VerificationCount({
        [verificationType]: 1,
      });
      await newCountData.save();
    } else {
      // If the count data exists, increment the count for the specified verification type
      countData[verificationType] += 1;
      await countData.save();
    }
  } catch (error) {
    console.error('Error updating verification count:', error.message);
  }
};



//CREDIT TODAY

export const creditReportCheck = async (req, res) => {
  const { fname, lname, phone_number, pan_num, date_of_birth } = req.body;

  if (!fname || !lname || !phone_number || !pan_num || !date_of_birth) {
    return res.status(400).json({ error: 'All fields are required: fname, lname, phone_number, pan_num, date_of_birth' });
  }

  const reqid = `REQ-${Math.floor(Date.now() / 1000)}`; // Generate a unique reqid
  const payload = {
    timestamp: Math.floor(Date.now() / 1000),
    partnerId: partnerId,
    reqid: reqid, // Include reqid in the payload
  };
  const token = jwt.sign(payload, API_SECRET);

  try {
    console.log('Outgoing request:', {
      fname,
      lname,
      phone_number,
      pan_num,
      date_of_birth,
    });

    const response = await axios.post(
      Check,
      { fname, lname, phone_number, pan_num, date_of_birth },
      {
        headers: {
          'Content-Type': 'application/json',
          'Token': token,
          'accept': 'application/json',
          'User-Agent': 'CORP0000363',
          reqid: reqid, // Include reqid in headers if required
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching credit report:', error.message);

    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};