const mongoose = require("mongoose");

const depositSchema = new mongoose.Schema(
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

    userUid: {
      type: String,
      required: true,
      index: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },


    amount: {
      type: Number,
      required: true,
    },

    utr: {
      type: String,
      required: true,
      unique: true, // 🔐 no duplicate UTR
      index: true,
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
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    adminRemark: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deposit", depositSchema);
