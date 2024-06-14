import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import Doctor from "../models/doctor.model.js";
import Patient from "../models/patient.model.js";

export const signup = async (request, response, next) => {
  try {
    const {
      username,
      password,
      role,
      patient_name,
      patient_age,
      patient_gender,
      contact_number,
      address,
    } = request.body;

    if (
      !username ||
      !password ||
      !role ||
      (role === "patient" &&
        (!patient_name ||
          !patient_age ||
          !patient_gender ||
          !contact_number ||
          !address))
    ) {
      return next(errorHandler(400, "All fields are required."));
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
    if (role === "patient") {
      //Create new patient
      const patientData = {
        patient_name,
        patient_age,
        patient_gender,
        contact_number,
        address,
        user_id: validUser._id,
      };
      const patient = new Patient(patientData);
      await patient.save();
    }

    if (role === "doctor") {
      //Create new doctor
      const doctorData = { ...request.body, user_id: validUser._id };
      const doctor = new Doctor(doctorData);
      await doctor.save();
    }

    response.status(201).json("User created successfully");
  } catch (error) {
    next(errorHandler(error, "An error occurred during signup."));
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
