import bcrypt from "bcrypt"
import dotenv from 'dotenv';
import {validationResult} from 'express-validator';
import jwt from "jsonwebtoken"
import User from "../models/userSchema.js"
import Pan from "../models/PanSchema.js"
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
      console.log("Password Comparison:", passwordCompare); // Should print true if matching

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

export const getuserController =  async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.json(user); // Return the user details without the password
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
}

// Controller to handle Aadhaar OTP
export const aadhaarOtpController = async (req, res) => {
  const { aadharNumber } = req.body;

  if (!aadharNumber) {
    return res.status(400).json({ message: "Aadhar number is required" });
  }

  try {
    // Generate Token using the helper function
    const token = createToken();
    console.log(token)

    // Send OTP request to Aadhaar verification API
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
        token: otpToken,  // Return the JWT token
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

// Helper function to create a token for Aadhaar OTP
function createToken() {
  const secretKey = process.env.secretKey;
  const symmetricKey = Buffer.from(secretKey, 'utf8');
  const unixTimeStamp = Math.floor(Date.now() / 1000);

  // Creating JWT token
  const token = jwt.sign(
    { timestamp: unixTimeStamp, partnerId: Agent, reqid: '1111' },
    symmetricKey,
    { algorithm: 'HS256', expiresIn: '1h' }
  );
  return token;
}



export const verifyAadhaarOtpController = async (req, res) => {
  const { clientId, OTP } = req.body;

  if (!clientId || !OTP) {
    return res.status(400).json({ message: "Client ID and OTP are required" });
  }

  try {
    // Get token from headers or request body
    const token = createToken();
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    // Verify the token using the same secret used during signing
    const secretKey = process.env.secretKey; // Ensure this is the same secret key
    jwt.verify(token, Buffer.from(secretKey, 'utf8'), (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Signature verification failed" });
      }
      
      // Proceed with OTP verification if token is valid
      verifyOtp(clientId, OTP, token, res);
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.response?.data?.message || "Error verifying OTP. Please try again."
    });
  }
};

// Function to handle OTP verification request
async function verifyOtp(clientId, OTP, token, res) {
  try {
    const otpVerifyResponse = await axios.post(
      VerifyOTP,
      { client_id: clientId, otp: OTP },
      {
        headers: {
          'Token': token,  // The same token is sent here for verification
          'User-Agent': Agent
        }
      }
    );
    console.log('OTP Verification Response:', otpVerifyResponse.data);


    if (otpVerifyResponse.data.statuscode === 200 && otpVerifyResponse.data.status === true) {
      // OTP verified successfully, now load Aadhaar data
      const aadhaarData = otpVerifyResponse.data;
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

// Controller to verify PAN card


export const verifyPanCardController = async (req, res) => {
  const { pannumber } = req.body;

  // Validate input
  if (!pannumber) {
    return res.status(400).json({
      status: 'error',
      message: 'PAN number is required',
    });
  }

  try {
    // Generate token for verification API
    const token = createToken();
    if (!token) {
      return res.status(400).json({
        status: 'error',
        message: 'Unable to generate token for verification',
      });
    }

    // Send request to the PAN card verification API
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

    console.log('API Response:', response.data);

    if (response.data.statuscode === 200 && response.data.status === true) {
      const { full_name, pan_number } = response.data.data;

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


// verifying voter ID

  export const voterIdVerification = async (req, res) => {
    const { refid, id_number } = req.body;
  
    if (!refid || !id_number) {
        return res.status(400).json({ error: 'Both refid and id_number are required' });
    }
  
    const reqid = Date.now(); 
    
    const payload = { 
      refid: refid, 
      timestamp: Math.floor(Date.now() / 1000), 
      partnerId: partnerId, 
      reqid: reqid 
    };
    
    const token = jwt.sign(payload, API_SECRET); 
  
    try {
        const response = await axios.post(
            VerifyVoter,
            { refid, id_number },  
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Token': token,  
                    'authorisedkey': authorisedkey,  
                    'accept': 'application/json',  
                    'User-Agent': 'CORP00001',
                },
            }
        );
  
        res.status(200).json(response.data);  
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
    const { refid, id_number, dob } = req.body;

    if (!refid || !id_number || !dob) {
        return res.status(400).json({ error: 'refid, id_number, and dob are required' });
    }

    const reqid = Date.now(); 

    const payload = {
        refid: refid,
        timestamp: Math.floor(Date.now() / 1000), 
        partnerId: partnerId, 
        reqid: reqid, 
    };

    const token = jwt.sign(payload, API_SECRET); 

    try {
        const response = await axios.post(
          VerifyPassport,
            { refid, id_number, dob },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Token': token, 
                    'authorisedkey': authorisedkey, 
                    'User-Agent': 'CORP00001', 
                },
            }
        );

        res.status(200).json(response.data);
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
                  'authorisedkey': authorisedkey,
                  'accept': 'application/json',
                  'User-Agent': 'CORP00001',
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
    const { refid, id_number, filing_status } = req.body;

    if (!refid || typeof id_number === 'undefined' || typeof filing_status === 'undefined') {
        return res.status(400).json({
            error: 'Missing required fields: refid, id_number, and filing_status are mandatory.',
        });
    }

    if (filing_status !== 'true' && filing_status !== 'false') {
        return res.status(400).json({
            error: 'Invalid value for filing_status. Allowed values are "true" or "false".',
        });
    }

    const payload = {
        timestamp: Math.floor(Date.now() / 1000),
        partnerId: partnerId,
        reqid: refid,
    };

    const token = jwt.sign(payload, API_SECRET); 

    try {
        const apiPayload = {
            refid,
            id_number,
            filing_status,
        };

        const headers = {
            'Content-Type': 'application/json',
            'Token': token,
            'authorisedkey': authorisedkey,
            'accept': 'application/json',
            'User-Agent': 'CORP00001',
        };

        const response = await axios.post(
          VerifyGST,
            apiPayload,
            { headers }
        );

        res.status(200).json(response.data);
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
    const { refid, udyam_aadhaar } = req.body;

    if (!refid || !udyam_aadhaar) {
        return res.status(400).json({ error: 'Missing required fields: refid and udyam_aadhaar are mandatory.' });
    }

    const payload = {
        timestamp: Math.floor(Date.now() / 1000),
        partnerId: partnerId,
        reqid: refid,
    };

    const token = jwt.sign(payload, API_SECRET);

    try {
        const apiPayload = {
            refid,
            udyam_aadhaar
        };

        const headers = {
            'Content-Type': 'application/json',
            'Token': token,
            'authorisedkey': authorisedkey, 
            'accept': 'application/json',
            'User-Agent': 'CORP00001'
        };

        const response = await axios.post(
          VerifyUdyam,
            apiPayload,
            { headers }
        );

        res.status(200).json(response.data);
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
    const { refid, id_number } = req.body;

    if (!refid || !id_number) {
        return res.status(400).json({ error: 'Missing required fields: refid and id_number are mandatory.' });
    }

    const payload = {
        timestamp: Math.floor(Date.now() / 1000),
        partnerId: partnerId,
        reqid: refid,
    };

    const token = jwt.sign(payload, API_SECRET); 

    try {
        const apiPayload = {
            refid,
            id_number
        };

        const headers = {
            'Content-Type': 'application/json',
            'Token': token,
            'authorisedkey': authorisedkey,
            'accept': 'application/json',
            'User-Agent': 'CORP00001'
        };

        const response = await axios.post(
          VerifyPanDetails,
            apiPayload,
            { headers }
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error during PAN details verification:', error.message);

        if (error.response) {
            res.status(error.response.status).json({ error: error.response.data });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};
