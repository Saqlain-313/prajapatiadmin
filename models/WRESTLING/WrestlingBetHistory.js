const mongoose = require("mongoose");

const wrestlingBetHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sid: {
      type: String,
      required: true,
    },

    gameId: {
      type: String,
      required: true,
    },

    otype: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    xValue: {
      type: Number,
      required: true,
    },

    resultAmount: {
      type: Number,
      default: 0,
    },

    betAmount: {
      type: Number,
      default: 0,
    },

    status: {
      type: Number,
      default: 0,
    },

    eventName: {
      type: String,
      required: true,
    },

    marketName: {
      type: String,
      required: true,
    },

    gameType: {
      type: String,
      required: true,
    },

    gameName: {
      type: String,
      required: true,
    },

    teamName: {
      type: String,
      required: true,
    },

    betResult: String,        // ✅ Added
    invite: String,           // ✅ Optional but recommended
    userRole: String,         // ✅ Optional but recommended

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

/* =====================
   INDEXES
===================== */

wrestlingBetHistorySchema.index({ userId: 1, sid: 1 });
wrestlingBetHistorySchema.index({ sid: 1, status: 1 });

module.exports = mongoose.model(
  "WrestlingBetHistory",
  wrestlingBetHistorySchema
);