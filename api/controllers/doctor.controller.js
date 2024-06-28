import Appointment from "../models/appointment.model.js";
import Department from "../models/department.model.js";
import Doctor from "../models/doctor.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import mongoose from "mongoose";

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

// Create a new doctor
export const createDoctor = async (request, response, next) => {
  const {
    doctor_firstName,
    doctor_lastName,
    doctor_idNumber,
    doctor_number,
    department_id,
    username,
    email,
    password,
    role = "doctor",
  } = request.body;

  try {
    // Check for common required fields
    if (!username || !email || !password || !role) {
      return next(
        errorHandler(400, "Username, password, email and role are required.")
      );
    }

    // Validate if department_id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(department_id)) {
      return next(errorHandler(400, "Invalid department ID format."));
    }

    // Validate if the department exists
    const departmentExists = await Department.exists({
      _id: department_id,
    });
    if (!departmentExists) {
      return next(
        errorHandler(400, "The specified department does not exist.")
      );
    }

    // Check if doctor number, contact number already exists for doctors
    const existingDoctor = await Doctor.findOne({
      doctor_idNumber,
      doctor_number,
    });
    if (existingDoctor) {
      if (existingDoctor.doctor_idNumber === doctor_idNumber) {
        return next(errorHandler(409, "Doctor ID number already exists."));
      }
      if (existingDoctor.doctor_number === doctor_number) {
        return next(errorHandler(409, "Doctor number already exists."));
      }
    }
    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return next(errorHandler(400, "Username already exists."));
    }
    // Check if the user already exists by email
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return next(errorHandler(400, "Email already exists."));
    }

    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create a new user with hashed password
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    // Save the new user
    const savedUser = await newUser.save();

    try {
      // Use the saved user's ID for the doctor
      const newDoctor = new Doctor({
        doctor_firstName,
        doctor_lastName,
        doctor_idNumber,
        doctor_number,
        department_id,
        user_id: savedUser._id,
        doctor_profilePic:
          "https://imgs.search.brave.com/gV6Xy99WsNTWpgT2KUNxopKhP45u8QMrrL2DGi5HYxg/rs:fit:500:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzE1Lzg0LzQz/LzM2MF9GXzIxNTg0/NDMyNV90dFg5WWlJ/SXllYVI3TmU2RWFM/TGpNQW15NEd2UEM2/OS5qcGc",
      });

      // Save the new doctor
      const savedDoctor = await newDoctor.save();

      // Respond with the new doctor data
      response.status(201).json(savedDoctor);
    } catch (rollError) {
      console.log(rollError);
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
    next(errorHandler(500, "Error creating doctor and user"));
  }
};
