import mongoose from "mongoose";
const { Schema } = mongoose;

const CredentialsSchema = new Schema(
  {
    bankName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    RegisterDate: {
        type: String, // Now stored as a string (DD/MM/YYYY)
        required: true,
      },
      // Add TimeOfAdmission as String (HH:MM:SS)
    RegisterTime: {
    type: String, // Now stored as a string (HH:MM:SS)
    required: true,
    },
  },
  
);

const Credentials = mongoose.model("Credentials", CredentialsSchema);
export default Credentials;
