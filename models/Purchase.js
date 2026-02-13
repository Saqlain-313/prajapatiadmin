const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userUid: String,
    mobile: String,

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    // Razorpay fields
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    paymentMethod: {
      type: String,
      default: "razorpay",
    },

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

module.exports = mongoose.model("Purchase", purchaseSchema);
