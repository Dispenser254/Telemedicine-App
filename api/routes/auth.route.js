import express from "express";
import {
  deleteUser,
  getAdminUsers,
  login,
  signout,
  signup,
  updateUser,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/getAdmins", verifyToken, getAdminUsers);
router.put("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.post("/signout", signout);

export default router;
