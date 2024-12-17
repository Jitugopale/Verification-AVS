import mongoose from "mongoose";
const { Schema } = mongoose;

const PanSchema = new Schema({
    
    pannumber: { type: String, required: false, // Optional Aadhar number field
        unique: true, // Ensures Aadhar is unique for each user
        sparse:true },
    status: { type: String, required: true },
    verifiedData: {
    full_name: { type: String },
    pan_number: { type: String }
  },
 
});

const panSchema = mongoose.model("pan", PanSchema);
export default panSchema;
