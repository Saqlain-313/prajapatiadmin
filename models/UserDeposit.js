const mongoose = require("mongoose");

const userDepositSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userUid: String,
    mobile: String,

    amount: {
      type: Number,
      required: true,
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    paymentMethod: String,

    status: {
      type: String,
      enum: ["pending", "approved", "failed"],
      default: "pending",
    },

    adminRemark: String,
    approvedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserDeposit", userDepositSchema);
