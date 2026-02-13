const Notification = require("../models/Notification");


exports.createNotification = async (req, res) => {
  try {
    const { title, message, type, priority, expiresAt } = req.body;


    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required",
      });
    }

    const notification = await Notification.create({
      title,
      message,
      type: type || "info",
      priority: priority || "medium",
      isGlobal: true,               // 🔒 FIXED: GLOBAL
      createdBy: req.user._id,      // admin id
      expiresAt: expiresAt || null,
    });

    return res.status(201).json({
      success: true,
      message: "Notification created successfully",
      notification,
    });
  } catch (error) {
    console.error("CREATE NOTIFICATION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({
      isGlobal: true,
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gte: new Date() } },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    const formatted = notifications.map((n) => {
      const isRead = n.readBy.some(
        (r) => r.user.toString() === userId.toString()
      );

      return {
        ...n,
        isRead,
      };
    });

    return res.status(200).json({
      success: true,
      notifications: formatted,
    });
  } catch (error) {
    console.error("GET NOTIFICATIONS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ==============================
   USER → MARK AS READ
============================== */
exports.markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    const alreadyRead = notification.readBy.some(
      (r) => r.user.toString() === userId.toString()
    );

    if (!alreadyRead) {
      notification.readBy.push({ user: userId });
      await notification.save();
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error("MARK READ ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
