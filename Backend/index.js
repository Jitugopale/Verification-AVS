import express from "express";
import connectToMongo from "./db/db.js";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/authRoutes.js";
import path from 'path';
import Adhar from "./models/AadhaarSchema.js";
import pan from "./models/PanSchema.js"
import GST from "./models/GSTSchema.js"
import CREDIT from "./models/CreditSchema.js"
import VOTER from "./models/VoterSchema.js"
import PanDetail from "./models/PanDetailSchema.js";
import Passport from "./models/PassportSchema.js"
import Udyam from "./models/UdyamSchema.js"
import { fileURLToPath } from 'url';
import { dirname } from 'path';


// Resolve __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'auth-token', 'Token'], 
}));
app.use(express.json());

// Connect to MongoDB
connectToMongo();

// Routes for authentication and Aadhaar
app.use("/api/auth", router);      
app.use("/api/adhar", router);     
app.use('/api/pan', router);
app.use('/api/voter', router);
app.use('/api/passport', router);
app.use('/api/credit', router);
app.use('/api/gst', router);
app.use('/api/udyam', router);
app.use('/api/pandetail', router);
app.use('/api/count', router);

app.get('/', (req, res) => {
  res.send('<h1>Server is running</h1>');
});

app.get("/api/adhar/verified", async (req, res) => {
  try {
    // Fetch all documents in the "Adhar" collection
    const verifiedUsers = await Adhar.find(); // Ensure 'Adhar' model is correctly referenced

    if (verifiedUsers.length === 0) {
      return res.status(404).json({ message: "No verified users found." });
    }

    res.status(200).json(verifiedUsers); // Send the list of verified users
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: "Failed to fetch verified users." });
  }
});

// In your Express backend:
app.delete('/api/adhar/delete/:aadharNumber', async (req, res) => {
  try {
    const { aadharNumber } = req.params;

    // Find and delete the user with the specified Aadhaar number
    const result = await Adhar.deleteOne({ aadharNumber });

    if (result.deletedCount === 1) {
      res.json({ message: "User deleted successfully." });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user." });
  }
});



//Pan


app.get("/api/pan/verified", async (req, res) => {
  try {
    // Fetch all documents in the "Adhar" collection
    const verifiedUsers = await pan.find(); // Ensure 'Adhar' model is correctly referenced

    if (verifiedUsers.length === 0) {
      return res.status(404).json({ message: "No verified users found." });
    }

    res.status(200).json(verifiedUsers); // Send the list of verified users
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: "Failed to fetch verified users." });
  }
});

// In your Express backend:
app.delete('/api/pan/delete/:pannumber', async (req, res) => {
  try {
    const { pannumber } = req.params;

    // Find and delete the user with the specified Aadhaar number
    const result = await pan.deleteOne({ pannumber });
    console.log(typeof pannumber, pannumber);


    if (result.deletedCount === 1) {
      res.json({ message: "User deleted successfully." });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user." });
  }
});

//Voter

app.get("/api/voter/verified", async (req, res) => {
  try {
    // Fetch all documents in the "Adhar" collection
    const verifiedUsers = await VOTER.find(); // Ensure 'Adhar' model is correctly referenced

    if (verifiedUsers.length === 0) {
      return res.status(404).json({ message: "No verified users found." });
    }

    res.status(200).json(verifiedUsers); // Send the list of verified users
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: "Failed to fetch verified users." });
  }
});

// In your Express backend:
app.delete('/api/voter/delete/:id_number', async (req, res) => {
  try {
    const { id_number } = req.params;

    // Find and delete the user with the specified Aadhaar number
    const result = await VOTER.deleteOne({ id_number });

    if (result.deletedCount === 1) {
      res.json({ message: "User deleted successfully." });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user." });
  }
});


//Udyam

app.get("/api/pan/verified", async (req, res) => {
  try {
    // Fetch all documents in the "Adhar" collection
    const verifiedUsers = await pan.find(); // Ensure 'Adhar' model is correctly referenced

    if (verifiedUsers.length === 0) {
      return res.status(404).json({ message: "No verified users found." });
    }

    res.status(200).json(verifiedUsers); // Send the list of verified users
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: "Failed to fetch verified users." });
  }
});

// In your Express backend:
app.delete('/api/pan/delete/:pannumber', async (req, res) => {
  try {
    const { pannumber } = req.params;

    // Find and delete the user with the specified Aadhaar number
    const result = await pan.deleteOne({ pannumber });
    console.log(typeof pannumber, pannumber);


    if (result.deletedCount === 1) {
      res.json({ message: "User deleted successfully." });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user." });
  }
});


//Pan Detail

app.get("/api/pan/verified", async (req, res) => {
  try {
    // Fetch all documents in the "Adhar" collection
    const verifiedUsers = await pan.find(); // Ensure 'Adhar' model is correctly referenced

    if (verifiedUsers.length === 0) {
      return res.status(404).json({ message: "No verified users found." });
    }

    res.status(200).json(verifiedUsers); // Send the list of verified users
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: "Failed to fetch verified users." });
  }
});

// In your Express backend:
app.delete('/api/pan/delete/:pannumber', async (req, res) => {
  try {
    const { pannumber } = req.params;

    // Find and delete the user with the specified Aadhaar number
    const result = await pan.deleteOne({ pannumber });
    console.log(typeof pannumber, pannumber);


    if (result.deletedCount === 1) {
      res.json({ message: "User deleted successfully." });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user." });
  }
});

//Passport

app.get("/api/pan/verified", async (req, res) => {
  try {
    // Fetch all documents in the "Adhar" collection
    const verifiedUsers = await pan.find(); // Ensure 'Adhar' model is correctly referenced

    if (verifiedUsers.length === 0) {
      return res.status(404).json({ message: "No verified users found." });
    }

    res.status(200).json(verifiedUsers); // Send the list of verified users
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: "Failed to fetch verified users." });
  }
});

// In your Express backend:
app.delete('/api/pan/delete/:pannumber', async (req, res) => {
  try {
    const { pannumber } = req.params;

    // Find and delete the user with the specified Aadhaar number
    const result = await pan.deleteOne({ pannumber });
    console.log(typeof pannumber, pannumber);


    if (result.deletedCount === 1) {
      res.json({ message: "User deleted successfully." });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user." });
  }
});

//Credit

app.get("/api/credit/verified", async (req, res) => {
  try {
    // Fetch all documents in the "Adhar" collection
    const verifiedUsers = await CREDIT.find(); // Ensure 'Adhar' model is correctly referenced

    if (verifiedUsers.length === 0) {
      return res.status(404).json({ message: "No verified users found." });
    }

    res.status(200).json(verifiedUsers); // Send the list of verified users
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: "Failed to fetch verified users." });
  }
});

// In your Express backend:
app.delete('/api/credit/delete/:document_id', async (req, res) => {
  try {
    const { pannumber } = req.params;

    // Find and delete the user with the specified Aadhaar number
    const result = await CREDIT.deleteOne({ document_id });


    if (result.deletedCount === 1) {
      res.json({ message: "User deleted successfully." });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user." });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
});
