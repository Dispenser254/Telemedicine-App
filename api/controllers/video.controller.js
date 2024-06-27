import VideoConsultation from "../models/videoconsultation.model.js";
import { errorHandler } from "../utils/error.js";
import { generateJitsiMeetLink } from "../utils/generateJitsiMeetLink.js";
import mongoose from "mongoose";

// Get Video consultation by Doctor Id
export const getVideoConsultationsByDoctorId = async (
  request,
  response,
  next
) => {
  const doctorId = request.params.doctor_id;

  try {
    const videoConsultations = await VideoConsultation.find({
      doctor_id: doctorId,
    })
      .populate({
        path: "patient_id",
        select: "patient_firstName patient_lastName",
      })
      .populate({
        path: "appointment_id",
        select: "appointment_time appointment_date",
      })
      .populate({
        path: "doctor_id",
        select: "doctor_firstName doctor_lastName",
      })
      .lean();

    const totalVideoConsultations = await VideoConsultation.find({
      doctor_id: doctorId,
    }).countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthVideoConsultations = await VideoConsultation.find({
      doctor_id: doctorId,
    }).countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    response.status(200).json({
      videoConsultations,
      totalVideoConsultations,
      lastMonthVideoConsultations,
    });
  } catch (error) {
    next(errorHandler(500, "Error retrieving video consultations"));
  }
};

// Get Video Consultation by Patient Id
export const getVideoConsultationsByPatientId = async (
  request,
  response,
  next
) => {
  const patientId = request.params.patient_id;

  if (!patientId) {
    return next(errorHandler(400, "Patient ID is required"));
  }
  try {
    const videoConsultations = await VideoConsultation.find({
      patient_id: patientId,
    })
      .populate({
        path: "patient_id",
        select: "patient_firstName patient_lastName",
      })
      .populate({
        path: "appointment_id",
        select: "appointment_time appointment_date",
      })
      .populate({
        path: "doctor_id",
        select: "doctor_firstName doctor_lastName",
      })
      .lean();

    if (!videoConsultations) {
      return next(
        errorHandler(404, "No video consultations found for this patient")
      );
    }

    const totalVideoConsultations = await VideoConsultation.find({
      patient_id: patientId,
    }).countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthVideoConsultations = await VideoConsultation.find({
      patient_id: patientId,
    }).countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    response
      .status(200)
      .json({
        videoConsultations,
        totalVideoConsultations,
        lastMonthVideoConsultations,
      });
  } catch (error) {
    next(errorHandler(500, "Error retrieving video consultations"));
  }
};

// Create Video Consultation
export const createVideoConsultation = async (request, response, next) => {
  try {
    // Generate Jitsi Meet link
    const videoConsultationLink = generateJitsiMeetLink();

    // Extract data from request body
    const { patient_id, doctor_id, appointment_id } = request.body;

    console.log(patient_id)
    console.log(doctor_id);
    console.log(appointment_id);
    // Validate ObjectId for required fields
    const isValidObjectId = mongoose.Types.ObjectId.isValid;
    if (
      !isValidObjectId(patient_id) ||
      !isValidObjectId(doctor_id) ||
      !isValidObjectId(appointment_id)
    ) {
      return next(errorHandler(400, "Invalid ObjectId"));
    }

    // Create new VideoConsultation object
    const newVideoConsultation = new VideoConsultation({
      patient_id,
      doctor_id,
      appointment_id,
      video_consultation_link: videoConsultationLink,
      consultation_status: "PENDING VIDEO CONSULTATION",
    });

    // Save the new video consultation to the database
    const savedConsultation = await newVideoConsultation.save();

    response.status(201).json(savedConsultation);
  } catch (error) {
    next(errorHandler(500, "Error creating video consultation"));
  }
};

// Get all Video Consultations
export const getAllVideoConsultations = async (request, response, next) => {
  try {
    const videoConsultations = await VideoConsultation.find()
      .populate({
        path: "patient_id",
        select: "patient_firstName patient_lastName",
      })
      .populate({
        path: "appointment_id",
        select: "appointment_time appointment_date",
        populate: {
          path: "doctor_id",
          select: "doctor_firstName doctor_lastName",
        },
      })
      .lean();

    const totalVideoConsultations = await VideoConsultation.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthVideoConsultations = await VideoConsultation.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    response.status(200).json({
      videoConsultations,
      totalVideoConsultations,
      lastMonthVideoConsultations,
    });
  } catch (error) {
    next(errorHandler(500, "Failed to retrieve video consultations"));
  }
};

// Get Video Consultation by Id
export const getVideoConsultationById = async (request, response, next) => {
  const videoConsultationId = request.params.id;

  try {
    const videoConsultation = await VideoConsultation.findById(
      videoConsultationId
    )
      .populate({
        path: "patient_id",
        select: "patient_firstName patient_lastName",
      })
      .populate({
        path: "appointment_id",
        select: "appointment_time appointment_date",
        populate: {
          path: "doctor_id",
          select: "doctor_firstName doctor_lastName",
        },
      })
      .lean();

    if (!videoConsultation) {
      return next(errorHandler(404, "Video consultation not found"));
    }

    response.status(200).json(videoConsultation);
  } catch (error) {
    next(errorHandler(500, "Failed to retrieve video consultation"));
  }
};

// Update Video Consultation
export const updateVideoConsultation = async (request, response, next) => {
  const videoConsultationId = request.params.id;
  const {
    patient_id,
    doctor_id,
    video_consultation_link,
    appointment_id,
    consultation_status,
  } = request.body;

  try {
    const updatedConsultation = await VideoConsultation.findByIdAndUpdate(
      videoConsultationId,
      {
        patient_id,
        doctor_id,
        video_consultation_link,
        appointment_id,
        consultation_status,
      },
      { new: true, runValidators: true }
    );

    if (!updatedConsultation) {
      return next(errorHandler(404, "Video consultation not found"));
    }

    response.status(200).json(updatedConsultation);
  } catch (error) {
    next(errorHandler(500, "Failed to update video consultation"));
  }
};

// Delete a Video Consultation
export const deleteVideoConsultation = async (request, response, next) => {
  const videoConsultationId = request.params.id;

  try {
    const deletedConsultation = await VideoConsultation.findByIdAndDelete(
      videoConsultationId
    );

    if (!deletedConsultation) {
      return next(errorHandler(404, "Video consultation not found"));
    }

    response.status(200).json("Video consultation deleted");
  } catch (error) {
    next(errorHandler(500, "Failed to delete video consultation"));
  }
};
