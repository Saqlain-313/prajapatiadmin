const express = require("express");
const router = express.Router();

const {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
} = require("../controllers/notificationController");

const protect = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");


router.post(
  "/admin/notification/create",
  protect,
//   adminMiddleware,
  createNotification
);


router.get(
  "/admin/notification/user",
  protect,
  getUserNotifications
);

router.put(
  "/admin/notification/read/:notificationId",
  protect,
  markNotificationAsRead
);

module.exports = router;
