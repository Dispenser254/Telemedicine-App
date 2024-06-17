import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  deleteDoctor,
  getAllDoctors,
  getDoctorById,
  getDoctorDetails,
  getDoctorsByDepartment,
  updateDoctor,
} from "../controllers/doctor.controller.js";

const router = express.Router();

router.get("/getDoctors", verifyToken, getAllDoctors);
router.get("/getDoctors/:id", verifyToken, getDoctorById);
router.put("/getDoctors/:id", verifyToken, updateDoctor);
router.delete("/getDoctors/:id", verifyToken, deleteDoctor);
router.get(
  "/getDoctors/department/:department_id",
  verifyToken,
  getDoctorsByDepartment
);
router.get("/getDoctors/appointmentDetails/:id", verifyToken, getDoctorDetails);

export default router;