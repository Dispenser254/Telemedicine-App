import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import Patient from "../models/patient.model.js";
import Appointment from "../models/appointment.model.js";
import Doctor from "../models/doctor.model.js";
import { createNotification } from "./notification.controller.js";

// Create a signup
export const signup = async (request, response, next) => {
  try {
    const {
      username,
      email,
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
    if (!username || !email || !password || !role) {
      return next(
        errorHandler(400, "Username, email, password, and role are required.")
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(errorHandler(400, "Invalid email format."));
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
      email,
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
      // Send a notification to the new user
      await createNotification(
        validUser._id,
        "Welcome to the platform! Your account has been created successfully."
      );
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
    const { username, password, role } = request.body;
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

    // Check if the user is active
    if (!validUser.isactive) {
      return next(
        errorHandler(403, "Account is deactivated. Please contact admin.")
      );
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

    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const { password: pass, ...rest } = validUser._doc;
    // Send a notification to the new user
    await createNotification(
      validUser._id,
      "Sign in",
      "Welcome to mediclinic center! You have signed in successfully."
    );
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
export const updateUserById = async (request, response, next) => {
  const userId = request.params.id;
  try {
    const { username, password, email } = request.body;
    const updates = {};

    if (username) {
      // Check if the user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== userId) {
        return next(errorHandler(400, "Username already exists."));
      }
      updates.username = username;
    }

    if (password) {
      if (password.length < 6) {
        return next(
          errorHandler(400, "Password must be at least 6 characters")
        );
      }
      const hashedPassword = bcryptjs.hashSync(password, 10);
      updates.password = hashedPassword;
    }

    if (email) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return next(errorHandler(400, "Invalid email format."));
      }
      updates.email = email;
    }

    if (Object.keys(updates).length === 0) {
      return next(errorHandler(400, "No valid fields provided for update."));
    }

    const updateUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updateUser) {
      return next(errorHandler(404, "User not found."));
    }

    // Send notification
    await createNotification(updateUser._id, "Your profile has been updated.");
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

// Get all users
export const getAllUsers = async (request, response, next) => {
  try {
    const users = await User.find();
    if (!users) {
      return next(errorHandler(404, "Users not found"));
    }
    // Remove the password field from each user object
    const usersWithoutPassword = users.map((user) => {
      const { password, ...userWithoutPassword } = user._doc;
      return userWithoutPassword;
    });
    response.status(200).json(usersWithoutPassword);
  } catch (error) {
    next(errorHandler(500, "Error retrieving users from the database"));
  }
};

export const deactivateUser = async (request, response, next) => {
  const userId = request.params.id;
  try {
    // Find the user by their ID
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    user.isactive = false;
    await user.save();

    response.status(200).json({
      message: "User account has been deactivated successfully",
    });
  } catch (error) {
    next(errorHandler(500, "Error deactivating user account"));
  }
};

export const activateUser = async (request, response, next) => {
  const userId = request.params.id;
  try {
    // Find the user by their ID
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    user.isactive = true;
    await user.save();

    // Send notification
    await createNotification(
      user._id,
      "Your account has been activated successfully."
    );
    response.status(200).json({
      message: "User account has been activated successfully",
    });
  } catch (error) {
    next(errorHandler(500, "Error activating user account"));
  }
};

export const getUserById = async (request, response, next) => {
  const userId = request.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const { password, ...rest } = user._doc;
    response.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
