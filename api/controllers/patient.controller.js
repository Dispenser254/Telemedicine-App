import Appointment from "../models/appointment.model.js";
import Patient from "../models/patient.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

// Get all patients
export const getAllPatients = async (request, response, next) => {
  try {
    const patients = await Patient.find();
    const totalPatients = await Patient.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPatients = await Patient.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    // Calculate age for each patient based on patient_dob
    const patientsWithAge = patients.map((patient) => {
      const dob = patient.patient_dob;
      const ageDiffMs = Date.now() - dob.getTime();
      const ageDate = new Date(ageDiffMs);
      return {
        ...patient.toObject(),
        age: Math.abs(ageDate.getUTCFullYear() - 1970),
      };
    });
    response.status(200).json({ patients: patientsWithAge, totalPatients, lastMonthPatients });
  } catch (error) {
    next(errorHandler(500, "Error retrieving patients from the database"));
  }
};

// Get a patient by ID
export const getPatientById = async (request, response, next) => {
  const patientId = request.params.id;
  try {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return next(errorHandler(404, "Patient not found"));
    }
    response.status(200).json(patient);
  } catch (error) {
    next(errorHandler(500, "Error retrieving patient from the database"));
  }
};

// Create a new patient
export const createPatient = async (request, response, next) => {
  const {
    patient_firstName,
    patient_lastName,
    patient_idNumber,
    patient_dob,
    patient_gender,
    contact_number,
    address,
    username, // Username for the new user
    password, // Password for the new user
    role = "patient", // Default role for the new user
  } = request.body;

  try {
    // Check for common required fields
    if (!username || !password || !role) {
      return next(
        errorHandler(400, "Username, password, and role are required.")
      );
    }

    // Check if patient_idNumber already exists
    const existingPatientId = await Patient.findOne({ patient_idNumber });
    if (existingPatientId) {
      return next(errorHandler(409, "Patient ID number already exists."));
    }

    // Check if contact number already exists for patients
    const existingPatientNo = await Patient.findOne({ contact_number });
    if (existingPatientNo) {
      return next(
        errorHandler(409, "Contact number already exists for a patient.")
      );
    }
    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return next(errorHandler(400, "Username already exists."));
    }
    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create a new user with hashed password
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
    });

    // Save the new user
    const savedUser = await newUser.save();

    try {
      // Use the saved user's ID for the patient
      const newPatient = new Patient({
        patient_firstName,
        patient_lastName,
        patient_idNumber,
        patient_dob,
        patient_gender,
        contact_number,
        address,
        user_id: savedUser._id, // Linking the patient to the newly created user
      });

      // Save the new patient
      const savedPatient = await newPatient.save();

      // Respond with the new patient data
      response.status(201).json(savedPatient);
    } catch (rollError) {
      // Error occurred while creating role-specific data
      await User.findByIdAndDelete(savedUser._id);
      return next(
        errorHandler(
          500,
          "An error occurred while creating role-specific data."
        )
      );
    }
  } catch (error) {
    next(errorHandler(500, "Error creating patient and user"));
  }
};

// Update a patient
export const updatePatient = async (request, response, next) => {
  const patientId = request.params.id;
  const {
    patient_firstName,
    patient_lastName,
    patient_idNumber,
    patient_dob,
    patient_gender,
    contact_number,
    address,
  } = request.body;
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      {
        patient_firstName,
        patient_lastName,
        patient_idNumber,
        patient_dob,
        patient_gender,
        contact_number,
        address,
      },
      { new: true, runValidators: true }
    );
    if (!updatedPatient) {
      return next(errorHandler(404, "Patient not found"));
    }
    response.status(200).json(updatedPatient);
  } catch (error) {
    next(errorHandler(500, "Error updating patient"));
  }
};

// Delete a patient
export const deletePatient = async (request, response, next) => {
  const patientId = request.params.id;

  try {
    // Find the patient by ID to get the user_id
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return next(errorHandler(404, "Patient not found"));
    }

    // Retrieve the user_id from the patient document
    const userId = patient.user_id;

    // Delete the patient
    await Patient.findByIdAndDelete(patientId);

    // Delete the associated user
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return next(errorHandler(404, "Associated user with ID not found."));
    }

    response
      .status(200)
      .json("Patient and associated user deleted successfully");
  } catch (error) {
    next(errorHandler(500, "Error deleting patient or associated user"));
  }
};

// Get patient details
export const getPatientDetails = async (request, response, next) => {
  const { id } = request.params;

  try {
    // Fetch patient details
    const patient = await Patient.findById(id).lean();

    if (!patient) {
      return next(errorHandler(404, "Patient not found"));
    }

    // Fetch related appointments, doctors, and departments
    const appointments = await Appointment.find({ patient_id: id })
      .populate({
        path: "doctor_id",
        select:
          "doctor_firstName doctor_lastName doctor_idNumber doctor_number email department_id",
        populate: {
          path: "department_id",
          select: "department_name",
        },
      })
      .lean();

    // Construct response
    const patientDetails = {
      patient: {
        patient_id: patient._id,
        patient_firstName: patient.patient_firstName,
        patient_lastName: patient.patient_lastName,
        patient_idNumber: patient.patient_idNumber,
        patient_dob: patient.patient_dob,
        patient_gender: patient.patient_gender,
        contact_number: patient.contact_number,
        address: patient.address,
      },
      appointments: appointments.map((appt) => ({
        appointment_id: appt._id,
        appointment_date: appt.appointment_date,
        appointment_time: appt.appointment_time,
        appointment_type: appt.appointment_type,
        appointment_status: appt.appointment_status,
        doctor: {
          doctor_id: appt.doctor_id._id,
          doctor_firstName: appt.doctor_id.doctor_firstName,
          doctor_lastName: appt.doctor_id.doctor_lastName,
          doctor_idNumber: appt.doctor_id.doctor_idNumber,
          doctor_number: appt.doctor_id.doctor_number,
          doctor_email: appt.doctor_id.email,
          department: {
            department_id: appt.doctor_id.department_id._id,
            department_name: appt.doctor_id.department_id.department_name,
          },
        },
      })),
    };

    response.status(200).json(patientDetails);
  } catch (error) {
    next(
      errorHandler(500, "Error retrieving patient details from the database")
    );
  }
};
