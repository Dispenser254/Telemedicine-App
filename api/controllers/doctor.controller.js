import Appointment from "../models/appointment.model.js";
import Doctor from "../models/doctor.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

// Get all doctors
export const getAllDoctors = async (request, response, next) => {
  try {
    // Find all doctors and populate the department information
    const doctors = await Doctor.find()
      .populate({
        path: "department_id", // Path to the field to populate
        select: "department_name", // Select only the department_name field
      })
      .lean();

    // Transform the data to include department_name directly
    const doctorsWithDepartment = doctors.map((doctor) => {
      return {
        _id: doctor._id,
        doctor_firstName: doctor.doctor_firstName,
        doctor_lastName: doctor.doctor_lastName,
        doctor_idNumber: doctor.doctor_idNumber,
        doctor_profilePic: doctor.doctor_profilePic,
        doctor_number: doctor.doctor_number,
        email: doctor.email,
        user_id: doctor.user_id,
        department_id: doctor.department_id._id, // Include the department_id for reference
        department_name: doctor.department_id.department_name, // Include the populated department_name
      };
    });
    const totalDoctors = await Doctor.countDocuments();

    // Send the response
    response.status(200).json({ doctorsWithDepartment, totalDoctors });
  } catch (error) {
    next(errorHandler(500, "Error retrieving doctors from the database"));
  }
};

// Get a doctor by ID
export const getDoctorById = async (request, response, next) => {
  const doctorId = request.params.id;
  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return next(errorHandler(404, "Doctor not found"));
    }
    response.status(200).json(doctor);
  } catch (error) {
    next(errorHandler(500, "Error retrieving doctor from the database"));
  }
};

// Update a doctor
export const updateDoctor = async (request, response, next) => {
  const doctorId = request.params.id;
  const {
    doctor_firstName,
    doctor_lastName,
    doctor_idNumber,
    doctor_number,
    email,
    department_id,
    doctor_profilePic,
  } = request.body;
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      {
        doctor_firstName,
        doctor_lastName,
        doctor_idNumber,
        doctor_number,
        email,
        department_id,
        doctor_profilePic,
      },
      { new: true, runValidators: true }
    );
    if (!updatedDoctor) {
      return next(errorHandler(404, "Doctor not found"));
    }
    response.status(200).json(updatedDoctor);
  } catch (error) {
    next(errorHandler(500, "Error updating doctor"));
  }
};

// Delete a doctor
export const deleteDoctor = async (request, response, next) => {
  const doctorId = request.params.id;

  try {
    // Find the Doctor by ID to get the user_id
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return next(errorHandler(404, "Doctor not found"));
    }

    // Retrieve the user_id from the doctor document
    const userId = doctor.user_id;

    // Delete the doctor
    await Doctor.findByIdAndDelete(doctorId);

    // Delete the associated user
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return next(errorHandler(404, "Associated user with ID not found."));
    }

    response
      .status(200)
      .json("Doctor and associated user deleted successfully");
  } catch (error) {
    next(errorHandler(500, "Error deleting doctor or associated user"));
  }
};

// Get doctors by department
export const getDoctorsByDepartment = async (request, response, next) => {
  const departmentId = request.params.department_id;

  try {
    // Find doctors where department_id matches and populate department details
    const doctors = await Doctor.find({ department_id: departmentId })
      .populate("department_id", "department_name")
      .lean();

    if (doctors.length === 0) {
      return next(errorHandler(404, "No doctors found for this department"));
    }

    const totalDoctors = await Doctor.find({
      department_id: departmentId,
    }).countDocuments();

    // Respond with the list of doctors
    response.status(200).json({ doctors, totalDoctors });
  } catch (error) {
    next(errorHandler(500, "Error retrieving doctors from the database"));
  }
};

// Get doctor details
export const getDoctorDetails = async (request, response, next) => {
  const { id } = request.params;

  try {
    // Find the doctor by ID and populate related fields
    const doctor = await Doctor.findById(id)
      .populate({
        path: "department_id",
        select: "department_name",
      })
      .populate({
        path: "user_id",
        select: "username",
      })
      .lean();

    if (!doctor) {
      return next(errorHandler(404, "Doctor not found"));
    }

    // Find appointments related to the doctor
    const appointments = await Appointment.find({ doctor_id: id })
      .populate({
        path: "patient_id",
        select:
          "patient_firstName patient_lastName patient_idNumber patient_dob patient_gender contact_number address",
      })
      .populate({
        path: "department_id",
        select: "department_name",
      });

    // Structure the response
    const doctorDetails = {
      doctor: {
        doctor_id: doctor._id,
        doctor_name: `${doctor.doctor_firstName} ${doctor.doctor_lastName}`,
        department_id: doctor.department_id._id,
        doctor_contact_number: doctor.doctor_number,
        doctor_email: doctor.email,
        department_name: doctor.department_id.department_name,
      },
      patients: [],
    };

    // Group appointments by patient
    appointments.forEach((appointment) => {
      const patient = appointment.patient_id;
      const patientIndex = doctorDetails.patients.findIndex(
        (p) => p.patient_id === patient._id.toString()
      );

      if (patientIndex === -1) {
        doctorDetails.patients.push({
          patient_id: patient._id,
          patient_name: `${patient.patient_firstName} ${patient.patient_lastName}`,
          patient_idNumber: patient.patient_idNumber,
          patient_dob: patient.patient_dob,
          patient_gender: patient.patient_gender,
          patient_contact_number: patient.contact_number,
          patient_address: patient.address,
          appointments: [
            {
              appointment_id: appointment._id,
              appointment_date: appointment.appointment_date,
              appointment_time: appointment.appointment_time,
              appointment_type: appointment.appointment_type,
              appointment_status: appointment.appointment_status,
            },
          ],
        });
      } else {
        doctorDetails.patients[patientIndex].appointments.push({
          appointment_id: appointment._id,
          appointment_date: appointment.appointment_date,
          appointment_time: appointment.appointment_time,
          appointment_type: appointment.appointment_type,
          appointment_status: appointment.appointment_status,
        });
      }
    });

    // Send the structured response
    response.status(200).json(doctorDetails);
  } catch (error) {
    next(
      errorHandler(500, "Error retrieving patient details from the database")
    );
  }
};
