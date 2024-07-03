import Notification from "../models/notification.model.js";

// Function to create a new notification
export const createNotification = async (userId, message) => {
  try {
    const notification = new Notification({
      user_id: userId,
      message,
    });
    await notification.save();
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

// Function to get notifications by user ID
export const getNotificationsByUserId = async (request, response, next) => {
  const userId = request.params.user_id;
  const limit = parseInt(request.query.limit, 10) || 5;
  try {
    const notifications = await Notification.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .limit(limit);

    if (!notifications) {
      next(errorHandler(404, "Notification not found"));
    }
    response.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    next(errorHandler(500, "An error occurred during fetching notifications."));
  }
};

// Function to update notification viewed status
export const markNotificationAsViewed = async (request, response, next) => {
  const notificationId = request.params.id;
  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      next(errorHandler(404, "Notification not found"));
    }

    notification.viewed = true;
    await notification.save();

    response.status(200).json(notification);
  } catch (error) {
    console.error("Error marking notification as viewed:", error);
    next(
      errorHandler(
        500,
        "An error occurred during marking notification as viewed."
      )
    );
  }
};
