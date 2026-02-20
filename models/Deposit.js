const mongoose = require("mongoose");

const depositSchema = new mongoose.Schema(
  {
    // ======================
    // USER INFO
    // ======================
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    userUid: {
      type: String,
      required: true,
      index: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    // ======================
    // RECHARGE INFO
    // ======================
    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    utr: {
      type: String,
      required: true,
      unique: true, // 🔐 Prevent duplicate UTR
      index: true,
      trim: true,
    },

    paymentMethod: {
      type: String,
      enum: ["upi"],
      default: "upi",
    },

    // ======================
    // STATUS
    // ======================
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled", "abandoned"],
      default: "pending",
    },

    remark: {
      type: String,
      default: null,

    },

    adminRemark: {
      type: String,
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    rejectedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);


// ======================
// INDEXES (Performance)
// ======================
depositSchema.index({ user: 1, status: 1 });
depositSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Deposit", depositSchema);