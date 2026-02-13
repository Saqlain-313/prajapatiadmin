const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // ======================
    // CONTENT
    // ======================
    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    // info | success | warning | error | promo
    type: {
      type: String,
      enum: ["info", "success", "warning", "error", "promo"],
      default: "info",
      index: true,
    },

    // low | medium | high
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    // ======================
    // TARGETING
    // ======================

    // If true → visible to all users
    isGlobal: {
      type: Boolean,
      default: true,
      index: true,
    },

    // Used only when isGlobal = false
    targetUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ======================
    // ADMIN INFO
    // ======================
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin user
      required: true,
    },

    // ======================
    // STATUS
    // ======================
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },

    // ======================
    // READ TRACKING
    // ======================
    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

/* ======================
   INDEXES
====================== */
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ isGlobal: 1, isActive: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
