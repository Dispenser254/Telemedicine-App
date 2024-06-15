import bcryptjs from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import Doctor from "../models/doctor.model.js";
import Patient from "../models/patient.model.js";
import Department from "../models/department.model.js";

export const signup = async (request, response, next) => {
  try {
    const {
      username,
      password,
      role,
      patient_name,
      patient_dob,
      patient_gender,
      contact_number,
      address,
      doctor_name,
      doctor_number,
      email,
      department_id,
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
        !patient_name ||
        !patient_dob ||
        !patient_gender ||
        !contact_number ||
        !address
      ) {
        return next(errorHandler(400, "All patient fields are required."));
      }
      // Check if contact number already exists for patients
      const existingPatientNo = await Patient.findOne({ contact_number });
      if (existingPatientNo) {
        return next(
          errorHandler(409, "Contact number already exists for a patient.")
        );
      }
    } else if (role === "doctor") {
      if (!doctor_name || !doctor_number || !email || !department_id) {
        return next(errorHandler(400, "All doctor fields are required."));
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return next(errorHandler(400, "Invalid email format."));
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

      // Check if doctor number, contact number or email already exists for doctors
      const existingDoctor = await Doctor.findOne({
        $or: [{ doctor_number }, { email }],
      });
      if (existingDoctor) {
        if (existingDoctor.doctor_number === doctor_number) {
          return next(errorHandler(409, "Doctor number already exists."));
        }
        if (existingDoctor.email === email) {
          return next(errorHandler(409, "Email already exists."));
        }
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
          patient_name,
          patient_dob,
          patient_gender,
          contact_number,
          address,
          user_id: validUser._id,
        };
        const patient = new Patient(patientData);
        await patient.save();
      } else if (role === "doctor") {
        //Create new doctor
        const doctorData = {
          doctor_name,
          doctor_number,
          email,
          department_id,
          user_id: validUser._id,
        };
        const doctor = new Doctor(doctorData);
        await doctor.save();
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

    const token = !isWalkingPatient
      ? jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" })
      : null;

    const { password: pass, ...rest } = validUser._doc;
    response
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json(rest);
  } catch (error) {
    next(error);
  }
};
