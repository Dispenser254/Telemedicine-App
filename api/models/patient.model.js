import mongoose, { Schema } from "mongoose";

// Define patient schema
const patientSchema = new mongoose.Schema({
  patient_name: {
    type: String,
    required: true,
  },
  patient_age: {
    type: Number,
    required: true,
  },
  patient_gender: {
    type: String,
    required: true,
  },
  contact_number: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
