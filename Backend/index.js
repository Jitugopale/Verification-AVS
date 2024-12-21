import express from "express";
import connectToMongo from "./db/db.js";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/authRoutes.js";
import path from 'path';
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
});
