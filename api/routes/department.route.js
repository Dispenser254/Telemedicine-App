import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
  updateDepartment,
} from "../controllers/department.controller.js";

const router = express.Router();

router.get("/getDepartments", verifyToken, getAllDepartments);
router.post("/createDepartment", verifyToken, createDepartment);
router.put("/getDepartments/:id", verifyToken, updateDepartment);
router.delete("/getDepartments/:id", verifyToken, deleteDepartment);

export default router;
