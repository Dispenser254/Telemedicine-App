import { APPOINTMENT_STATUS, appointmentTypeOnline } from "../config.js";
import Appointment from "../models/appointment.model.js";
import { errorHandler } from "../utils/error.js";
import { createVideoConsultation } from "./video.controller.js";

// Get all appointments with department_name, doctor_name, and patient_name
export const getAllAppointments = async (request, response, next) => {
  try {
    const appointments = await Appointment.find()
      .populate({
        path: "patient_id",
        select: "patient_firstName patient_lastName",
      })
      .populate({
        path: "department_id",
        select: "department_name",
      })
      .populate({
        path: "doctor_id",
        select: "doctor_firstName doctor_lastName",
      })
      .lean();
    response.json(appointments);
  } catch (error) {
    next(errorHandler(500, "Error retrieving appointments from the database"));
  }
};

// Get an appointment by ID with department_name, doctor_name, and patient_name
export const getAppointmentByID = async (request, response, next) => {
  const appointmentId = request.params.id;
  try {
    const appointment = await Appointment.findById(appointmentId)
      .populate({
        path: "patient_id",
        select: "patient_firstName patient_lastName",
      })
      .populate({
        path: "department_id",
        select: "department_name",
      })
      .populate({
        path: "doctor_id",
        select: "doctor_firstName doctor_lastName",
      })
      .lean();

    if (!appointment) {
      return next(errorHandler(404, "Appointment not found"));
    }
    response.status(200).json(appointment);
  } catch (error) {
    next(errorHandler(500, "Error retrieving appointments from the database"));
  }
};

// Create a new appointment
export const createAppointment = async (request, response, next) => {
  const {
    patient_id,
    doctor_id,
    department_id,
    appointment_date,
    appointment_time,
    appointment_status,
    appointment_type,
  } = request.body;
  try {
    const newAppointment = new Appointment({
      patient_id,
      doctor_id,
      department_id,
      appointment_date,
      appointment_time,
      appointment_status,
      appointment_type,
    });
    const savedAppointment = await newAppointment.save();
    response.status(201).json(savedAppointment);
  } catch (error) {
    next(errorHandler(500, "Error creating appointment"));
  }
};

// Update an appointment
export const updateAppointment = async (request, response, next) => {
  const appointmentId = request.params.id;
  const {
    patient_id,
    doctor_id,
    department_id,
    appointment_date,
    appointment_time,
    appointment_status,
    appointment_type,
  } = request.body;
  try {
    // Fetch the current appointment
    const previousAppointment = await Appointment.findById(appointmentId);
    if (!previousAppointment) {
      return next(errorHandler(404, "Appointment not found"));
    }

    const isCreateVideoLink =
      appointment_status === APPOINTMENT_STATUS.APPROVED &&
      appointment_type === appointmentTypeOnline &&
      previousAppointment.appointment_status !== APPOINTMENT_STATUS.APPROVED;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        patient_id,
        doctor_id,
        department_id,
        appointment_date,
        appointment_time,
        appointment_status,
        appointment_type,
      },
      { new: true, runValidators: true }
    );

    if (!updatedAppointment) {
      return next(errorHandler(404, "Appointment not found"));
    }
    // Handle video consultation link creation
    if (isCreateVideoLink) {
      const isSuccess = await createVideoConsultation(request.body);
      if (!isSuccess) {
        return next(errorHandler(500, "Error creating video link"));
      }
    }
    response.status(200).json(updatedAppointment);
  } catch (error) {
    next(errorHandler(500, "Error updating appointment"));
  }
};

// Delete an appointment
export const deleteAppointment = async (request, response, next) => {
  const appointmentId = request.params.id;

  try {
    // Find and delete the appointment by its ID
    const deletedAppointment = await Appointment.findByIdAndDelete(
      appointmentId
    );

    if (!deletedAppointment) {
      return next(errorHandler(404, "Appointment not found"));
    }

    response.status(200).json("Appointment deleted successfully");
  } catch (error) {
    next(errorHandler(500, "Error deleting appointment"));
  }
};
