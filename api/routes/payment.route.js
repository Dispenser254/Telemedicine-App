import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createPayment } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/createPayment", verifyToken, createPayment);

export default router;
