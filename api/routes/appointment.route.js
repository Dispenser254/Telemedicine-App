import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createAppointment,
  deleteAppointment,
  getAllAppointments,
  getAppointmentByID,
  updateAppointment,
} from "../controllers/appointment.controller.js";

const router = express.Router();

router.get("/getAppointments", verifyToken, getAllAppointments);
router.get("/getAppointments/:id", verifyToken, getAppointmentByID);
router.get("/createAppointment", verifyToken, createAppointment);
router.put("/getAppointments/:id", verifyToken, updateAppointment);
router.put("/getAppointments/:id", verifyToken, deleteAppointment);

export default router;
