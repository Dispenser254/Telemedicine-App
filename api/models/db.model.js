import mongoose, { Schema } from "mongoose";

// Define department Schema
const departmentSchema = new mongoose.Schema({
  department_name: {
    type: String,
    requred: true,
    unique: true,
  },
});

// Define user Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});

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

// Define Doctor schema
const doctorSchema = new mongoose.Schema({
  doctor_name: {
    type: String,
    required: true,
  },
  contact_number: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  department_id: {
    type: Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Define appointment schema
const appointmentSchema = new mongoose.Schema({
  patient_id: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  department_id: {
    type: Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  doctor_id: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  appointment_date: {
    type: Date,
    required: true,
  },
  appointment_time: {
    type: String,
    required: true,
  },
  appointment_type: {
    type: String,
    required: true,
  },
  appointment_status: {
    type: String,
    required: true,
  },
});

// Define prescription schema
const prescriptionSchema = new mongoose.Schema({
  patient_id: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  apppointment_id: {
    type: Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  doctor_id: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  prescription_date: {
    type: Date,
    required: true,
  },
  prescription_details: {
    type: String,
    required: true,
  },
});

// Define payment schema
const paymentShema = new mongoose.Schema({
  patient_id: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  apppointment_id: {
    type: Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  card_number: {
    type: String,
    required: true,
  },
  payment_date: {
    type: Date,
    required: true,
  },
  payment_amount: {
    type: Number,
    required: true,
  },
  payment_status: {
    type: String,
    required: true,
  },
});

// Define Video consultation schema
const videoConsultationSchema = new mongoose.Schema({
  patient_id: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  apppointment_id: {
    type: Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  doctor_id: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  video_consultation_link: {
    type: String,
    required: true,
  },
  consultation_status: {
    type: String,
    required: true,
  },
});

// Define notification schema
const notificationSchema = new mongoose.Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  viewed: {
    type: Boolean,
    default: false,
  },
});

module.exports = {
  Department: mongoose.model("Department", departmentSchema),
  User: mongoose.model("User", userSchema),
  Patient: mongoose.model("Patient", patientSchema),
  Doctor: mongoose.model("Doctor", doctorSchema),
  Appointment: mongoose.model("Appointment", appointmentSchema),
  Prescription: mongoose.model("Prescription", prescriptionSchema),
  Payment: mongoose.model("Payment", paymentShema),
  VideoConsultation: mongoose.model(
    "VideoConsultation",
    videoConsultationSchema
  ),
  Notification: mongoose.model("Notification", notificationSchema),
};
