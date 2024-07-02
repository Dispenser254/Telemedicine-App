import Prescription from "../models/prescription.model.js";
import { errorHandler } from "../utils/error.js";

// Get all prescription
export const getAllPrescriptions = async (request, response, next) => {
  try {
    const prescriptions = await Prescription.find();

    const totalPrescriptions = await Prescription.countDocuments();
    response.status(200).json({ prescriptions, totalPrescriptions });
  } catch (error) {
    next(errorHandler(500, "Error retrieving prescriptions from the database"));
  }
};

export const getPrescriptionByID = async (request, response, next) => {
  const prescriptionId = request.params.id;
  try {
    const prescription = await Prescription.findById(prescriptionId);

    if (!prescription) {
      return next(errorHandler(404, "Prescription not found"));
    }
    response.status(200).json(prescription);
  } catch (error) {
    next(errorHandler(500, "Error retrieving prescription from the database"));
  }
};

// Fetch prescriptions by doctor ID
export const getPrescriptionsByDoctorID = async (request, response, next) => {
  const doctorId = request.params.doctor_id;

  try {
    const prescriptions = await Prescription.find({ doctor_id: doctorId });

    if (!prescriptions || prescriptions.length === 0) {
      return next(errorHandler(404, "No prescriptions found for this doctor"));
    }

    response.status(200).json(prescriptions);
  } catch (error) {
    next(errorHandler(500, "Error retrieving prescriptions from the database"));
  }
};

// Adjusted function to fetch prescription by patient ID
export const getPrescriptionByPatientID = async (request, response, next) => {
  const patientId = request.params.patient_id;

  try {
    const prescriptions = await Prescription.find({ patient_id: patientId });

    if (!prescriptions) {
      return next(errorHandler(404, "No prescriptions found for the patient"));
    }

    response.status(200).json(prescriptions);
  } catch (error) {
    next(errorHandler(500, "Error retrieving prescriptions from the database"));
  }
};

// Create a new prescription
export const createPrescription = async (request, response, next) => {
  const {
    patient_id,
    appointment_id,
    doctor_id,
    prescription_date,
    prescription_details,
  } = request.body;

  try {
    const newPrescription = new Prescription({
      patient_id,
      doctor_id,
      appointment_id,
      prescription_date,
      prescription_details,
    });
    const savedPrescription = await newPrescription.save();
    response.status(201).json(savedPrescription);
  } catch (error) {
    next(errorHandler(500, "Error creating prescription"));
  }
};

// Update a prescription
export const updatePrescription = async (request, response, next) => {
  const prescriptionId = request.params.id;
  const {
    patient_id,
    doctor_id,
    appointment_id,
    prescription_date,
    prescription_details,
  } = request.body;
  try {
    const updatedPrescription = await Prescription.findByIdAndUpdate(
      prescriptionId,
      {
        patient_id,
        doctor_id,
        appointment_id,
        prescription_date,
        prescription_details,
      },
      { new: true, runValidators: true }
    );
    if (!updatedPrescription) {
      return next(errorHandler(404, "Prescription not found"));
    }
    response.status(200).json(updatedPrescription);
  } catch (error) {
    next(errorHandler(500, "Error updating prescription"));
  }
};

// Delete a prescription
export const deletePrescription = async (request, response, next) => {
  const prescriptionId = request.params.id;

  try {
    // Find the prescription by ID to get the user_id
    const prescription = await Prescription.findById(prescriptionId);

    if (!prescription) {
      return next(errorHandler(404, "Prescription not found"));
    }

    // Delete the patient
    await Prescription.findByIdAndDelete(prescriptionId);
    response.status(200).json("Prescription deleted successfully");
  } catch (error) {
    next(errorHandler(500, "Error deleting prescription"));
  }
};
