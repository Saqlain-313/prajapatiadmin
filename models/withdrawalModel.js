const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema(
  {
    // ======================
    // USER
    // ======================
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ======================
    // AMOUNT
    // ======================
    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    // ======================
    // PAYMENT DETAILS
    // ======================
    method: {
      type: String,
      enum: ["upi", "bank"],
      required: true,
    },

    upiId: {
      type: String,
      trim: true,
    },

    bankDetails: {
      accountHolder: String,
      accountNumber: String,
      ifsc: String,
      bankName: String,
    },

    // ======================
    // STATUS FLOW
    // ======================
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },


    adminRemark: {
      type: String,
      default: null,
    },

    processedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Withdrawal", withdrawalSchema);
