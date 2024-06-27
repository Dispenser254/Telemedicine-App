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

    const totalAppointments = await Appointment.countDocuments();
    const totalPendingAppointments = await Appointment.countDocuments({
      appointment_status: "Pending with admin",
    });
    const totalConfirmedAppointments = await Appointment.countDocuments({
      appointment_status: "Scheduled",
    });
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthAppointments = await Appointment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    response.status(200).json({
      appointments,
      totalAppointments,
      totalConfirmedAppointments,
      totalPendingAppointments,
      lastMonthAppointments,
    });
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

// Get an appointment by Patient ID
export const getAppointmentByPatientID = async (request, response, next) => {
  const patientId = request.params.patient_id;

  if (!patientId) {
    return next(errorHandler(400, "Patient ID is required"));
  }
  try {
    const appointment = await Appointment.find({
      patient_id: patientId,
    })
      .sort({ createdAt: -1 })
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
      return next(errorHandler(404, "Patient Appointment not found"));
    }
    response.status(200).json(appointment);
  } catch (error) {
    next(
      errorHandler(
        500,
        "Error retrieving patient appointments from the database"
      )
    );
  }
};

// Create a new appointment
export const createAppointment = async (request, response, next) => {
  const {
    patient_id,
    department_id,
    appointment_date,
    appointment_time,
    appointment_type,
  } = request.body;

  // Set default values for doctor_id and appointment_status
  const doctor_id = null; // Doctor is not assigned initially
  const appointment_status = "Pending with admin"; // Default status

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

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        patient_id,
        doctor_id,
        department_id,
        appointment_date,
        appointment_time,
        appointment_status: "Scheduled",
        appointment_type,
      },
      { new: true, runValidators: true }
    );
    const isCreateVideoLink =
      updatedAppointment.appointment_status === "Scheduled" &&
      updatedAppointment.appointment_type === "Online";

    if (!updatedAppointment) {
      return next(errorHandler(404, "Appointment not found"));
    }
    console.log(updatedAppointment);
    console.log(isCreateVideoLink);
    // Handle video consultation link creation
    if (isCreateVideoLink) {
      const isSuccess = await createVideoConsultation(
        {
          body: {
            patient_id: updatedAppointment.patient_id._id,
            doctor_id,
            appointment_id: updatedAppointment._id,
          },
        },
        response,
        next
      );
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

// API endpoint to fetch all reports
export const getAllReports = async (request, response, next) => {
  try {
    // Query 1: Revenue by month
    const revenueData = await Appointment.find({
      appointment_status: { $in: ["Scheduled", "Completed", "Follow-up"] },
    })
      .populate({
        path: "payments",
        match: {
          appointment_status: { $in: ["Scheduled", "Completed", "Follow-up"] },
        },
        select: "payment_amount appointment_date",
      })
      .then((appointments) => {
        return appointments.reduce((acc, appointment) => {
          const month = appointment.appointment_date.toLocaleString("default", {
            month: "short",
          });
          const revenue = appointment.payments.reduce(
            (sum, payment) => sum + payment.payment_amount,
            0
          );
          if (!acc[month]) {
            acc[month] = 0;
          }
          acc[month] += revenue;
          return acc;
        }, {});
      });

    // Convert revenueData to array of objects for consistency
    const revenueResult = Object.keys(revenueData).map((month) => ({
      month,
      revenue: revenueData[month],
    }));

    // Query 2: Appointments by department
    const departmentsData = await Appointment.find({
      appointment_status: { $in: ["Scheduled", "Completed", "Follow-up"] },
    })
      .populate({
        path: "department_id",
        select: "department_name",
      })
      .then((appointments) => {
        return appointments.reduce((acc, appointment) => {
          const departmentName = appointment.department_id.department_name;
          if (!acc[departmentName]) {
            acc[departmentName] = 0;
          }
          acc[departmentName]++;
          return acc;
        }, {});
      });

    // Convert departmentsData to array of objects for consistency
    const departmentsResult = Object.keys(departmentsData).map(
      (departmentName) => ({
        label: departmentName,
        appointments: departmentsData[departmentName],
      })
    );

    // Query 3: Appointments by doctor
    const doctorsData = await Appointment.find({
      appointment_status: { $in: ["Scheduled", "Completed", "Follow-up"] },
    })
      .populate({
        path: "doctor_id",
        select: "doctor_firstName doctor_lastName",
      })
      .then((appointments) => {
        return appointments.reduce((acc, appointment) => {
          const doctorName = `${appointment.doctor_id.doctor_firstName} ${appointment.doctor_id.doctor_lastName}`;
          if (!acc[doctorName]) {
            acc[doctorName] = 0;
          }
          acc[doctorName]++;
          return acc;
        }, {});
      });

    // Convert doctorsData to array of objects for consistency
    const doctorsResult = Object.keys(doctorsData).map((doctorName) => ({
      doctor: doctorName,
      appointments: doctorsData[doctorName],
    }));

    // Query 4: Appointments by age group
    const ageGroupData = await Appointment.find({
      appointment_status: { $in: ["Scheduled", "Completed", "Follow-up"] },
    })
      .populate({
        path: "patient_id",
        select: "patient_dob",
      })
      .then((appointments) => {
        return appointments.reduce((acc, appointment) => {
          const patientAge = Math.floor(
            (Date.now() -
              new Date(appointment.patient_id.patient_dob).getTime()) /
              (1000 * 60 * 60 * 24 * 365.25)
          );
          let ageGroup;
          if (patientAge < 18) {
            ageGroup = "Children";
          } else if (patientAge >= 18 && patientAge <= 65) {
            ageGroup = "Adults";
          } else if (patientAge > 65) {
            ageGroup = "Seniors";
          } else {
            ageGroup = "Unknown";
          }
          if (!acc[ageGroup]) {
            acc[ageGroup] = 0;
          }
          acc[ageGroup]++;
          return acc;
        }, {});
      });

    // Convert ageGroupData to array of objects for consistency
    const ageGroupResult = Object.keys(ageGroupData).map((ageGroup) => ({
      age_group: ageGroup,
      appointments: ageGroupData[ageGroup],
    }));

    // Sending the aggregated data as response
    response.status(200).json({
      revenue: revenueResult,
      departments: departmentsResult,
      doctors: doctorsResult,
      ageGroup: ageGroupResult,
    });
  } catch (error) {
    next(errorHandler(500, "Error fetching reports"));
  }
};
