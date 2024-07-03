import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { getNotificationsByUserId, markNotificationAsViewed } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/getNotifications/:user_id", verifyToken, getNotificationsByUserId);
router.put("/getNotifications/:id", verifyToken, markNotificationAsViewed);

export default router;
