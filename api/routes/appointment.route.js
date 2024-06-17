import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createAppointment,
  deleteAppointment,
  getAllAppointments,
  getAllReports,
  getAppointmentByID,
  updateAppointment,
} from "../controllers/appointment.controller.js";

const router = express.Router();

router.get("/getAppointments", verifyToken, getAllAppointments);
router.get("/getAppointments/:id", verifyToken, getAppointmentByID);
router.post("/createAppointment", verifyToken, createAppointment);
router.put("/getAppointments/:id", verifyToken, updateAppointment);
router.delete("/getAppointments/:id", verifyToken, deleteAppointment);
router.get("/getAllReports", verifyToken, getAllReports);

export default router;
