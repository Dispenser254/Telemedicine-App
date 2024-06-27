import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import Patient from "../models/patient.model.js";
import Appointment from "../models/appointment.model.js";
import Doctor from "../models/doctor.model.js";

// Create a signup
export const signup = async (request, response, next) => {
  try {
    const {
      username,
      password,
      role,
      patient_firstName,
      patient_lastName,
      patient_idNumber,
      patient_dob,
      patient_gender,
      contact_number,
      address,
    } = request.body;

    // Check for common required fields
    if (!username || !password || !role) {
      return next(
        errorHandler(400, "Username, password, and role are required.")
      );
    }

    // Role-specific validations
    if (role === "patient") {
      if (
        !patient_firstName ||
        !patient_lastName ||
        !patient_idNumber ||
        !patient_dob ||
        !patient_gender ||
        !contact_number ||
        !address
      ) {
        return next(errorHandler(400, "All patient fields are required."));
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
    } else if (role !== "admin") {
      return next(errorHandler(400, "Invalid role specified."));
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return next(errorHandler(400, "Username already exists."));
    }

    //Create new user
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const validUser = await User({
      username,
      password: hashedPassword,
      role,
    });
    await validUser.save();

    try {
      if (role === "patient") {
        //Create new patient
        const patientData = {
          patient_firstName,
          patient_lastName,
          patient_idNumber,
          patient_dob,
          patient_gender,
          contact_number,
          address,
          user_id: validUser._id,
        };
        const patient = new Patient(patientData);
        await patient.save();
      }

      // User and respective role entity creation successful
      response.status(201).json("User created successfully");
    } catch (rollError) {
      // Error occurred while creating role-specific data
      await User.findByIdAndDelete(validUser._id);
      return next(
        errorHandler(
          500,
          "An error occurred while creating role-specific data."
        )
      );
    }
  } catch (error) {
    next(errorHandler(500, "An error occurred during signup."));
  }
};

export const login = async (request, response, next) => {
  try {
    const { username, password, role, isWalkingPatient } = request.body;
    if (!username || !password) {
      return next(errorHandler(404, "All fields are required."));
    }

    // Find user by username
    const validUser = await User.findOne({ username });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    // Validate password
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Invalid password"));
    }

    if (validUser?.role !== role) {
      return next(errorHandler(401, "Invalid user access"));
    }

    // If the user is a patient, fetch the patient_id and appointment_id
    let patientId = null;
    let appointmentId = null;
    if (validUser.role === "patient") {
      const patient = await Patient.findOne({ user_id: validUser._id });
      if (patient) {
        patientId = patient._id;

        // Fetch the latest appointment for the patient
        const appointment = await Appointment.findOne({
          patient_id: patientId,
        }).sort({ date: -1 }); // Assuming you have a date field and you want the latest appointment

        if (appointment) {
          appointmentId = appointment._id;
        }
      } else {
        return next(errorHandler(404, "Patient record not found."));
      }
    }

    let doctorId = null;
    if (validUser.role === "doctor") {
      const doctor = await Doctor.findOne({ user_id: validUser._id });
      if (doctor) {
        doctorId = doctor._id;
      } else {
        return next(errorHandler(404, "Doctor record not found."));
      }
    }

    const token = !isWalkingPatient
      ? jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" })
      : null;

    const { password: pass, ...rest } = validUser._doc;
    response
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json({
        ...rest,
        patient_id: patientId,
        doctor_id: doctorId,
        appointment_id: appointmentId,
      });
  } catch (error) {
    next(errorHandler(500, "Error signing in."));
  }
};

export const signout = (request, response, next) => {
  try {
    response
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    next(errorHandler(500, "Error signing out."));
  }
};

export const updateUser = async (request, response, next) => {
  const userId = request.params.id;
  try {
    const { username, password } = request.body;
    if (password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters"));
    }
    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return next(errorHandler(400, "Username already exists."));
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        username,
        password: hashedPassword,
      },
      { new: true, runValidators: true }
    );

    response.status(200).json("User updated successfully.");
  } catch (error) {
    next(errorHandler(500, "Error updating user"));
  }
};

// Delete a user with the role of admin
export const deleteUser = async (request, response, next) => {
  try {
    const userId = request.params.id;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }

    // Check if the user has the role of 'admin'
    if (user.role !== "admin") {
      return response.status(403).json({ error: "Only admins can be deleted" });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);
    response.status(200).json("Admin user has been deleted");
  } catch (error) {
    next(errorHandler(500, "Error deleting admin"));
  }
};

// Get all users with the role of admin
export const getAdminUsers = async (request, response, next) => {
  try {
    const adminUsers = await User.find({ role: "admin" })
      .select("username role")
      .lean();

    if (adminUsers.length === 0) {
      return next(errorHandler(404, "No admin users found"));
    }

    const totalAdminUsers = await User.find({ role: "admin" }).countDocuments();
    response.status(200).json({ adminUsers, totalAdminUsers });
  } catch (error) {
    next(errorHandler(500, "Error fetching admins from the database."));
  }
};
